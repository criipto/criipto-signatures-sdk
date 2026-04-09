package eu.idura.example

import eu.idura.signatures.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    val clientId = System.getenv("CRIIPTO_SIGNATURES_CLIENT_ID")
        ?: error("CRIIPTO_SIGNATURES_CLIENT_ID not set")
    val clientSecret = System.getenv("CRIIPTO_SIGNATURES_CLIENT_SECRET")
        ?: error("CRIIPTO_SIGNATURES_CLIENT_SECRET not set")

    val client = IduraSignaturesSDK(clientId, clientSecret)

    embeddedServer(Netty, port = 8080, configure = {
        maxChunkSize = 32 * 1024 * 1024 // 32 MB
    }) {
        install(StatusPages) {
            exception<Throwable> { call, cause ->
                cause.printStackTrace()
                call.respondText(
                    "Error: ${cause.message}\n\n${cause.stackTraceToString()}",
                    status = HttpStatusCode.InternalServerError,
                )
            }
        }
        routing {
            get("/") {
                call.respondText(
                    """
                    <!DOCTYPE html>
                    <html>
                    <body>
                    <h1>Upload a file to start the signature process</h1>
                    <form method="POST" enctype="multipart/form-data" action="/upload">
                        <input type="file" accept="application/pdf" name="file" />
                        <button type="submit">Upload!</button>
                    </form>
                    </body>
                    </html>
                    """.trimIndent(),
                    ContentType.Text.Html,
                )
            }

            post("/upload") {
                var rawBytes: ByteArray? = null
                call.receiveMultipart().forEachPart { part ->
                    if (part is PartData.FileItem && part.name == "file") {
                        rawBytes = part.streamProvider().readBytes()
                    }
                    part.dispose()
                }
                val pdfBytes = rawBytes ?: run { call.respondRedirect("/"); return@post }

                val signatureOrder = client.createSignatureOrder(
                    CreateSignatureOrderInput(
                        documents = listOf(
                            DocumentInput(
                                pdf = PadesDocumentInput(
                                    title = "My document",
                                    blob = pdfBytes,
                                    storageMode = DocumentStorageMode.Temporary,
                                ),
                            ),
                        ),
                    ),
                )

                val signatory = client.addSignatory(
                    AddSignatoryInput(
                        signatureOrderId = signatureOrder.id,
                        ui = SignatoryUiInput(
                            signatoryRedirectUri = "http://localhost:8080/callback/${signatureOrder.id}",
                        ),
                    ),
                )

                call.respondText(
                    """
                    <!DOCTYPE html>
                    <html>
                    <body>
                    <p>Use the following link to sign your document:</p>
                    <a href="${signatory.href}" target="_blank">${signatory.href}</a>
                    </body>
                    </html>
                    """.trimIndent(),
                    ContentType.Text.Html,
                )
            }

            // Route called by signatoryRedirectUri after the signatory completes or rejects.
            get("/callback/{signatureOrderId}") {
                val signatureOrderId = call.parameters["signatureOrderId"]!!

                val signatureOrder = client.querySignatureOrder(id = signatureOrderId)

                if (signatureOrder.signatories.any { it.status == SignatoryStatus.Open }) {
                    call.respondText("One or more signatories are still pending")
                    return@get
                }

                if (signatureOrder.status == SignatureOrderStatus.Open) {
                    client.closeSignatureOrder(
                        CloseSignatureOrderInput(
                            signatureOrderId = signatureOrderId,
                            retainDocumentsForDays = 1,
                        ),
                    )
                }

                val withDocuments = client.querySignatureOrderWithDocuments(id = signatureOrderId)
                val document = withDocuments.documents.firstOrNull()

                // blob is specific to this operation — use the concrete class to access it.
                // Common fields (id, title, form, …) are available through the PdfDocument interface.
                val blob = (document as? QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument)?.blob
                if (blob != null) {
                    call.response.header(
                        HttpHeaders.ContentDisposition,
                        "inline; filename=signed.pdf",
                    )
                    call.respondBytes(blob, ContentType.Application.Pdf)
                } else {
                    call.respondRedirect("/")
                }
            }
        }
    }.start(wait = true)
}
