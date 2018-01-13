import formatCurrency from 'utilities/format-currency'

export const INVITE_CREATOR_REFERRAL_AMOUNT = 500
export const INVITE_CREATOR_REFERRAL_TEXT = 'Invite a Creator'
export const INVITE_CREATOR_REFERRAL_COLOR = 'blue'
export const INVITE_CREATOR_REFERRAL_DASHBOARD = 'INVITE_CREATOR_DASHBOARD'
export const INVITE_CREATOR_REFERRAL_HOME = 'INVITE_CREATOR_HOME'

const pledgeValueFormatted = formatCurrency(INVITE_CREATOR_REFERRAL_AMOUNT)
const incentiveText = `Earn up to ${pledgeValueFormatted} each time you invite a creator to Patreon.`

export const inviteCreatorModel = {
    referralAmount: INVITE_CREATOR_REFERRAL_AMOUNT,
    inviteButtonText: INVITE_CREATOR_REFERRAL_TEXT,
    inviteButtonColor: INVITE_CREATOR_REFERRAL_COLOR,
    incentiveText: incentiveText
}



// WEBPACK FOOTER //
// ./app/constants/invite-creator-prompt.js