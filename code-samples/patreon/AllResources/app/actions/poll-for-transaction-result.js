import { actions as nionActions, selectData } from 'nion'
import { buildUrl } from 'utilities/json-api'

const txnResponseShape = {
    include: [],
    fields: {
        txn: ['created_at', 'succeeded_at', 'failed_at'],
    },
}

const pollForTransactionResult = (dataKey, txnID) => (dispatch, getState) => {
    const _pollForTransactionResult = (resolve, reject) => {
        dispatch(
            nionActions.get(dataKey, {
                endpoint: buildUrl(`transactions/${txnID}`, txnResponseShape),
            }),
        )
            .then(response => {
                // choose to pull from nion rather than relying on response shape,
                // in case we munge shape or change how we munge shape
                const txn = selectData(dataKey)(getState())
                if (Boolean(txn.succeededAt)) {
                    resolve()
                } else if (Boolean(txn.failedAt)) {
                    reject()
                } else {
                    setTimeout(() => {
                        _pollForTransactionResult(resolve, reject)
                    }, 3000)
                }
            })
            .catch(err => reject(err))
    }

    return new Promise((resolve, reject) => {
        _pollForTransactionResult(resolve, reject)
    })
}

export default pollForTransactionResult



// WEBPACK FOOTER //
// ./app/actions/poll-for-transaction-result.js