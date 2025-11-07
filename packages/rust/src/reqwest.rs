//! A concrete client implementation over HTTP with reqwest.

use crate::CriiptoSignaturesClientOpts;
use crate::graphql::{GraphQlQuery, GraphQlResponse};
use reqwest_crate as reqwest;

/// Use the provided reqwest::Client to post a GraphQL request.
#[cfg(any(feature = "reqwest", feature = "reqwest-rustls"))]
pub async fn post_graphql<Q: GraphQlQuery, U: reqwest::IntoUrl>(client: &reqwest::Client, url: U, variables: Q::Variables) -> Result<GraphQlResponse<Q::ResponseBody>, reqwest::Error> {
    let body = Q::build_query(variables);
    let reqwest_response = client.post(url).json(&body).send().await?;

    reqwest_response.json().await
}

/// Use the provided reqwest::Client to post a GraphQL request.
#[cfg(feature = "reqwest-blocking")]
pub fn post_graphql_blocking<Q: GraphQlQuery, U: reqwest::IntoUrl>(client: &reqwest::blocking::Client, url: U, variables: Q::Variables) -> Result<GraphQlResponse<Q::ResponseBody>, reqwest::Error> {
    let body = Q::build_query(variables);
    let reqwest_response = client.post(url).json(&body).send()?;

    reqwest_response.json()
}

#[cfg(any(feature = "reqwest", feature = "reqwest-rustls"))]
pub fn create_reqwest_client(opts: &CriiptoSignaturesClientOpts) -> Result<reqwest::Client, reqwest::Error> {
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
