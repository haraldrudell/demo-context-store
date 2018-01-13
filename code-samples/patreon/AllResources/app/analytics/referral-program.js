import { makeLogger } from './logger'

export const REFERRAL_PROGRAM_EVENTS = {
    DOMAIN: 'Referral Program',

    LANDED: 'Landed',
    // This event triggers once per page load whenever the email field in the
    // send invite form is modified for the first time.
    CHANGED_EMAIL_FIELD: 'Changed Email Field',
    SHARE_VIA_FACEBOOK: 'Share via Facebook',
    SHARE_VIA_TWITTER: 'Share via Twitter',
    IMPORT_CONTACTS: 'Import Contacts',
    SEND_EMAIL: 'Send Email Email',
    EMAIL_INVALID: 'Email Validation Error',
    COPY_REFERRAL_LINK: 'Copy Referral Link',
    INDEX_PAGE_LANDED: 'Index Page : Landed',
}

export const REFERRAL_PROGRAM_DASHBOARD_EVENTS = {
    DOMAIN: 'Referral Program Dashboard',
    LANDED: 'Landed',
}

export const logReferralProgramEvent = makeLogger(REFERRAL_PROGRAM_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/referral-program.js