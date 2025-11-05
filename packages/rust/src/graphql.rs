use std::fmt::Debug;

use serde::Serialize;

#[derive(serde_derive::Serialize)]
pub struct QueryBody<T: Serialize> {
    pub query: &'static str,
    pub variables: T,
}

pub trait GraphQLQuery {
    type Variables: Serialize;
    type ResponseBody;

    fn build_query(input: Self::Variables) -> QueryBody<Self::Variables>;
}

impl<T: Debug + Serialize> Debug for QueryBody<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("QueryBody").field("query", &self.query).field("variables", &self.variables).finish()
    }
}
