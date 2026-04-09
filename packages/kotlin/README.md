# signatures

A Kotlin SDK for Idura Signatures.

Sign PAdES-LTA documents using MitID, BankID or any other eID supported by Idura.

[Examples](https://docs.criipto.com/signatures/graphql/examples/)

## Getting started

### Requirements

This library requires Java 11 or later and targets the JVM.

### Installation

Add the following to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("eu.idura:signatures:1.0.0")
}
```

Or with Maven (`pom.xml`):

```xml
<dependency>
    <groupId>eu.idura</groupId>
    <artifactId>signatures</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Configure the SDK

```kotlin
import eu.idura.signatures.IduraSignaturesSDK

val client = IduraSignaturesSDK(
    clientId = "{YOUR_CRIIPTO_CLIENT_ID}",
    clientSecret = "{YOUR_CRIIPTO_CLIENT_SECRET}",
)
```

All methods are `suspend` functions and must be called from a coroutine scope.

## Basic example

```kotlin
import eu.idura.signatures.*
import kotlinx.coroutines.runBlocking

val client = IduraSignaturesSDK(
    clientId = "{YOUR_CRIIPTO_CLIENT_ID}",
    clientSecret = "{YOUR_CRIIPTO_CLIENT_SECRET}",
)

runBlocking {
    // Create signature order
    val signatureOrder = client.createSignatureOrder(
        CreateSignatureOrderInput(
            title = "My signature order",
            documents = listOf(
                DocumentInput(
                    pdf = PadesDocumentInput(
                        title = "My document",
                        blob = pdf, // ByteArray
                        storageMode = DocumentStorageMode.Temporary,
                    )
                )
            ),
        )
    )

    // Add signatory to signature order
    val signatory = client.addSignatory(
        AddSignatoryInput(signatureOrderId = signatureOrder.id)
    )
    println(signatory.href)

    // ... Wait for the signatory to sign

    // Close the order
    client.closeSignatureOrder(
        CloseSignatureOrderInput(
            signatureOrderId = signatureOrder.id,
            retainDocumentsForDays = 1,
        )
    )
}
```

## Querying signature orders

`listSignatureOrders` unwraps the pagination edges and returns a flat list of signature orders:

```kotlin
val orders = client.listSignatureOrders(first = 100, status = SignatureOrderStatus.Open)
orders.forEach { println(it.title) }
```

The underlying `querySignatureOrders` method is also available if you need access to the raw pagination structure.

## Example applications

- [`example-kotlin/`](./example-kotlin) — Ktor web app (Kotlin coroutines)
- [`example-java/`](./example-java) — Javalin web app (Java + `CompletableFuture`)

Both apps let you upload a PDF, sign it via Idura, and download the signed document.

To run either example, copy `.env.example` to `.env`, fill in your credentials, then:

```bash
# Kotlin
cd example-kotlin
CRIIPTO_SIGNATURES_CLIENT_ID=... CRIIPTO_SIGNATURES_CLIENT_SECRET=... ./gradlew run

# Java
cd example-java
CRIIPTO_SIGNATURES_CLIENT_ID=... CRIIPTO_SIGNATURES_CLIENT_SECRET=... ./gradlew run
```

Open http://localhost:8080 in a browser.

## Usage from Java

Kotlin `suspend` functions are not directly usable from Java. Use `IduraSignaturesSDKJava` instead, which exposes every operation as a `CompletableFuture` and implements `AutoCloseable`:

```java
import eu.idura.signatures.*;
import java.util.List;

try (var client = new IduraSignaturesSDKJava(
        "{YOUR_CRIIPTO_CLIENT_ID}",
        "{YOUR_CRIIPTO_CLIENT_SECRET}")) {

    // Create signature order
    var signatureOrder = client.createSignatureOrder(
        new CreateSignatureOrderInputBuilder(
            List.of(new DocumentInputBuilder()
                .pdf(new PadesDocumentInputBuilder(pdf, DocumentStorageMode.Temporary, "My document")
                    .build())
                .build())
        )
        .title("My signature order")
        .expiresInDays(1)
        .build()
    ).get();

    // Add signatory
    var signatory = client.addSignatory(
        new AddSignatoryInputBuilder(signatureOrder.getId()).build()
    ).get();

    System.out.println(signatory.getHref());

    // List open signature orders (overloads available for optional args)
    var orders = client.listSignatureOrders(100, SignatureOrderStatus.Open).get();
}
```

Each input type has a corresponding `*Builder` class. Required fields are constructor parameters; optional fields are fluent setters.
