import { COPYRIGHT, GRAPHIC, HARMFUL, IMPERSONATION, PROFILE } from './core'
import {
    makeProfileChoice,
    makeHarmfulPage,
    makeGraphicPage,
} from '../utilities'

// Only in this flow
export const NO_REWARD = 'noReward'
export const NOT_CREATING = 'notCreating'
const NOT_HONEST = 'notHonest'

const noRewardChoice = {
    value: NO_REWARD,
    label: 'This creator is not fulfilling their rewards',
}
const notCreatingChoice = {
    value: NOT_CREATING,
    label: 'This creator is not creating anymore',
}

const notHonestChoice = {
    value: NOT_HONEST,
    label: 'This creator is not being honest',
}

// Generate from core
const harmfulChoice = makeProfileChoice(HARMFUL)
const graphicChoice = makeProfileChoice(GRAPHIC)
const copyrightChoice = makeProfileChoice(COPYRIGHT)
const harmfulPage = makeHarmfulPage({
    header: harmfulChoice.label,
    flow: PROFILE,
})
const graphicPage = makeGraphicPage({
    header: graphicChoice.label,
    flow: PROFILE,
})

export const profilePage = {
    header: 'Why are you reporting this creator?',
    choices: [notHonestChoice, harmfulChoice, graphicChoice, copyrightChoice],
}

export const PROFILE_FLOW = {
    [NOT_HONEST]: {
        header: notHonestChoice.label,
        choices: [
            noRewardChoice,
            notCreatingChoice,
            makeProfileChoice(IMPERSONATION),
        ],
    },
    [NO_REWARD]: {
        header: noRewardChoice.label,
        componentName: 'RemovePledgePage',
    },
    [NOT_CREATING]: {
        header: notCreatingChoice.label,
        componentName: 'RemovePledgePage',
    },
    [HARMFUL]: harmfulPage,
    [GRAPHIC]: graphicPage,
    [COPYRIGHT]: {
        header: copyrightChoice.label,
        componentName: 'CopyrightPage',
    },
}



// WEBPACK FOOTER //
// ./app/components/ContentReport/constants/profileFlow.js