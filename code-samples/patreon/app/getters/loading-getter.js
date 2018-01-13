import access from 'safe-access'


export default (actionTypeArr, getModelId) => {
    actionTypeArr = Array.isArray(actionTypeArr) ?
        actionTypeArr :
        [actionTypeArr]

    return (state, ownProps) => (
        !!actionTypeArr.find((actionType) => (
            getModelId ?
                access(state, `requests.${actionType}.${getModelId(state, ownProps)}.pending`) :
                access(state, `requests.${actionType}.pending`)
        ))
    )
}



// WEBPACK FOOTER //
// ./app/getters/loading-getter.js