import os
import base64

from .operations import CriiptoSignaturesSDK
from .models import (
  AddSignatoryInput,
  CancelSignatureOrderInput,
  ChangeSignatureOrderInput,
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
)

dir_path = os.path.dirname(os.path.realpath(__file__))
with open(dir_path + "/sample.pdf", "rb") as sample_file:
  contents = sample_file.read()
  base64_encoded_data = base64.b64encode(contents)
  sample_file_content = base64_encoded_data.decode("utf-8")

documentFixture = DocumentInput(
  pdf=PadesDocumentInput(
    title="Python sample document",
    blob=sample_file_content,
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
