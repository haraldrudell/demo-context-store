import { isClient } from 'shared/environment'

export default function(history) {
    if (!isClient()) {
        return
    }

    let currentPathname

    window.ga &&
        history.listen(location => {
            const { pathname, action } = location

            if (!currentPathname) {
                // this triggers on the initial pageload.
                return (currentPathname = pathname)
            }

            if (action === 'POP' || action === 'PUSH') {
                window.ga('set', 'page', pathname)
                window.ga('send', 'pageview')
                currentPathname = pathname
            }
        })
}



// WEBPACK FOOTER //
// ./app/utilities/notify-google-analytics-about-route-change.js