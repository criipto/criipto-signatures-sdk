use ::reqwest::blocking::Client;
use criipto_signatures_rs::{
    operations::{createSignatureOrder, op_createSignatureOrder},
    types::{CreateSignatureOrderInput, DocumentInput, DocumentStorageMode, PadesDocumentInput},
};

fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    let client_id = std::env::var("CLIENT_ID")?;
    let client_secret = std::env::var("CLIENT_SECRET")?;

    let base64_credentials = format!("{}:{}", client_id, client_secret);
    let encoded_credentials = base64::encode(base64_credentials);

    let client = Client::builder()
        .user_agent("graphql-rust/0.10.0")
        .default_headers({
            let mut headers = reqwest::header::HeaderMap::new();
            headers.insert("Authorization", format!("Basic {}", encoded_credentials).parse().unwrap());
            headers
        })
        .build()?;

    let res = criipto_signatures_rs::reqwest::post_graphql_blocking::<createSignatureOrder, _>(
        &client,
        "https://signatures-api.criipto.com/v1/graphql",
        op_createSignatureOrder::Variables {
            input: CreateSignatureOrderInput {
                title: Some("My Signature Order".to_string()),
                documents: vec![DocumentInput {
                    pdf: Some(PadesDocumentInput {
                        title: "My PDF Document".to_string(),
                        blob: include_bytes!("../sample.pdf").to_vec(),
                        reference: None,
                        storageMode: DocumentStorageMode::Temporary,
                        displayDocumentID: None,
                        form: None,
                        sealsPageTemplate: None,
                    }),
                    xml: None,
                    removePreviousSignatures: None,
                }],
                ..Default::default()
            },
        },
    );

    println!("Response: {:#?}", res?);
    Ok(())
}
