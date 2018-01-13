export const titleFormatter = (action, time, took) => {
    let actionString = action.type.toString()
    if (actionString.indexOf('Symbol(reform/SET') === 0) {
        actionString = actionString
            .replace('Symbol(', '')
            .replace(')', `/${action.payload.dataKey}/${action.payload.name}`)
    } else if (actionString.indexOf('Symbol(reform/INITIALIZE') === 0) {
        actionString = actionString
            .replace('Symbol(', '')
            .replace(')', `/${action.payload.dataKey}`)
    }

    return `action ${actionString} (in ${took.toFixed(2)} ms)`
}



// WEBPACK FOOTER //
// ./app/libs/reform/src/logger/index.js