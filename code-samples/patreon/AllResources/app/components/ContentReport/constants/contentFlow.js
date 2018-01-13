import {
    COPYRIGHT,
    GRAPHIC,
    HARMFUL,
    INITIAL,
    NOT_AUTHENTIC,
    IMPERSONATION,
    POST,
    SPAM,
    EVIDENCE,
} from './core'

import { makeHarmfulPage, makeGraphicPage, makePostChoice } from '../utilities'

const notAuthenticChoice = makePostChoice(NOT_AUTHENTIC)
const harmfulChoice = makePostChoice(HARMFUL)
const graphicChoice = makePostChoice(GRAPHIC)
const copyrightChoice = makePostChoice(COPYRIGHT)
const harmfulPage = makeHarmfulPage({ header: harmfulChoice.label, flow: POST })
const graphicPage = makeGraphicPage({ header: graphicChoice.label, flow: POST })

export const CONTENT_FLOW = {
    [INITIAL]: {
        header: `Why are you reporting this content?`,
        choices: [
            notAuthenticChoice,
            harmfulChoice,
            graphicChoice,
            copyrightChoice,
        ],
    },
    [NOT_AUTHENTIC]: {
        header: notAuthenticChoice.label,
        choices: [
            { value: SPAM, label: 'This is spam' },
            makePostChoice(IMPERSONATION),
        ],
    },
    [HARMFUL]: harmfulPage,
    [GRAPHIC]: graphicPage,
    [EVIDENCE]: {
        key: 'contentEvidence',
        header: 'Where should we look?',
        componentName: 'PostTimestampForm',
    },
    [COPYRIGHT]: {
        header: copyrightChoice.label,
        componentName: 'CopyrightPage',
    },
}



// WEBPACK FOOTER //
// ./app/components/ContentReport/constants/contentFlow.js