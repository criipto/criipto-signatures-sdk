package eu.idura.signatures;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

public class JavaSdkTest {
    private final IduraSignaturesSDKJava client = new IduraSignaturesSDKJava(
        Objects.requireNonNull(System.getenv("CRIIPTO_SIGNATURES_CLIENT_ID"), "CRIIPTO_SIGNATURES_CLIENT_ID not set"),
        Objects.requireNonNull(System.getenv("CRIIPTO_SIGNATURES_CLIENT_SECRET"), "CRIIPTO_SIGNATURES_CLIENT_SECRET not set")
    );

    private static byte[] loadResource(String name) throws IOException {
        try (var stream = JavaSdkTest.class.getClassLoader().getResourceAsStream(name)) {
            Objects.requireNonNull(stream, "Resource not found: " + name);
            return stream.readAllBytes();
        }
    }

    @Test
    void createSignatureOrderAndAddSignatory() throws Exception {
        var pdf = loadResource("sample.pdf");

        var signatureOrder = client.createSignatureOrder(
            new CreateSignatureOrderInputBuilder(
                List.of(new DocumentInputBuilder()
                    .pdf(new PadesDocumentInputBuilder(pdf, DocumentStorageMode.Temporary, "Java sample document")
                        .build())
                    .build())
            )
            .title("Java sample signature order")
            .expiresInDays(1)
            .build()
        ).get();

        assertNotNull(signatureOrder.getId());

        var signatory = client.addSignatory(
            new AddSignatoryInputBuilder(signatureOrder.getId()).build()
        ).get();

        assertFalse(signatory.getHref().isEmpty());

        client.cancelSignatureOrder(
            new CancelSignatureOrderInputBuilder(signatureOrder.getId()).build()
        ).get();
    }

    @Test
    void createSignatureOrderWithForm() throws Exception {
        var pdf = loadResource("sample-form.pdf");

        var signatureOrder = client.createSignatureOrder(
            new CreateSignatureOrderInputBuilder(
                List.of(new DocumentInputBuilder()
                    .pdf(new PadesDocumentInputBuilder(pdf, DocumentStorageMode.Temporary, "Java sample form document")
                        .form(new PadesDocumentFormInputBuilder(true).build())
                        .build())
                    .build())
            )
            .title("Java sample signature order")
            .expiresInDays(1)
            .build()
        ).get();

        var document = signatureOrder.getDocuments().get(0);
        assertInstanceOf(PdfDocument.class, document);
        var pdf0 = (PdfDocument) document;
        assertNotNull(pdf0.getForm());
        assertTrue(pdf0.getForm().getEnabled());

        client.cancelSignatureOrder(
            new CancelSignatureOrderInputBuilder(signatureOrder.getId()).build()
        ).get();
    }

    @Test
    void changeMaxSignatories() throws Exception {
        var pdf = loadResource("sample.pdf");

        var signatureOrder = client.createSignatureOrder(
            new CreateSignatureOrderInputBuilder(
                List.of(new DocumentInputBuilder()
                    .pdf(new PadesDocumentInputBuilder(pdf, DocumentStorageMode.Temporary, "Java sample document")
                        .build())
                    .build())
            )
            .title("Java sample signature order")
            .expiresInDays(1)
            .maxSignatories(10)
            .build()
        ).get();

        assertNotNull(signatureOrder.getId());

        var changed = client.changeSignatureOrder(
            new ChangeSignatureOrderInputBuilder(signatureOrder.getId())
                .maxSignatories(20)
                .build()
        ).get();

        assertEquals(20, changed.getMaxSignatories());

        client.cancelSignatureOrder(
            new CancelSignatureOrderInputBuilder(signatureOrder.getId()).build()
        ).get();
    }

    @Test
    void listSignatureOrders() throws Exception {
        var pdf = loadResource("sample.pdf");

        var signatureOrder = client.createSignatureOrder(
            new CreateSignatureOrderInputBuilder(
                List.of(new DocumentInputBuilder()
                    .pdf(new PadesDocumentInputBuilder(pdf, DocumentStorageMode.Temporary, "Java sample document")
                        .build())
                    .build())
            )
            .title("Java sample signature order " + System.currentTimeMillis())
            .expiresInDays(1)
            .build()
        ).get();

        // listSignatureOrders is a single-page call. CI environments can accumulate many
        // open orders across runs, so we only verify the call succeeds and returns valid
        // data rather than searching for the specific order in a potentially large set.
        var orders = client.listSignatureOrders(10, SignatureOrderStatus.Open).get();
        assertFalse(orders.isEmpty());
        assertTrue(orders.stream().allMatch(o -> !o.getId().isEmpty()));

        client.cancelSignatureOrder(
            new CancelSignatureOrderInputBuilder(signatureOrder.getId()).build()
        ).get();
    }

    @Test
    void signatoryRole() throws Exception {
        var pdf = loadResource("sample.pdf");
        var role = "CEO";

        var signatureOrder = client.createSignatureOrder(
            new CreateSignatureOrderInputBuilder(
                List.of(new DocumentInputBuilder()
                    .pdf(new PadesDocumentInputBuilder(pdf, DocumentStorageMode.Temporary, "Java sample document")
                        .build())
                    .build())
            )
            .title("Java sample signature order")
            .expiresInDays(1)
            .build()
        ).get();

        var signatory = client.addSignatory(
            new AddSignatoryInputBuilder(signatureOrder.getId())
                .role(role)
                .build()
        ).get();

        assertEquals(role, signatory.getRole());

        client.cancelSignatureOrder(
            new CancelSignatureOrderInputBuilder(signatureOrder.getId()).build()
        ).get();
    }
}
