package eu.idura.example;

import eu.idura.signatures.AddSignatoryInputBuilder;
import eu.idura.signatures.CloseSignatureOrderInputBuilder;
import eu.idura.signatures.CreateSignatureOrderInputBuilder;
import eu.idura.signatures.DocumentInputBuilder;
import eu.idura.signatures.DocumentStorageMode;
import eu.idura.signatures.IduraSignaturesSDKJava;
import eu.idura.signatures.PadesDocumentInputBuilder;
import eu.idura.signatures.QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument;
import eu.idura.signatures.SignatoryStatus;
import eu.idura.signatures.SignatoryUiInputBuilder;
import eu.idura.signatures.SignatureOrderStatus;
import io.javalin.Javalin;

import java.util.List;

public class Application {
    public static void main(String[] args) throws Exception {
        var clientId = System.getenv("CRIIPTO_SIGNATURES_CLIENT_ID");
        var clientSecret = System.getenv("CRIIPTO_SIGNATURES_CLIENT_SECRET");
        if (clientId == null || clientSecret == null) {
            throw new IllegalStateException(
                "CRIIPTO_SIGNATURES_CLIENT_ID and CRIIPTO_SIGNATURES_CLIENT_SECRET must be set"
            );
        }

        var client = new IduraSignaturesSDKJava(clientId, clientSecret);

        var app = Javalin.create(config -> {
        }).exception(Exception.class, (e, ctx) -> {
            e.printStackTrace();
            ctx.status(500).result("Error: " + e.getMessage() + "\n\n" + e);
        }).start(8080);

        // Renders a file input field, prompting the user to upload a file.
        app.get("/", ctx -> ctx.html(
            "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<body>\n" +
            "<h1>Upload a file to start the signature process</h1>\n" +
            "<input type=\"file\" accept=\"application/pdf\" id=\"fileInput\" />\n" +
            "<button onclick=\"upload()\">Upload!</button>\n" +
            "<script>\n" +
            "async function upload() {\n" +
            "    const file = document.getElementById('fileInput').files[0];\n" +
            "    if (!file) return;\n" +
            "    const res = await fetch('/upload', {\n" +
            "        method: 'POST',\n" +
            "        body: file,\n" +
            "        headers: { 'Content-Type': 'application/octet-stream' }\n" +
            "    });\n" +
            "    document.open();\n" +
            "    document.write(await res.text());\n" +
            "    document.close();\n" +
            "}\n" +
            "</script>\n" +
            "</body>\n" +
            "</html>"
        ));

        // Called when the user submits the index page.
        // The file is uploaded as raw binary (application/octet-stream) to avoid
        // Jetty's multipart parser failing on binary PDF content.
        app.post("/upload", ctx -> {
            var pdf = ctx.bodyAsBytes();
            if (pdf.length == 0) {
                ctx.redirect("/");
                return;
            }

            var signatureOrder = client.createSignatureOrder(
                new CreateSignatureOrderInputBuilder(
                    List.of(new DocumentInputBuilder()
                        .pdf(new PadesDocumentInputBuilder(pdf, DocumentStorageMode.Temporary, "My document")
                            .build())
                        .build())
                ).build()
            ).get();

            // Now that we have a signature order, add someone to sign it.
            var signatory = client.addSignatory(
                new AddSignatoryInputBuilder(signatureOrder.getId())
                    .ui(new SignatoryUiInputBuilder()
                        // Return to our application once the signatory completes the process.
                        .signatoryRedirectUri("http://localhost:8080/callback/" + signatureOrder.getId())
                        .build())
                    .build()
            ).get();

            // Render a page with the link to the Idura hosted signature page.
            ctx.html(
                "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<body>\n" +
                "<p>Use the following link to sign your document:</p>\n" +
                "<a href=\"" + signatory.getHref() + "\" target=\"_blank\">" + signatory.getHref() + "</a>\n" +
                "</body>\n" +
                "</html>"
            );
        });

        // This route is called when a signatory finishes their signature process, either by
        // completing or rejecting the signature request. This is controlled by the
        // `signatoryRedirectUri` option passed to `addSignatory`.
        app.get("/callback/{signatureOrderId}", ctx -> {
            var signatureOrderId = ctx.pathParam("signatureOrderId");

            var signatureOrder = client.querySignatureOrder(signatureOrderId).get();

            // Check if there are any signatories still pending.
            var hasPending = signatureOrder.getSignatories().stream()
                .anyMatch(s -> s.getStatus() == SignatoryStatus.Open);
            if (hasPending) {
                ctx.result("One or more signatories are still pending");
                return;
            }

            // Only try to close the signature order if it's not already closed.
            if (signatureOrder.getStatus() == SignatureOrderStatus.Open) {
                client.closeSignatureOrder(
                    new CloseSignatureOrderInputBuilder(signatureOrderId)
                        .retainDocumentsForDays(1)
                        .build()
                ).get();
            }

            // Query the signature order to get the finished documents.
            var withDocuments = client.querySignatureOrderWithDocuments(signatureOrderId).get();
            var document = withDocuments.getDocuments().isEmpty()
                ? null
                : withDocuments.getDocuments().get(0);

            if (document instanceof QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument) {
                var pdf = (QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument) document;
                if (pdf.getBlob() != null) {
                    ctx.contentType("application/pdf");
                    ctx.header("Content-Disposition", "inline; filename=signed.pdf");
                    ctx.result(pdf.getBlob());
                    return;
                }
            }
            ctx.redirect("/");
        });
    }
}
