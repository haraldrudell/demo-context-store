export const tableRowsArray = (props, propName, componentName) => {
    if (props.rows.length === 0) {
        return
    }
    const missingKey = props.rows.every(row => row.key === undefined)
    const colKeys = props.columns
        .map(f => f.accessor)
        .filter(f => typeof f === 'string')
    const missingAColumn = !props.rows.every(row =>
        colKeys.every(key => Object.keys(row).includes(key)),
    )
    const errMsg = `Invalid ${propName} supplied to ${componentName}: `

    if (missingKey) {
        return new Error(errMsg + 'every row must contain a key.')
    }

    if (missingAColumn) {
        return new Error(
            errMsg +
                'every row must contain the properties specified in the \
                     columns description. (This check does not account for \
                     dynamic accessors.)',
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/Table/proptypes.js