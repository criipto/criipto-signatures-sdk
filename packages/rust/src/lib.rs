//! Criipto Signatures SDK for Rust
//!
//! This library provides types and functions to interact with the Criipto Signatures GraphQL API.
//! It includes generated GraphQL operations, types, and utilities for making requests.
//! The generated structure is very similar to the `graphql-client` crate.
//!
//! ## Example
//!
//! ```no_run
//! # use reqwest_crate as reqwest;
//!
//! use reqwest::{blocking::Client, header::HeaderMap};
//! use criipto_signatures_rs::{reqwest::post_graphql_blocking, graphql::GraphQlQuery, types::{PadesDocumentInput, DocumentInput, DocumentStorageMode, CreateSignatureOrderInput}, operations::{op_createSignatureOrder, createSignatureOrder}};
//!
//! fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let base64_credentials = base64::encode(format!("{}:{}", "CLIENT_ID", "CLIENT_SECRET"));
//!     let client = Client::builder()
//!         .default_headers({
//!             let mut headers = reqwest::header::HeaderMap::new();
//!             headers.insert("Authorization", format!("Basic {}", base64_credentials).parse().unwrap());
//!             headers
//!         })
//!         .build()?;
//!
//!     let response = post_graphql_blocking::<createSignatureOrder, _>(&client, "https://signatures-api.criipto.com/v1/graphql", op_createSignatureOrder::Variables {
//!         input: CreateSignatureOrderInput {
//!             title: Some("My Signature Order".to_string()),
//!             documents: vec![DocumentInput {
//!                 pdf: Some(PadesDocumentInput {
//!                     title: "My PDF Document".to_string(),
//!                     blob: include_bytes!("../sample.pdf").to_vec(),
//!                     reference: None,
//!                     storageMode: DocumentStorageMode::Temporary,
//!                     displayDocumentID: None,
//!                     form: None,
//!                     sealsPageTemplate: None,
//!                 }),
//!                 ..Default::default()
//!             }],
//!             ..Default::default()
//!         },
//!     })?;
//!
//!    println!("Response: {:#?}", response);
//!    Ok(())
//! }
//! ```
//!
//! ## Usage without `reqwest`
//!
//! If you prefer to use a different HTTP client, you can disable the `reqwest` feature
//! and implement your own request logic using the types and operations provided by this crate.
//!
//! You can construct a query using [GraphQlQuery::build_query](crate::graphql::GraphQlQuery::build_query) and use the types in [crate::graphql] to handle
//! the request and response serialization/deserialization.
//!
//! ## Helpers
//!
//! ### Union Type Conversion
//!
//! For GraphQL union types, the code generator implements methods for converting from the generic union type to specific variants,
//! since matching on the generated enums means naming potentially long type names.
//!
//! ```no_run
//! use criipto_signatures_rs::operations::op_querySignatureOrderWithDocuments;
//!
//! fn example(sig: op_querySignatureOrderWithDocuments::SignatureOrder) -> anyhow::Result<String> {
//!     let doc = sig.documents.first().ok_or_else(|| anyhow::anyhow!("No documents found"))?;
//!     let doc = doc.as_PdfDocument().ok_or_else(|| anyhow::anyhow!("Not a PDF document"))?;
//!     let signatures = doc.signatures.as_ref().ok_or_else(|| anyhow::anyhow!("Document is unsigned"))?;
//!     let signature = signatures.first().clone().ok_or_else(|| anyhow::anyhow!("No signatures found"))?;
//!     let jwt_signature = signature.as_JWTSignature().ok_or_else(|| anyhow::anyhow!("Not a JWT signature"))?;
//!
//!     Ok(jwt_signature.jwt.clone())
//! }
//! ```

#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

mod generated;
pub mod graphql;
pub mod scalars;

#[cfg(any(feature = "reqwest",))]
pub mod reqwest;

pub mod operations {
    pub use crate::generated::api::*;
}

pub mod types {
    pub use crate::generated::types::*;
}
