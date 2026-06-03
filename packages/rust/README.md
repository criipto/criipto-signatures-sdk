# criipto-signatures-rs

A Rust SDK for Criipto Signatures.

Sign PAdeS-LTA documents using MitID, BankID or any other eID supported by Criipto.

[Examples](https://docs.criipto.com/signatures/graphql/examples/)

## Getting started

### Installation

```toml
[dependencies]
criipto-signatures-rs = "0.1"
```

### Configure the SDK

```rust
use criipto_signatures_rs::{
    CriiptoSignaturesClientOpts,
    reqwest::create_reqwest_blocking_client,
};

let opts = CriiptoSignaturesClientOpts::new(
    "{YOUR_CRIIPTO_CLIENT_ID}".to_string(),
    "{YOUR_CRIIPTO_CLIENT_SECRET}".to_string(),
);
let client = create_reqwest_blocking_client(&opts)?;
```

### Overriding the GraphQL endpoint

By default the SDK targets `https://signatures.idura.app`. Override the endpoint with `with_endpoint`:

```rust
use criipto_signatures_rs::{
    CriiptoSignaturesClientOpts,
    reqwest::create_reqwest_blocking_client,
};

let opts = CriiptoSignaturesClientOpts::new(
    "{YOUR_CRIIPTO_CLIENT_ID}".to_string(),
    "{YOUR_CRIIPTO_CLIENT_SECRET}".to_string(),
)
.with_endpoint("https://signatures.idura.app/v1/graphql");

let client = create_reqwest_blocking_client(&opts)?;
```

The same `with_endpoint` works for the async factory `create_reqwest_async_client`.

For more usage examples (including the async client and using the SDK without `reqwest`), see the crate-level documentation.
