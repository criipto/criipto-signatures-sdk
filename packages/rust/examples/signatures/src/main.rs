use ::reqwest::blocking::Client;
use criipto_signatures_rs::{
    criipto_signatures::{
        operations::{
            createSignatureOrder,
            op_createSignatureOrder::{self, CreateSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider},
            op_querySignatureOrderWithDocuments::{self, SignatureOrder_Document},
            querySignatureOrderWithDocuments,
        },
        types::{CreateSignatureOrderInput, DocumentInput, DocumentStorageMode, PadesDocumentInput, PdfDocument},
    },
    graphql::GraphQLQuery,
};

fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    let CLIENT_ID = std::env::var("CLIENT_ID")?;
    let CLIENT_SECRET = std::env::var("CLIENT_SECRET")?;

    let base64_credentials = format!("{}:{}", CLIENT_ID, CLIENT_SECRET);
    let encoded_credentials = base64::encode(base64_credentials);

    let client = Client::builder()
        .user_agent("graphql-rust/0.10.0")
        .default_headers({
            let mut headers = reqwest::header::HeaderMap::new();
            headers.insert("Authorization", format!("Basic {}", encoded_credentials).parse().unwrap());
            headers
        })
        .build()?;

    let url = "https://signatures-api.criipto.com/v1/graphql";
    // let url = "http://localhost:8081";

    let query = createSignatureOrder::build_query(op_createSignatureOrder::Variables {
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
    });

    let res = client.post(url).json(&query).send()?.error_for_status()?.json::<serde_json::Value>()?;

    println!("Response: {:#?}", &res);

    let res_data = serde_json::from_value::<<createSignatureOrder as GraphQLQuery>::ResponseBody>(res["data"]["createSignatureOrder"].clone())?;

    let x: <querySignatureOrderWithDocuments as GraphQLQuery>::ResponseBody = unsafe { std::mem::transmute(()) };

    let doc = &x.documents[0].as_PdfDocument().unwrap();
    let sig = doc.signatures.as_ref().unwrap()[0].as_JWTSignature().unwrap();

    println!("Parsed response data: {:#?}", &res_data);
    Ok(())
}
