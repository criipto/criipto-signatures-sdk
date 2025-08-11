from .models import (
  CreateSignatureOrderOutput,
  CreateSignatureOrderInput,
  CleanupSignatureOrderOutput,
  CleanupSignatureOrderInput,
  AddSignatoryOutput,
  AddSignatoryInput,
  AddSignatoriesOutput,
  AddSignatoriesInput,
  ChangeSignatoryOutput,
  ChangeSignatoryInput,
  CloseSignatureOrderOutput,
  CloseSignatureOrderInput,
  CancelSignatureOrderOutput,
  CancelSignatureOrderInput,
  SignActingAsOutput,
  SignActingAsInput,
  ValidateDocumentOutput,
  ValidateDocumentInput,
  ExtendSignatureOrderOutput,
  ExtendSignatureOrderInput,
  DeleteSignatoryOutput,
  DeleteSignatoryInput,
  CreateBatchSignatoryOutput,
  CreateBatchSignatoryInput,
  ChangeSignatureOrderOutput,
  ChangeSignatureOrderInput,
  SignatureOrder,
  IDScalar,
  Signatory,
  Viewer,
  SignatureOrderStatus,
  IntScalar,
  StringScalar,
  BatchSignatory,
)
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport, BasicAuth

BasicDocumentFragment = """fragment BasicDocument on Document {
  __typename
  id
  title
  reference
  ... on PdfDocument {
    form {
      enabled
    }
  }
}"""
SignedDocumentFragment = """fragment SignedDocument on Document {
  id
  title
  blob
  signatures {
    __typename
    signatory {
      id
    }
    ... on JWTSignature {
      jwt
      jwks
      claims {
        name
        value
      }
    }
    ... on DrawableSignature {
      name
      image
    }
  }
}"""
BasicSignatoryFragment = """fragment BasicSignatory on Signatory {
  id
  status
  statusReason
  href
  downloadHref
  reference
  role
  signatureOrder {
    id
    status
    closedAt
    expiresAt
  }
  evidenceProviders {
    __typename
    id
  }
  documents {
    edges {
      status
      node {
        __typename
        id
      }
    }
  }
}"""
BasicSignatureOrderFragment = """fragment BasicSignatureOrder on SignatureOrder {
  id
  status
  title
  closedAt
  expiresAt
  maxSignatories
  signatories {
    ...BasicSignatory
  }
  evidenceProviders {
    __typename
    id
  }
}"""
BasicBatchSignatoryFragment = """fragment BasicBatchSignatory on BatchSignatory {
  id
  token
  href
}"""
createSignatureOrderDocument = f"""mutation createSignatureOrder($input: CreateSignatureOrderInput!) {{
  createSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""
cleanupSignatureOrderDocument = f"""mutation cleanupSignatureOrder($input: CleanupSignatureOrderInput!) {{
  cleanupSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""
addSignatoryDocument = f"""mutation addSignatory($input: AddSignatoryInput!) {{
  addSignatory(input: $input) {{
    signatory {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""
addSignatoriesDocument = f"""mutation addSignatories($input: AddSignatoriesInput!) {{
  addSignatories(input: $input) {{
    signatories {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""
changeSignatoryDocument = f"""mutation changeSignatory($input: ChangeSignatoryInput!) {{
  changeSignatory(input: $input) {{
    signatory {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""
closeSignatureOrderDocument = f"""mutation closeSignatureOrder($input: CloseSignatureOrderInput!) {{
  closeSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
        ...SignedDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}
{SignedDocumentFragment}"""
cancelSignatureOrderDocument = f"""mutation cancelSignatureOrder($input: CancelSignatureOrderInput!) {{
  cancelSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""
signActingAsDocument = f"""mutation signActingAs($input: SignActingAsInput!) {{
  signActingAs(input: $input) {{
    signatory {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""
validateDocumentDocument = """mutation validateDocument($input: ValidateDocumentInput!) {
  validateDocument(input: $input) {
    valid
    errors
    fixable
  }
}"""
extendSignatureOrderDocument = f"""mutation extendSignatureOrder($input: ExtendSignatureOrderInput!) {{
  extendSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""
deleteSignatoryDocument = f"""mutation deleteSignatory($input: DeleteSignatoryInput!) {{
  deleteSignatory(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""
createBatchSignatoryDocument = f"""mutation createBatchSignatory($input: CreateBatchSignatoryInput!) {{
  createBatchSignatory(input: $input) {{
    batchSignatory {{
      ...BasicBatchSignatory
      items {{
        signatureOrder {{
          ...BasicSignatureOrder
        }}
        signatory {{
          ...BasicSignatory
        }}
      }}
    }}
  }}
}}
{BasicBatchSignatoryFragment}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""
changeSignatureOrderDocument = f"""mutation changeSignatureOrder($input: ChangeSignatureOrderInput!) {{
  changeSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""
querySignatureOrderDocument = f"""query signatureOrder($id: ID!) {{
  signatureOrder(id: $id) {{
    ...BasicSignatureOrder
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""
querySignatureOrderWithDocumentsDocument = f"""query signatureOrderWithDocuments($id: ID!) {{
  signatureOrder(id: $id) {{
    ...BasicSignatureOrder
    documents {{
      ...BasicDocument
      ...SignedDocument
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}
{SignedDocumentFragment}"""
querySignatoryDocument = f"""query signatory($id: ID!) {{
  signatory(id: $id) {{
    signatureOrder {{
      ...BasicSignatureOrder
    }}
    ...BasicSignatory
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""
querySignatureOrdersDocument = f"""query signatureOrders($status: SignatureOrderStatus, $first: Int!, $after: String) {{
  viewer {{
    __typename
    ... on Application {{
      signatureOrders(status: $status, first: $first, after: $after) {{
        edges {{
          node {{
            ...BasicSignatureOrder
          }}
        }}
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""
queryBatchSignatoryDocument = f"""query batchSignatory($id: ID!) {{
  batchSignatory(id: $id) {{
    ...BasicBatchSignatory
    items {{
      signatureOrder {{
        ...BasicSignatureOrder
      }}
      signatory {{
        ...BasicSignatory
      }}
    }}
  }}
}}
{BasicBatchSignatoryFragment}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""


class CriiptoSignaturesSDK:
  def __init__(self, clientId: str, clientSecret: str):
    auth = BasicAuth(clientId, clientSecret)
    transport = AIOHTTPTransport(
      url=" https://signatures-api.criipto.com/v1/graphql", auth=auth
    )
    self.client = Client(transport=transport, fetch_schema_from_transport=False)

  def createSignatureOrder(
    self, input: CreateSignatureOrderInput
  ) -> CreateSignatureOrderOutput:
    query = gql(createSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CreateSignatureOrderOutput.model_validate(
      result.get("createSignatureOrder")
    )
    return parsed

  def cleanupSignatureOrder(
    self, input: CleanupSignatureOrderInput
  ) -> CleanupSignatureOrderOutput:
    query = gql(cleanupSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CleanupSignatureOrderOutput.model_validate(
      result.get("cleanupSignatureOrder")
    )
    return parsed

  def addSignatory(self, input: AddSignatoryInput) -> AddSignatoryOutput:
    query = gql(addSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = AddSignatoryOutput.model_validate(result.get("addSignatory"))
    return parsed

  def addSignatories(self, input: AddSignatoriesInput) -> AddSignatoriesOutput:
    query = gql(addSignatoriesDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = AddSignatoriesOutput.model_validate(result.get("addSignatories"))
    return parsed

  def changeSignatory(self, input: ChangeSignatoryInput) -> ChangeSignatoryOutput:
    query = gql(changeSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ChangeSignatoryOutput.model_validate(result.get("changeSignatory"))
    return parsed

  def closeSignatureOrder(
    self, input: CloseSignatureOrderInput
  ) -> CloseSignatureOrderOutput:
    query = gql(closeSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CloseSignatureOrderOutput.model_validate(result.get("closeSignatureOrder"))
    return parsed

  def cancelSignatureOrder(
    self, input: CancelSignatureOrderInput
  ) -> CancelSignatureOrderOutput:
    query = gql(cancelSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CancelSignatureOrderOutput.model_validate(
      result.get("cancelSignatureOrder")
    )
    return parsed

  def signActingAs(self, input: SignActingAsInput) -> SignActingAsOutput:
    query = gql(signActingAsDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = SignActingAsOutput.model_validate(result.get("signActingAs"))
    return parsed

  def validateDocument(self, input: ValidateDocumentInput) -> ValidateDocumentOutput:
    query = gql(validateDocumentDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ValidateDocumentOutput.model_validate(result.get("validateDocument"))
    return parsed

  def extendSignatureOrder(
    self, input: ExtendSignatureOrderInput
  ) -> ExtendSignatureOrderOutput:
    query = gql(extendSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ExtendSignatureOrderOutput.model_validate(
      result.get("extendSignatureOrder")
    )
    return parsed

  def deleteSignatory(self, input: DeleteSignatoryInput) -> DeleteSignatoryOutput:
    query = gql(deleteSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = DeleteSignatoryOutput.model_validate(result.get("deleteSignatory"))
    return parsed

  def createBatchSignatory(
    self, input: CreateBatchSignatoryInput
  ) -> CreateBatchSignatoryOutput:
    query = gql(createBatchSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CreateBatchSignatoryOutput.model_validate(
      result.get("createBatchSignatory")
    )
    return parsed

  def changeSignatureOrder(
    self, input: ChangeSignatureOrderInput
  ) -> ChangeSignatureOrderOutput:
    query = gql(changeSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ChangeSignatureOrderOutput.model_validate(
      result.get("changeSignatureOrder")
    )
    return parsed

  def querySignatureOrder(self, id: IDScalar) -> SignatureOrder:
    query = gql(querySignatureOrderDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = SignatureOrder.model_validate(result.get("signatureOrder"))
    return parsed

  def querySignatureOrderWithDocuments(self, id: IDScalar) -> SignatureOrder:
    query = gql(querySignatureOrderWithDocumentsDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = SignatureOrder.model_validate(result.get("signatureOrder"))
    return parsed

  def querySignatory(self, id: IDScalar) -> Signatory:
    query = gql(querySignatoryDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = Signatory.model_validate(result.get("signatory"))
    return parsed

  def querySignatureOrders(
    self, status: SignatureOrderStatus, first: IntScalar, after: StringScalar
  ) -> Viewer:
    query = gql(querySignatureOrdersDocument)
    variables = {"status": status, "first": first, "after": after}
    result = self.client.execute(query, variable_values=variables)
    parsed = Viewer.model_validate(result.get("viewer"))
    return parsed

  def queryBatchSignatory(self, id: IDScalar) -> BatchSignatory:
    query = gql(queryBatchSignatoryDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = BatchSignatory.model_validate(result.get("batchSignatory"))
    return parsed
