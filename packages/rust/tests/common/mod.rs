use criipto_signatures_rs::types::{DocumentInput, DocumentStorageMode, PadesDocumentInput};
use reqwest_crate::{blocking::Client, header::HeaderMap};

pub fn make_client() -> Client {
    let client_id = std::env::var("CRIIPTO_SIGNATURES_CLIENT_ID").expect("CLIENT_ID must be set");
    let client_secret = std::env::var("CRIIPTO_SIGNATURES_CLIENT_SECRET").expect("CLIENT_SECRET must be set");

    let base64_credentials = format!("{}:{}", client_id, client_secret);
    let encoded_credentials = base64::encode(base64_credentials);

    Client::builder()
        .user_agent("graphql-rust/0.10.0")
        .default_headers({
            let mut headers = HeaderMap::new();
            headers.insert("Authorization", format!("Basic {}", encoded_credentials).parse().unwrap());
            headers
        })
        .build()
        .unwrap()
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
        }),
        removePreviousSignatures: None,
        xml: None,
    }
}
