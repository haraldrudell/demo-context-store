/**
 *
 * NOTE: Possibly deprecated in favor of utilities/bootstrap-actions.
 *
 */

import access from 'safe-access'


/* default evaluation func treats any data that has been defined
   as success in getting the data (even if value is falsy or null) -gb */
const defaultEvaluationFunc = (dataToEvaluate)=> typeof dataToEvaluate !== 'undefined'


/**
 * Gets stuff from window.patreon.bootstrap, calls actions, and cleans up dom element
 * @param function [dispatch]
 * @param { ...{string|func get, func okAction, [ func failAction ], [ func evaluationFunc ]} } [dataCommands]
 * one or many objects that represent a piece of data to get and what action to trigger with it
 * @return void
 */
export default function getBootstrapData(dispatch, ...dataCommands) {
    const bootstrapData = access(window, 'patreon.bootstrap') || {}
    dataCommands.forEach((dataCommand, i) => {
        const { get, okAction, failAction = null, evaluationFunc = defaultEvaluationFunc } = dataCommand
        const data = typeof get === 'string' ? bootstrapData[get] : get(bootstrapData)
        if (evaluationFunc(data)) {
            dispatch(okAction(data))
        } else {
            failAction && dispatch(failAction(data))
        }
    })
}



// WEBPACK FOOTER //
// ./app/utilities/get-bootstrap-data.js