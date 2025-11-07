//! A concrete client implementation over HTTP with reqwest.

use crate::CriiptoSignaturesClientOpts;
use crate::graphql::{CriiptoSignaturesClientAsync, CriiptoSignaturesClientBlocking, GraphQlQuery, GraphQlResponse};
use reqwest_crate as reqwest;

#[cfg(any(feature = "reqwest", feature = "reqwest-rustls"))]
pub fn create_reqwest_async_client(opts: &CriiptoSignaturesClientOpts) -> Result<reqwest::Client, reqwest::Error> {
    let client = reqwest::Client::builder()
        .default_headers({
            let mut headers = reqwest::header::HeaderMap::new();
            headers.insert("Authorization", opts.authorization_header().parse().unwrap());
            headers
        })
        .build()?;

    Ok(client)
}

#[cfg(feature = "reqwest-blocking")]
pub fn create_reqwest_blocking_client(opts: &CriiptoSignaturesClientOpts) -> Result<reqwest::blocking::Client, reqwest::Error> {
    let client = reqwest::blocking::Client::builder()
        .default_headers({
            let mut headers = reqwest::header::HeaderMap::new();
            headers.insert("Authorization", opts.authorization_header().parse().unwrap());
            headers
        })
        .build()?;

    Ok(client)
}

#[cfg(any(feature = "reqwest", feature = "reqwest-rustls"))]
impl CriiptoSignaturesClientAsync for reqwest::Client {
    type Error = reqwest::Error;

    fn post_graphql_async<Q: GraphQlQuery>(&self, variables: Q::Variables) -> impl std::future::Future<Output = Result<GraphQlResponse<Q::ResponseBody>, Self::Error>> + Send {
        let body = Q::build_query(variables);
        let reqwest_response = self.post("https://signatures-api.criipto.com/v1/graphql").json(&body).send();

        async move {
            let reqwest_response = reqwest_response.await?;
            reqwest_response.json().await
        }
    }
}

#[cfg(feature = "reqwest-blocking")]
impl CriiptoSignaturesClientBlocking for reqwest::blocking::Client {
    type Error = reqwest::Error;

    fn post_graphql_blocking<Q: GraphQlQuery>(&self, variables: Q::Variables) -> Result<GraphQlResponse<Q::ResponseBody>, Self::Error> {
        let body = Q::build_query(variables);
        let reqwest_response = self.post("https://signatures-api.criipto.com/v1/graphql").json(&body).send()?;

        reqwest_response.json()
    }
}
