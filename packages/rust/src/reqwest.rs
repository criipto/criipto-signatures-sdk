//! A concrete client implementation over HTTP with reqwest.

use crate::CriiptoSignaturesClientOpts;
use crate::graphql::{CriiptoSignaturesClientAsync, CriiptoSignaturesClientBlocking, GraphQlQuery, GraphQlResponse};
use reqwest_crate as reqwest;

/// A reqwest-backed Criipto Signatures client that carries the GraphQL endpoint to call.
#[cfg(any(feature = "reqwest", feature = "reqwest-rustls"))]
#[derive(Clone)]
pub struct CriiptoSignaturesReqwestClient {
    pub client: reqwest::Client,
    pub endpoint: String,
}

/// A reqwest-blocking-backed Criipto Signatures client that carries the GraphQL endpoint to call.
#[cfg(feature = "reqwest-blocking")]
#[derive(Clone)]
pub struct CriiptoSignaturesReqwestBlockingClient {
    pub client: reqwest::blocking::Client,
    pub endpoint: String,
}

#[cfg(any(feature = "reqwest", feature = "reqwest-rustls"))]
pub fn create_reqwest_async_client(opts: &CriiptoSignaturesClientOpts) -> Result<CriiptoSignaturesReqwestClient, reqwest::Error> {
    let client = reqwest::Client::builder()
        .default_headers({
            let mut headers = reqwest::header::HeaderMap::new();
            headers.insert("Authorization", opts.authorization_header().parse().unwrap());
            headers
        })
        .build()?;

    Ok(CriiptoSignaturesReqwestClient {
        client,
        endpoint: opts.endpoint().to_string(),
    })
}

#[cfg(feature = "reqwest-blocking")]
pub fn create_reqwest_blocking_client(opts: &CriiptoSignaturesClientOpts) -> Result<CriiptoSignaturesReqwestBlockingClient, reqwest::Error> {
    let client = reqwest::blocking::Client::builder()
        .default_headers({
            let mut headers = reqwest::header::HeaderMap::new();
            headers.insert("Authorization", opts.authorization_header().parse().unwrap());
            headers
        })
        .build()?;

    Ok(CriiptoSignaturesReqwestBlockingClient {
        client,
        endpoint: opts.endpoint().to_string(),
    })
}

#[cfg(any(feature = "reqwest", feature = "reqwest-rustls"))]
impl CriiptoSignaturesClientAsync for CriiptoSignaturesReqwestClient {
    type Error = reqwest::Error;

    fn post_graphql_async<Q: GraphQlQuery>(&self, variables: Q::Variables) -> impl std::future::Future<Output = Result<GraphQlResponse<Q::ResponseBody>, Self::Error>> + Send {
        let body = Q::build_query(variables);
        let reqwest_response = self.client.post(&self.endpoint).json(&body).send();

        async move {
            let reqwest_response = reqwest_response.await?;
            reqwest_response.json().await
        }
    }
}

#[cfg(feature = "reqwest-blocking")]
impl CriiptoSignaturesClientBlocking for CriiptoSignaturesReqwestBlockingClient {
    type Error = reqwest::Error;

    fn post_graphql_blocking<Q: GraphQlQuery>(&self, variables: Q::Variables) -> Result<GraphQlResponse<Q::ResponseBody>, Self::Error> {
        let body = Q::build_query(variables);
        let reqwest_response = self.client.post(&self.endpoint).json(&body).send()?;

        reqwest_response.json()
    }
}
