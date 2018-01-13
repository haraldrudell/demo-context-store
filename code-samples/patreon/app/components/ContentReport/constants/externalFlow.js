import {
    COPYRIGHT,
    EXTERNAL,
    GRAPHIC,
    HARMFUL,
    CONVICTED_OF_FINANCIAL_CRIME,
    EVIDENCE,
} from './core'
import {
    makeExternalChoice,
    makeHarmfulPage,
    makeGraphicPage,
} from '../utilities'

const harmfulChoice = makeExternalChoice(HARMFUL)
const graphicChoice = makeExternalChoice(GRAPHIC)
const copyrightChoice = makeExternalChoice(COPYRIGHT)
const harmfulPage = makeHarmfulPage({
    header: harmfulChoice.label,
    flow: EXTERNAL,
})
const graphicPage = makeGraphicPage({
    header: graphicChoice.label,
    flow: EXTERNAL,
})

harmfulPage.choices.push({
    value: CONVICTED_OF_FINANCIAL_CRIME,
    label: 'This creator has been convicted of a financial crime',
})

export const externalPage = {
    header: `Why are you reporting this creator?`,
    choices: [harmfulChoice, graphicChoice, copyrightChoice],
}

export const EXTERNAL_FLOW = {
    [HARMFUL]: harmfulPage,
    [GRAPHIC]: graphicPage,
    [EVIDENCE]: {
        key: 'campaignEvidence',
        header: 'Where should we look?',
        componentName: 'CampaignEvidenceForm',
    },
    [COPYRIGHT]: {
        header: copyrightChoice.label,
        componentName: 'CopyrightPage',
    },
}



// WEBPACK FOOTER //
// ./app/components/ContentReport/constants/externalFlow.js