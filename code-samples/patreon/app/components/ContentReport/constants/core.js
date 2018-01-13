export const PROFILE = 'profile'
export const EXTERNAL = 'external'
export const POST = 'post'
export const CAMPAIGN = 'campaign'
export const MONOCLE_CLIP = 'monocle_clip'
export const INITIAL = 'initial'

// categories / screens
export const SUCCESS = 'success'
export const COPYRIGHT = 'copyright'
export const GRAPHIC = 'graphic'
export const HARMFUL = 'harmful'
export const NOT_AUTHENTIC = 'notAuthentic'
export const OFFENSIVE = 'offensive'
export const EVIDENCE = 'evidence'

// report reasons, should mirror patreon/constants/content_reporting_constants.py
export const SPAM = 'spam'
export const IMPERSONATION = 'impersonation'
export const HATE_SPEECH = 'hate_speech'
export const HARASSMENT = 'harassment'
export const INCITING_VIOLENCE = 'inciting_violence'
export const SHARING_PERSONAL_INFORMATION = 'sharing_personal_information'
export const CHILD_EXPLOITATION = 'child_exploitation'
export const HURTING_SELF = 'hurting_self'
export const PORNOGRAPHIC = 'pornographic'
export const GLORIFYING_SEXUAL_VIOLENCE = 'glorifying_sexual_violence'
export const CONVICTED_OF_FINANCIAL_CRIME = 'convicted_of_financial_crime'

export const labels = {
    [HARASSMENT]: 'bullying or harassing',
    [COPYRIGHT]: 'violating copyright',
    [SHARING_PERSONAL_INFORMATION]: `sharing someone's personal information`,
    [CHILD_EXPLOITATION]: 'exploiting children',
    [GRAPHIC]: {
        [PROFILE]: `This creator's profile contains something graphic`,
        [EXTERNAL]: `This creator makes graphic content`,
        [POST]: `This is graphic`,
    },
    [HARMFUL]: 'harmful',
    [HATE_SPEECH]: {
        [PROFILE]: `This creator's profile contains hate speech`,
        [EXTERNAL]: 'This creator engages in hate speech',
        [POST]: 'This is hate speech',
    },
    [HURTING_SELF]: {
        [PROFILE]: 'This person is hurting themself',
        [EXTERNAL]: 'This person is hurting themself',
        [POST]: 'This person is hurting themself',
    },
    [GRAPHIC]: {
        [PROFILE]: `This creator's profile is graphic`,
        [EXTERNAL]: `This creator creates graphic content`,
        [POST]: 'This content is graphic',
    },
    [NOT_AUTHENTIC]: 'not authentic',
    [IMPERSONATION]: {
        [PROFILE]: 'This person is not who they say they are',
        [POST]: 'This person is not who they say they are',
    },
    [OFFENSIVE]: 'offensive',
    [PORNOGRAPHIC]: {
        [PROFILE]: `This creator's profile contains pornographic material`,
        [EXTERNAL]: 'This creator creates pornographic material',
        [POST]: 'This is pornographic material',
    },
    [INCITING_VIOLENCE]: 'inciting violence',
    [GLORIFYING_SEXUAL_VIOLENCE]: 'glorifying sexual violence',
}



// WEBPACK FOOTER //
// ./app/components/ContentReport/constants/core.js