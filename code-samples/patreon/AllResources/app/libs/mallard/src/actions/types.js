const namespacePrefix = 'mallard'
export const namespace = actionType => `${namespacePrefix}/${actionType}`
export const denamespace = namespacedActionType =>
    namespacedActionType.slice(`${namespacePrefix}/`.length)

export const INITIALIZE_DATAKEY = Symbol(namespace('INITIALIZE_DATAKEY'))



// WEBPACK FOOTER //
// ./app/libs/mallard/src/actions/types.js