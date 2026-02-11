use criipto_signatures_rs::types::{DocumentInput, DocumentStorageMode, PadesDocumentInput};
use reqwest_crate::{blocking::Client, header::HeaderMap};

pub fn make_client() -> Client {
    let client_id = std::env::var("CRIIPTO_SIGNATURES_CLIENT_ID").expect("CLIENT_ID must be set");
    let client_secret = std::env::var("CRIIPTO_SIGNATURES_CLIENT_SECRET").expect("CLIENT_SECRET must be set");

    criipto_signatures_rs::reqwest::create_reqwest_blocking_client(&criipto_signatures_rs::CriiptoSignaturesClientOpts::new(client_id, client_secret)).expect("Failed to create client")
}

pub fn make_document_input() -> DocumentInput {
    DocumentInput {
        pdf: Some(PadesDocumentInput {
            title: "My PDF Document".to_string(),
            blob: include_bytes!("../../sample.pdf").to_vec(),
            reference: None,
            storageMode: DocumentStorageMode::Temporary,
            displayDocumentID: None,
            form: None,
            sealsPageTemplate: None,
            removeBookmarks: None,
        }),
        keepPreviousSignatures: None,
        removePreviousSignatures: None,
        xml: None,
    }
}
