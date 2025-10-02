from typing import Optional
from criipto_signatures.models import (
  IntScalarInput,
  SignatureOrderStatus,
  StringScalarInput,
)
from .operations import (
  CriiptoSignaturesSDK as CriiptoSignaturesSDKInternal,
  QuerySignatureOrders_Viewer_Application,
  QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder,
)


class CriiptoSignaturesSDK(CriiptoSignaturesSDKInternal):
  async def querySignatureOrders(
    self,
    first: IntScalarInput,
    status: Optional[SignatureOrderStatus] = None,
    after: Optional[StringScalarInput] = None,
  ) -> list[
    QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder
  ]:
    result = await super().querySignatureOrders(first, status, after)
    assert isinstance(result, QuerySignatureOrders_Viewer_Application)
    return list(map(lambda edge: edge.node, result.signatureOrders.edges))
