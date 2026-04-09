package eu.idura.signatures

import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

private val samplePdf: ByteArray =
    object {}.javaClass.classLoader.getResourceAsStream("sample.pdf")!!.readBytes()
private val sampleFormPdf: ByteArray =
    object {}.javaClass.classLoader.getResourceAsStream("sample-form.pdf")!!.readBytes()

private val documentFixture =
    DocumentInput(
        pdf =
            PadesDocumentInput(
                title = "Kotlin sample document",
                blob = samplePdf,
                storageMode = DocumentStorageMode.Temporary,
            ),
    )

class SdkTest {
    private val sdk =
        IduraSignaturesSDK(
            clientId =
                System.getenv("CRIIPTO_SIGNATURES_CLIENT_ID")
                    ?: error("CRIIPTO_SIGNATURES_CLIENT_ID not set"),
            clientSecret =
                System.getenv("CRIIPTO_SIGNATURES_CLIENT_SECRET")
                    ?: error("CRIIPTO_SIGNATURES_CLIENT_SECRET not set"),
        )

    @Test
    fun testCreateSignatureOrderAddSignatory() =
        runTest {
            val signatureOrder =
                sdk.createSignatureOrder(
                    CreateSignatureOrderInput(
                        title = "Kotlin sample signature order",
                        expiresInDays = 1,
                        documents = listOf(documentFixture),
                    ),
                )

            assertNotNull(signatureOrder.id)

            val signatory =
                sdk.addSignatory(
                    AddSignatoryInput(signatureOrderId = signatureOrder.id),
                )

            assertTrue(signatory.href.isNotEmpty())

            sdk.cancelSignatureOrder(
                CancelSignatureOrderInput(signatureOrderId = signatureOrder.id),
            )
        }

    @Test
    fun testCreateSignatureOrderWithForm() =
        runTest {
            val signatureOrder =
                sdk.createSignatureOrder(
                    CreateSignatureOrderInput(
                        title = "Kotlin sample signature order",
                        expiresInDays = 1,
                        documents =
                            listOf(
                                DocumentInput(
                                    pdf =
                                        PadesDocumentInput(
                                            title = "Kotlin sample form document",
                                            blob = sampleFormPdf,
                                            storageMode = DocumentStorageMode.Temporary,
                                            form = PadesDocumentFormInput(enabled = true),
                                        ),
                                ),
                            ),
                    ),
                )

            val document = signatureOrder.documents[0]
            assertIs<PdfDocument>(document)
            val form = document.form
            assertNotNull(form)
            assertTrue(form.enabled)

            sdk.cancelSignatureOrder(
                CancelSignatureOrderInput(signatureOrderId = signatureOrder.id),
            )
        }

    @Test
    fun testChangeMaxSignatories() =
        runTest {
            val signatureOrder =
                sdk.createSignatureOrder(
                    CreateSignatureOrderInput(
                        title = "Kotlin sample signature order",
                        expiresInDays = 1,
                        maxSignatories = 10,
                        documents = listOf(documentFixture),
                    ),
                )

            assertNotNull(signatureOrder.id)

            val changed =
                sdk.changeSignatureOrder(
                    ChangeSignatureOrderInput(
                        signatureOrderId = signatureOrder.id,
                        maxSignatories = 20,
                    ),
                )

            assertEquals(20, changed.maxSignatories)

            sdk.cancelSignatureOrder(
                CancelSignatureOrderInput(signatureOrderId = signatureOrder.id),
            )
        }

    @Test
    fun testListSignatureOrders() =
        runTest {
            val title = "Kotlin sample signature order ${System.currentTimeMillis()}"

            val signatureOrder =
                sdk.createSignatureOrder(
                    CreateSignatureOrderInput(
                        title = title,
                        expiresInDays = 1,
                        documents = listOf(documentFixture),
                    ),
                )

            val signatureOrders =
                sdk.listSignatureOrders(
                    first = 1000,
                    status = SignatureOrderStatus.Open,
                )

            val found = signatureOrders.find { it.id == signatureOrder.id }
            assertNotNull(found)
            assertEquals(title, found.title)

            sdk.cancelSignatureOrder(
                CancelSignatureOrderInput(signatureOrderId = signatureOrder.id),
            )
        }

    @Test
    fun testSignatoryRole() =
        runTest {
            val role = "CEO"

            val signatureOrder =
                sdk.createSignatureOrder(
                    CreateSignatureOrderInput(
                        title = "Kotlin sample signature order",
                        expiresInDays = 1,
                        documents = listOf(documentFixture),
                    ),
                )

            val signatory =
                sdk.addSignatory(
                    AddSignatoryInput(
                        signatureOrderId = signatureOrder.id,
                        role = role,
                    ),
                )

            assertEquals(role, signatory.role)

            sdk.cancelSignatureOrder(
                CancelSignatureOrderInput(signatureOrderId = signatureOrder.id),
            )
        }
}
