package eu.idura.signatures

class IduraSignaturesSDK(clientId: String, clientSecret: String) :
    IduraSignaturesOperations by IduraSignaturesClient(clientId, clientSecret) {
    /**
     * Convenience wrapper around [querySignatureOrders] that unwraps the pagination
     * edges and returns only the [QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder]
     * objects, asserting that the viewer is an Application viewer.
     */
    suspend fun listSignatureOrders(
        first: Int,
        status: SignatureOrderStatus? = null,
        after: String? = null,
    ): List<QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder> {
        val viewer = querySignatureOrders(first, status, after)
        check(viewer is QuerySignatureOrders_Viewer_Application) {
            "Expected Application viewer, got ${viewer::class.simpleName}"
        }
        return viewer.signatureOrders.edges.map { it.node }
    }
}
