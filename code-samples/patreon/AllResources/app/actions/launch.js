import nets from 'nets'
import querystring from 'querystring'

export const POST_LAUNCH = 'POST_LAUNCH'
export const POST_LAUNCH_REQUEST = 'POST_LAUNCH_REQUEST'
export const POST_LAUNCH_FAILURE = 'POST_LAUNCH_FAILURE'
export const POST_LAUNCH_SUCCEED = 'POST_LAUNCH_SUCCEED'
// ^^ not '_SUCCESS' since that would force it through our api middleware stuff

export default onLaunchSuccess => (dispatch, getState) => {
    dispatch({ type: POST_LAUNCH_REQUEST })

    const uri = encodeURIComponent(window.location.pathname)

    return nets(
        {
            uri: '/REST/auth/CSRFTicket?uri=' + uri,
            encoding: undefined,
        },
        function(err, resp, body) {
            if (err) {
                dispatch({ type: POST_LAUNCH_FAILURE, payload: err })
                return Promise.resolve(err)
            }

            const csrf = JSON.parse(body)

            const processReq = {
                method: 'POST',
                uri: '/processUserSetup',
                withCredentials: true,
                body: querystring
                    .stringify({
                        'CSRFToken[URI]': csrf.URI,
                        'CSRFToken[time]': csrf.time,
                        'CSRFToken[token]': csrf.token,
                    })
                    .toString('utf8'),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }

            return nets(processReq, function(_err, _resp, _body) {
                if (_err) {
                    dispatch({ type: POST_LAUNCH_FAILURE, payload: err })
                    return Promise.resolve(_err)
                }

                onLaunchSuccess && onLaunchSuccess()

                return dispatch({ type: POST_LAUNCH_SUCCEED })
            })
        },
    )
}



// WEBPACK FOOTER //
// ./app/actions/launch.js