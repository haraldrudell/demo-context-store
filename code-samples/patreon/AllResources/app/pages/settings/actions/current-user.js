import jsonApiUrl from 'utilities/json-api-url'
import apiRequestAction from 'actions/api-request-action'

import { SETTINGS_PAGE_EVENTS, logSettingsEvent } from 'analytics'

export const POST_REVERT_CURRENT_USER_TO_PATRON = 'POST_REVERT_CURRENT_USER_TO_PATRON'

export const revertCurrentUserToPatron = (previousPublishDate) => {
    const include = ['campaign.creator.null', 'locations.null']
    const fields = {
        'campaign': ['published_at']
    }

    const url = jsonApiUrl('/current_user/revert-to-patron', { include, fields })

    const action = apiRequestAction(
        POST_REVERT_CURRENT_USER_TO_PATRON,
        url
    )

    logSettingsEvent({
        title: SETTINGS_PAGE_EVENTS.REVERT_TO_PATRON_BEGAN,
        info: {
            previous_publish_date: previousPublishDate
        }
    })

    return action
}



// WEBPACK FOOTER //
// ./app/pages/settings/actions/current-user.js