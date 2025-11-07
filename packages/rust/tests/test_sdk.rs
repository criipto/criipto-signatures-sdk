use criipto_signatures_rs::{
    operations::CriiptoSignatureClientMethodsBlocking,
    types::{AddSignatoryInput, CreateSignatureOrderInput},
};

mod common;

#[test]
fn test_create_signature_order_add_signatory() {
    let client = common::make_client();

    let signature_order = client
        .createSignatureOrder(CreateSignatureOrderInput {
            title: Some("Test Signature Order".to_string()),
            expiresInDays: Some(1),
            documents: vec![common::make_document_input()],
            ..Default::default()
        })
        .unwrap();

    let data = signature_order.data.unwrap();
    assert!(data.createSignatureOrder.signatureOrder.id.len() > 0);

    let signatory = client
        .addSignatory(AddSignatoryInput {
            signatureOrderId: data.createSignatureOrder.signatureOrder.id,
            documents: None,
            evidenceProviders: None,
            evidenceValidation: None,
            reference: None,
            role: None,
            signatoryRole: None,
            signatureAppearance: None,
            signingAs: None,
            signingSequence: None,
            ui: None,
        })
        .unwrap();

    let data = signatory.data.unwrap();
    assert!(data.addSignatory.signatory.id.len() > 0);
}
