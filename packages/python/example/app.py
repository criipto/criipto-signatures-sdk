import os
from flask import Flask, flash, make_response, redirect, render_template, request

from criipto_signatures import CriiptoSignaturesSDKAsync
from criipto_signatures.models import (
  CreateSignatureOrderInput,
  CloseSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  AddSignatoryInput,
  SignatoryUIInput,
  DocumentStorageMode,
  SignatoryStatus,
  SignatureOrderStatus,
)
from criipto_signatures.operations import (
  QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument,
)

app: Flask = Flask(__name__)
app.config.update(
  TESTING=True, SECRET_KEY="_DO_NOT_HARDCODE_THIS_OR_YOU_WILL_BE_FIRED_"
)


criiptoSdk = CriiptoSignaturesSDKAsync(
  os.getenv("CRIIPTO_SIGNATURES_CLIENT_ID", ""),
  os.getenv("CRIIPTO_SIGNATURES_CLIENT_SECRET", ""),
)


# Renders a file input field, prompting the user to upload a file.
@app.route("/")
def index():
  return render_template("index.html")


# Called when the user submits the index page.
@app.route("/upload", methods=["POST"])
async def uploadFile():
  # Check if the post request has the file part
  if "file" not in request.files:
    flash("No file part")
    return redirect("/")
  file = request.files["file"]

  # If the user does not select a file, the browser submits an
  # empty file without a filename.
  if file.filename == "":
    flash("No file selected")
    return redirect("/")
  if file and file.mimetype == "application/pdf":
    # If we have a file that looks like a PDF, read the binary data. You should not spend too much
    # time validating that what you got is actually a PDF. `createSignatureOrder` will fail if
    # called with something that is not actually a PDF.
    data: bytes = file.read()
    signatureOrder = await criiptoSdk.createSignatureOrder(
      CreateSignatureOrderInput(
        documents=[
          DocumentInput(
            pdf=PadesDocumentInput(
              title="My document",
              blob=data,
              storageMode=DocumentStorageMode.Temporary,
            )
          )
        ]
      )
    )

    # Now that we have a signature order, add someone to sign it.
    signatory = await criiptoSdk.addSignatory(
      AddSignatoryInput(
        signatureOrderId=signatureOrder.id,
        ui=SignatoryUIInput(
          # Return to our application once the signatory completes the process.
          signatoryRedirectUri="http://localhost:5000/callback/" + signatureOrder.id
        ),
      )
    )

    # Render a page with the link to the Criipto hosted signature page.
    return render_template("signature.html", href=signatory.href)
  else:
    flash("Could not process file")
    return redirect("/")


# This route is called when a signatory finishes their signature process, either by completing or
# rejecting the signature request. This is controlled by the `signatoryRedirectUri` option passed to
# `addSignatory`.
@app.route("/callback/<signatureOrderId>")
async def callback(signatureOrderId: str):
  signatureOrderResponse = await criiptoSdk.querySignatureOrder(id=signatureOrderId)

  # Check if there are any signatories still pending (this is most useful if your application uses
  # multiple signatories, but this could also happen if a user (re-)loads your callback endpoint).
  # In real-life applications you would also need to check for the other statuses such as rejected,
  # errored, etc.
  for signatory in signatureOrderResponse.signatories:
    if signatory.status == SignatoryStatus.OPEN:
      return "One or more signatories are still pending"

  # Only try to close the signature order if it's not already closed.
  if signatureOrderResponse.status == SignatureOrderStatus.OPEN:
    # If you do not set `retainDocumentsForDays` here, the documents will be deleted from the
    # Criipto servers as soon as the `closeSignatureOrder` mutation is completed. If you do not wish
    # for Criipto to retain your documents, you should be sure to save them from the response of the
    # `closeSignatureOrder` mutation.
    await criiptoSdk.closeSignatureOrder(
      CloseSignatureOrderInput(
        signatureOrderId=signatureOrderId, retainDocumentsForDays=1
      )
    )

  # Query the signature order, to get the finished documents.
  signatureOrderWithDocuments = await criiptoSdk.querySignatureOrderWithDocuments(
    id=signatureOrderId
  )

  document = signatureOrderWithDocuments.documents[0]
  # TODO: Use a type guard instead
  if (
    isinstance(
      document,
      QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument,
    )
    and document.blob is not None
  ):
    response = make_response(document.blob)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "inline; filename=signed.pdf"
    return response

  flash("Unexpected response")
  return redirect("/")
