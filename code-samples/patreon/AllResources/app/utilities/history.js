import { browserHistory, createMemoryHistory } from 'react-router'
import get from 'lodash/get'
import getWindow from 'utilities/get-window'
import { isTest, isClient } from 'shared/environment'

export default route => {
    if (!browserHistory || isTest() || !isClient()) {
        let fakeRoute = route
        if (!fakeRoute) {
            fakeRoute = get(getWindow(), 'location.pathname')
            if (get(getWindow(), 'location.search')) {
                fakeRoute += get(getWindow(), 'location.search')
            }
            if (get(getWindow(), 'location.hash')) {
                fakeRoute += get(getWindow(), 'location.hash')
            }
        }

        const history = createMemoryHistory(fakeRoute)
        return history
    } else {
        return browserHistory
    }
}



// WEBPACK FOOTER //
// ./app/utilities/history.js