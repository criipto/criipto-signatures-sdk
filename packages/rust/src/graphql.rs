///! GraphQL query and response types and traits.
use std::{collections::HashMap, fmt::Debug};

use serde_derive::{Deserialize, Serialize};
use serde_json::Value;

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

#[derive(Serialize, Deserialize)]
pub struct GraphQlResponse<Data> {
    pub data: Option<Data>,
    pub errors: Option<Vec<GraphQlError>>,
    pub extensions: Option<HashMap<String, Value>>,
}

impl<D: Debug> Debug for GraphQlResponse<D> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("GraphQlResponse").field("data", &self.data).field("errors", &self.errors).field("extensions", &self.extensions).finish()
    }
}
