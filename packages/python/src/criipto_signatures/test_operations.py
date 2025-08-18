import os

from .operations import (
  CriiptoSignaturesSDK,
  CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument,
)
from .models import (
  AddSignatoryInput,
  CancelSignatureOrderInput,
  ChangeSignatureOrderInput,
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  PadesDocumentFormInput,
  DocumentStorageMode,
)

dir_path = os.path.dirname(os.path.realpath(__file__))


def getFileBytes(filename: str) -> bytes:
  with open(dir_path + os.sep + filename, "rb") as sample_file:
    return sample_file.read()


documentFixture = DocumentInput(
  pdf=PadesDocumentInput(
    title="Python sample document",
    blob=getFileBytes("sample.pdf"),
    storageMode=DocumentStorageMode.Temporary,
  )
)


def test_create_signature_order_add_signatory():
  sdk = CriiptoSignaturesSDK(
    os.environ["CRIIPTO_SIGNATURES_CLIENT_ID"],
    os.environ["CRIIPTO_SIGNATURES_CLIENT_SECRET"],
  )

  signatureOrderResponse = sdk.createSignatureOrder(
    CreateSignatureOrderInput(
      title="Python sample signature order",
      expiresInDays=1,
      documents=[documentFixture],
    )
  )

  assert signatureOrderResponse.signatureOrder
  assert signatureOrderResponse.signatureOrder.id

  signatoryResp = sdk.addSignatory(
    AddSignatoryInput(signatureOrderId=signatureOrderResponse.signatureOrder.id)
  )

  assert signatoryResp.signatory
  assert signatoryResp.signatory.href

  sdk.cancelSignatureOrder(
    CancelSignatureOrderInput(signatureOrderId=signatureOrderResponse.signatureOrder.id)
  )


def test_create_signature_order_with_form():
  sdk = CriiptoSignaturesSDK(
    os.environ["CRIIPTO_SIGNATURES_CLIENT_ID"],
    os.environ["CRIIPTO_SIGNATURES_CLIENT_SECRET"],
  )

  signatureOrderResponse = sdk.createSignatureOrder(
    CreateSignatureOrderInput(
      title="Python sample signature order",
      expiresInDays=1,
      documents=[
        DocumentInput(
          pdf=PadesDocumentInput(
            title="Python sample document",
            blob=getFileBytes("sample-form.pdf"),
            storageMode=DocumentStorageMode.Temporary,
            form=PadesDocumentFormInput(enabled=True),
          )
        )
      ],
    )
  )

  document = signatureOrderResponse.signatureOrder.documents[0]
  # TODO: This should use an auto-generated type guard, instead of an instanceof check.
  assert isinstance(
    document,
    CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument,
  )

  assert document.form is not None
  assert document.form.enabled

  sdk.cancelSignatureOrder(
    CancelSignatureOrderInput(signatureOrderId=signatureOrderResponse.signatureOrder.id)
  )


def test_change_max_signatories():
  sdk = CriiptoSignaturesSDK(
    os.environ["CRIIPTO_SIGNATURES_CLIENT_ID"],
    os.environ["CRIIPTO_SIGNATURES_CLIENT_SECRET"],
  )

  signatureOrderResponse = sdk.createSignatureOrder(
    CreateSignatureOrderInput(
      title="Python sample signature order",
      expiresInDays=1,
      maxSignatories=10,
      documents=[documentFixture],
    )
  )

  assert signatureOrderResponse.signatureOrder
  assert signatureOrderResponse.signatureOrder.id

  changedSignatureOrderResponse = sdk.changeSignatureOrder(
    ChangeSignatureOrderInput(
      signatureOrderId=signatureOrderResponse.signatureOrder.id, maxSignatories=20
    )
  )

  assert changedSignatureOrderResponse.signatureOrder
  assert changedSignatureOrderResponse.signatureOrder.maxSignatories == 20

  sdk.cancelSignatureOrder(
    CancelSignatureOrderInput(signatureOrderId=signatureOrderResponse.signatureOrder.id)
  )
