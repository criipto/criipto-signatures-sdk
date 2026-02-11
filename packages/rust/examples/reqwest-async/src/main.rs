use criipto_signatures_rs::{
    CriiptoSignaturesClientOpts,
    operations::CriiptoSignatureClientMethodsAsync,
    reqwest::create_reqwest_async_client,
    types::{CreateSignatureOrderInput, DocumentInput, DocumentStorageMode, PadesDocumentInput, SignatureOrderStatus},
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    let client_id = std::env::var("CLIENT_ID")?;
    let client_secret = std::env::var("CLIENT_SECRET")?;

    let client = create_reqwest_async_client(&CriiptoSignaturesClientOpts::new(client_id, client_secret))?;

    let order = client
        .createSignatureOrder(CreateSignatureOrderInput {
            title: Some("My Signature Order".to_string()),
            documents: vec![DocumentInput {
                pdf: Some(PadesDocumentInput {
                    title: "My PDF Document".to_string(),
                    blob: include_bytes!("../../../sample.pdf").to_vec(),
                    reference: None,
                    storageMode: DocumentStorageMode::Temporary,
                    displayDocumentID: None,
                    form: None,
                    sealsPageTemplate: None,
                    removeBookmarks: None,
                }),
                xml: None,
                removePreviousSignatures: None,
                keepPreviousSignatures: None,
            }],
            ..Default::default()
        })
        .await?;

    println!("Response: {:#?}", order);

    let orders = client.querySignatureOrders(Some(SignatureOrderStatus::OPEN), 0, None).await?;

    println!("Orders: {:#?}", orders);

    Ok(())
}
