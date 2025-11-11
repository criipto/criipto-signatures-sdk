use serde::{Deserialize, Serialize};
use serde_json::Value;
///! GraphQL query and response types and traits.
use std::{collections::HashMap, fmt::Debug};

#[derive(Serialize)]
pub struct QueryBody<T: serde::Serialize> {
    pub query: &'static str,
    pub variables: T,
}

pub trait GraphQlQuery {
    type Variables: serde::Serialize;
    type ResponseBody: for<'de> serde::Deserialize<'de>;

    fn build_query(input: Self::Variables) -> QueryBody<Self::Variables>;
}

impl<T: Debug + serde::Serialize> Debug for QueryBody<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("QueryBody").field("query", &self.query).field("variables", &self.variables).finish()
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Location {
    pub line: i32,
    pub column: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum PathFragment {
    Key(String),
    Index(i32),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GraphQlError {
    pub message: String,
    pub locations: Option<Vec<Location>>,
    pub path: Option<Vec<PathFragment>>,
    pub extensions: Option<HashMap<String, Value>>,
}

#[derive(Deserialize)]
pub struct GraphQlResponse<Data: for<'s> serde::Deserialize<'s>> {
    #[serde(deserialize_with = "deserialize_empty_object")]
    pub data: Option<Data>,
    pub errors: Option<Vec<GraphQlError>>,
    pub extensions: Option<HashMap<String, Value>>,
}

/// This is a helper which deserializes an empty json object as None
/// The criipto signatures API tends to return empty objects instead of null when errors occur
pub fn deserialize_empty_object<'de, D, T>(deserializer: D) -> Result<Option<T>, D::Error>
where
    D: serde::Deserializer<'de>,
    T: serde::Deserialize<'de>,
{
    use serde::Deserialize;

    #[derive(serde_derive::Deserialize)]
    #[serde(untagged, deny_unknown_fields, expecting = "object, empty object or null")]
    enum Helper<T> {
        Data(T),
        Empty {},
        Null,
    }
    match Helper::deserialize(deserializer) {
        Ok(Helper::Data(data)) => Ok(Some(data)),
        Ok(_) => Ok(None),
        Err(e) => Err(e),
    }
}

impl<D: Debug + for<'de> serde::Deserialize<'de>> Debug for GraphQlResponse<D> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("GraphQlResponse").field("data", &self.data).field("errors", &self.errors).field("extensions", &self.extensions).finish()
    }
}

pub trait CriiptoSignaturesClientBlocking {
    type Error;

    /// Post a GraphQL request to the Criipto Signatures API.
    fn post_graphql_blocking<Q: GraphQlQuery>(&self, variables: Q::Variables) -> Result<GraphQlResponse<Q::ResponseBody>, Self::Error>;
}

pub trait CriiptoSignaturesClientAsync {
    type Error;

    /// Post a GraphQL request to the Criipto Signatures API.
    fn post_graphql_async<Q: GraphQlQuery>(&self, variables: Q::Variables) -> impl std::future::Future<Output = Result<GraphQlResponse<Q::ResponseBody>, Self::Error>> + Send;
}
