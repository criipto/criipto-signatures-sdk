# Criipto signatures example

A sample web application, showcasing the Criipto signatures SDK.

## Running

Install the [uv package manager](https://docs.astral.sh/uv/getting-started/installation/).

Install dependencies:

```bash
uv sync --dev
```

Go to the [Criipto
dashboard](https://dashboard.criipto.com/tenant/ffed5090d8b1419b9c7b93ffe4468dbf/applications), and
create a new Signatures application, if you haven't done so already.

Run `cp .env.example .env` and update the values of `CRIIPTO_SIGNATURES_CLIENT_ID` and `CRIIPTO_SIGNATURES_CLIENT_SECRET`.

Start the web server:

```
uv run --env-file .env flask run
```

Navigate to http://localhost:5000, and upload a PDF file to start the signature process. After
uploading a file, you will be presented with a link to Criipto Signatures, where you can sign the
PDF, using the e-ID providers you registered in your application.

After completing the signature process, you will be redirected to the signed PDF.
