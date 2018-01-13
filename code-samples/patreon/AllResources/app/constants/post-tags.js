export const PUBLIC_TAG_TYPE = 'public'
export const PATRON_ONLY_TAG_TYPE = 'patron_only'
export const USER_DEFINED_TAG_TYPE = 'user_defined'
export const YEAR_MONTH_TAG_TYPE = 'year_month'
export const REWARD_TIER_TAG_TYPE = 'reward_tier'
export const PAID_FOR_BY_PATRONS_TAG_TYPE = 'paid_for_by_patrons'

export const PUBLIC_TAG_TYPE_PARAM = 'public'
export const PATRON_ONLY_TAG_TYPE_PARAM = 'patron'
export const USER_DEFINED_TAG_TYPE_PARAM = 'tag'
export const YEAR_MONTH_TAG_TYPE_PARAM = 'month'
export const REWARD_TIER_TAG_TYPE_PARAM = 'rewardTier'
export const PAID_FOR_BY_PATRONS_TAG_TYPE_PARAM = 'paidForByPatrons'

export const TAG_TYPE_TO_PARAM_MAPPING = {
    'public': PUBLIC_TAG_TYPE_PARAM,
    'patron_only':  PATRON_ONLY_TAG_TYPE_PARAM,
    'user_defined': USER_DEFINED_TAG_TYPE_PARAM,
    'year_month': YEAR_MONTH_TAG_TYPE_PARAM,
    'reward_tier': REWARD_TIER_TAG_TYPE_PARAM,
    'paid_for_by_patrons': PAID_FOR_BY_PATRONS_TAG_TYPE_PARAM
}

let paramToTagType = {}
paramToTagType[USER_DEFINED_TAG_TYPE_PARAM] = USER_DEFINED_TAG_TYPE
paramToTagType[YEAR_MONTH_TAG_TYPE_PARAM] = YEAR_MONTH_TAG_TYPE
paramToTagType[REWARD_TIER_TAG_TYPE_PARAM] = REWARD_TIER_TAG_TYPE
paramToTagType[PATRON_ONLY_TAG_TYPE_PARAM] = PATRON_ONLY_TAG_TYPE
paramToTagType[PUBLIC_TAG_TYPE_PARAM] = PUBLIC_TAG_TYPE
paramToTagType[PAID_FOR_BY_PATRONS_TAG_TYPE_PARAM] = PAID_FOR_BY_PATRONS_TAG_TYPE

export const PARAM_TO_TAG_TYPE_MAPPING = paramToTagType



// WEBPACK FOOTER //
// ./app/constants/post-tags.js