export {
    logCreatorNavEvent,
    logHeaderNavEvent,
    logSearchEvent,
} from 'analytics'

import { makeLogger } from 'analytics'
import { logSelectSearchEvent } from 'utilities/search'

export const logSubNavEvent = (domainName, eventName, info) => {
    // Since subnav events can occur across domains, we need to include the domainName as well as
    // the eventName and manually use LogEvent to log the event
    const loggingFn = makeLogger(domainName)
    loggingFn(eventName, info)
}

export const logSelectSearchNavEvent = (result, index) =>
    logSelectSearchEvent(result, index, 'header_nav')



// WEBPACK FOOTER //
// ./app/modules/Navigation/events/index.js