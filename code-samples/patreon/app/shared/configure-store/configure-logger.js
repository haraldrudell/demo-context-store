import { createLogger } from 'redux-logger'
import { titleFormatter as nionTitleFormatter } from 'nion'
import { titleFormatter as reformTitleFormatter } from 'libs/reform'

const titleFormatter = (action, time, took) => {
    const typeStr = action.type.toString()
    let actionString = `action ${typeStr} (in ${took.toFixed(2)} ms)`
    const formatters = [nionTitleFormatter, reformTitleFormatter]

    for (let formatter of formatters) {
        const result = formatter(action, time, took)
        if (result !== actionString) {
            return result
        }
    }
    return actionString
}

export default ({ diff }) => {
    let options = {
        diff,
        collapsed: true,
        duration: true,
        timestamp: false,
        titleFormatter,
    }

    return {
        middleware: [createLogger(options)],
    }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-logger.js