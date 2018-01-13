import { INITIAL, PROFILE, POST, EXTERNAL } from './core'
import { profilePage } from './profileFlow'
import { externalPage } from './externalFlow'

export const CAMPAIGN_FLOW = {
    [INITIAL]: {
        key: 'campaignInitial',
        header: 'What are you reporting this creator for?',
        choices: [
            {
                value: PROFILE,
                label: 'Something in their Patreon profile or rewards',
            },
            { value: POST, label: `Something they've posted on Patreon` },
            {
                value: EXTERNAL,
                label: `Something they've done outside of Patreon`,
            },
        ],
    },
    [PROFILE]: profilePage,
    [POST]: {
        header: 'Post Report',
        componentName: 'PostReportPage',
    },
    [EXTERNAL]: externalPage,
}



// WEBPACK FOOTER //
// ./app/components/ContentReport/constants/campaignFlow.js