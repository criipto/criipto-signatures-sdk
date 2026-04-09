package eu.idura.signatures

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.future.future
import java.util.concurrent.CompletableFuture

/**
 * Java-friendly wrapper around [IduraSignaturesSDK] that exposes each operation as a
 * [CompletableFuture] instead of a Kotlin suspend function.
 *
 * Call [close] when the client is no longer needed to release background threads.
 */
class IduraSignaturesSDKJava(clientId: String, clientSecret: String) : AutoCloseable {
    private val sdk = IduraSignaturesSDK(clientId, clientSecret)
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    fun createSignatureOrder(
        input: CreateSignatureOrderInput,
    ): CompletableFuture<CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder> = scope.future { sdk.createSignatureOrder(input) }

    fun cleanupSignatureOrder(
        input: CleanupSignatureOrderInput,
    ): CompletableFuture<CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder> =
        scope.future { sdk.cleanupSignatureOrder(input) }

    fun addSignatory(input: AddSignatoryInput): CompletableFuture<AddSignatory_AddSignatoryOutput_Signatory> =
        scope.future { sdk.addSignatory(input) }

    fun addSignatories(input: AddSignatoriesInput): CompletableFuture<List<AddSignatories_AddSignatoriesOutput_Signatory>> =
        scope.future { sdk.addSignatories(input) }

    fun changeSignatory(input: ChangeSignatoryInput): CompletableFuture<ChangeSignatory_ChangeSignatoryOutput_Signatory> =
        scope.future { sdk.changeSignatory(input) }

    fun closeSignatureOrder(
        input: CloseSignatureOrderInput,
    ): CompletableFuture<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder> = scope.future { sdk.closeSignatureOrder(input) }

    fun cancelSignatureOrder(
        input: CancelSignatureOrderInput,
    ): CompletableFuture<CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder> = scope.future { sdk.cancelSignatureOrder(input) }

    fun signActingAs(input: SignActingAsInput): CompletableFuture<SignActingAs_SignActingAsOutput_Signatory> =
        scope.future { sdk.signActingAs(input) }

    fun validateDocument(input: ValidateDocumentInput): CompletableFuture<ValidateDocument_ValidateDocumentOutput> =
        scope.future { sdk.validateDocument(input) }

    fun extendSignatureOrder(
        input: ExtendSignatureOrderInput,
    ): CompletableFuture<ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder> = scope.future { sdk.extendSignatureOrder(input) }

    fun deleteSignatory(input: DeleteSignatoryInput): CompletableFuture<DeleteSignatory_DeleteSignatoryOutput_SignatureOrder> =
        scope.future { sdk.deleteSignatory(input) }

    fun createBatchSignatory(
        input: CreateBatchSignatoryInput,
    ): CompletableFuture<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory> = scope.future { sdk.createBatchSignatory(input) }

    fun changeSignatureOrder(
        input: ChangeSignatureOrderInput,
    ): CompletableFuture<ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder> = scope.future { sdk.changeSignatureOrder(input) }

    fun querySignatureOrder(id: String): CompletableFuture<QuerySignatureOrder_SignatureOrder> =
        scope.future { sdk.querySignatureOrder(id) }

    fun querySignatureOrderWithDocuments(id: String): CompletableFuture<QuerySignatureOrderWithDocuments_SignatureOrder> =
        scope.future { sdk.querySignatureOrderWithDocuments(id) }

    fun querySignatory(id: String): CompletableFuture<QuerySignatory_Signatory> = scope.future { sdk.querySignatory(id) }

    @JvmOverloads
    fun querySignatureOrders(
        first: Int,
        status: SignatureOrderStatus? = null,
        after: String? = null,
    ): CompletableFuture<QuerySignatureOrders_Viewer> = scope.future { sdk.querySignatureOrders(first, status, after) }

    @JvmOverloads
    fun listSignatureOrders(
        first: Int,
        status: SignatureOrderStatus? = null,
        after: String? = null,
    ): CompletableFuture<List<QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder>> =
        scope.future { sdk.listSignatureOrders(first, status, after) }

    fun queryBatchSignatory(id: String): CompletableFuture<QueryBatchSignatory_BatchSignatory> =
        scope.future { sdk.queryBatchSignatory(id) }

    override fun close() {
        scope.cancel()
    }
}
