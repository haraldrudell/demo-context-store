import get from 'lodash/get'
import {
    greaterThan,
    lessThan,
    emptyOrValidURL,
} from 'libs/reform/src/validation'
import { validateOrFail } from 'libs/reform/src/validation/helpers'
import videoUrlParser from 'js-video-url-parser'

import {
    labels,
    PROFILE,
    EXTERNAL,
    POST,
    HATE_SPEECH,
    HARASSMENT,
    INCITING_VIOLENCE,
    SHARING_PERSONAL_INFORMATION,
    GLORIFYING_SEXUAL_VIOLENCE,
    CHILD_EXPLOITATION,
    HURTING_SELF,
    PORNOGRAPHIC,
    OFFENSIVE,
} from '../constants/core'

const makeBasicLabel = (violation, flow) => {
    let thing
    if (flow === PROFILE) {
        thing = `This creator's profile`
    } else if (flow === EXTERNAL) {
        thing = 'This creator'
    } else if (flow === POST) {
        thing = 'This'
    }
    return `${thing} is ${violation}`
}

const makeChoice = (key, flow) => ({
    value: key,
    label: get(labels, `${key}.${flow}`) || makeBasicLabel(labels[key], flow),
})

export const makePostChoice = key => makeChoice(key, POST)
export const makeProfileChoice = key => makeChoice(key, PROFILE)
export const makeExternalChoice = key => makeChoice(key, EXTERNAL)

export const makeHarmfulPage = ({ header, flow }) => ({
    header,
    choices: [
        makeChoice(OFFENSIVE, flow),
        makeChoice(HATE_SPEECH, flow),
        makeChoice(HARASSMENT, flow),
        makeChoice(INCITING_VIOLENCE, flow),
        makeChoice(SHARING_PERSONAL_INFORMATION, flow),
        makeChoice(GLORIFYING_SEXUAL_VIOLENCE, flow),
        makeChoice(CHILD_EXPLOITATION, flow),
        makeChoice(HURTING_SELF, flow),
    ],
})

export const makeGraphicPage = ({ header, flow }) => ({
    header,
    choices: [
        makeChoice(PORNOGRAPHIC, flow),
        makeChoice(OFFENSIVE, flow),
        makeChoice(GLORIFYING_SEXUAL_VIOLENCE, flow),
        makeChoice(CHILD_EXPLOITATION, flow),
        makeChoice(HURTING_SELF, flow),
    ],
})

export const timestampSecsFromInputs = ({ hours, minutes, seconds }) =>
    hours * 60 * 60 + minutes * 60 + seconds * 1

const urlIsVideo = url =>
    get(videoUrlParser.parse(url), 'mediaType') === 'video'

const videoURLNeedsTimestamp = suffix => (value, { model }) => {
    const timestamp = timestampSecsFromInputs({
        hours: model[`hours${suffix}`],
        minutes: model[`minutes${suffix}`],
        seconds: model[`seconds${suffix}`],
    })
    const url = model[`url${suffix}`]
    if (!(timestamp > 0) && url && urlIsVideo(url)) {
        return false
    }
    return true
}

const timestampValidation = ({ suffix, isCampaignEvidenceForm }) => {
    const secondsValidation = [
        {
            rules: [lessThan(60), greaterThan(-1)],
            errorResult: 'Please enter a number between 0 and 59.',
        },
    ]
    if (isCampaignEvidenceForm) {
        secondsValidation.push({
            rules: [videoURLNeedsTimestamp(suffix)],
            errorResult: 'Please enter a timestamp.',
        })
    }

    return {
        [`hours${suffix}`]: validateOrFail([
            {
                rules: [lessThan(9), greaterThan(-1)],
                errorResult: 'Please enter a number between 0 and 8',
            },
        ]),
        [`minutes${suffix}`]: validateOrFail([
            {
                rules: [lessThan(60), greaterThan(-1)],
                errorResult: 'Please enter a number between 0 and 59.',
            },
        ]),
        [`seconds${suffix}`]: validateOrFail(secondsValidation),
    }
}

const urlValidation = suffix => ({
    [`url${suffix}`]: validateOrFail([
        {
            rules: [emptyOrValidURL],
            errorResult: 'Please enter a valid url.',
        },
    ]),
})

// reform declarations
const postTimestampReformDeclaration = targetId => ({
    dataKey: `postTimestamp:${targetId}`,
    initialModel: {
        hours: null,
        minutes: null,
        seconds: null,
    },
    validation: timestampValidation({
        suffix: '',
        isCampaignEvidenceForm: false,
    }),
})

const campaignEvidenceReformDeclaration = {
    initialModel: {
        url1: null,
        hours1: null,
        minutes1: null,
        seconds1: null,
        url2: null,
        hours2: null,
        minutes2: null,
        seconds2: null,
        url3: null,
        hours3: null,
        minutes3: null,
        seconds3: null,
    },
    validation: {
        ...urlValidation('1'),
        ...timestampValidation({ suffix: '1', isCampaignEvidenceForm: true }),
        ...urlValidation('2'),
        ...timestampValidation({ suffix: '2', isCampaignEvidenceForm: true }),
        ...urlValidation('3'),
        ...timestampValidation({ suffix: '3', isCampaignEvidenceForm: true }),
    },
}

export const contentReportEvidenceDeclaration = ({ targetType, targetId }) => ({
    reportEvidence:
        targetType === POST
            ? postTimestampReformDeclaration(targetId)
            : campaignEvidenceReformDeclaration,
})



// WEBPACK FOOTER //
// ./app/components/ContentReport/utilities/index.js