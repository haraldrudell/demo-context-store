const PROMOTIONAL_EMAILS_PREFS_COUNTRIES = [
    ['US', 'United States'],
    ['CA', 'Canada'],
    ['BR', 'Brazil'],
    ['DE', 'Germany'],
    ['JP', 'Japan'],
    ['MX', 'Mexico'],
    ['NL', 'Netherlands'],
    ['NO', 'Norway'],
    ['PR', 'Puerto Rico'],
    ['KR', 'South Korea'],
    ['UK', 'United Kingdom'],
    ['OT', 'Other']
];

const PromotionalEmailsPrefsFrequency = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY'
};

const EmailSubscriptionTypes = {
    CONSUMER: 'CONSUMER',
    TRIGGERED: 'TRIGGERED',
    PLAY: 'PLAY',
    MAIL: 'MAIL'
};

const SubscriptionStatus = {
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED'
};


module.exports = {
    PROMOTIONAL_EMAILS_PREFS_COUNTRIES,
    PromotionalEmailsPrefsFrequency,
    EmailSubscriptionTypes,
    SubscriptionStatus
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/constants.js