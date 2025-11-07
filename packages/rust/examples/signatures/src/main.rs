use criipto_signatures_rs::{
    CriiptoSignaturesClientOpts,
    operations::{createSignatureOrder, op_createSignatureOrder},
    reqwest::{create_reqwest_blocking_client, post_graphql_blocking},
    types::{CreateSignatureOrderInput, DocumentInput, DocumentStorageMode, PadesDocumentInput},
};

fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    let client_id = std::env::var("CLIENT_ID")?;
    let client_secret = std::env::var("CLIENT_SECRET")?;

    let client = create_reqwest_blocking_client(&CriiptoSignaturesClientOpts::new(client_id, client_secret))?;

    let res = post_graphql_blocking::<createSignatureOrder, _>(
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
