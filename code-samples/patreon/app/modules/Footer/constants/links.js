import { FOOTER_EVENTS } from 'analytics'

const becomeCreatorLink = {
    label: 'Create on Patreon',
    href: '/create?continue=true',
}
const inviteCreatorsLink = { label: 'Invite Creators', href: '/invite' }

export const getDefaultLinks = isCreator => [
    {
        links: [
            { label: 'About', href: '/about' },
            { label: 'Careers', href: '/careers' },
            isCreator ? inviteCreatorsLink : becomeCreatorLink,
            { label: 'Brand', href: '/brand' },
            { label: 'Press', href: '/press' },
            { label: 'Partners', href: 'https://partners.patreon.com' },
            { label: 'Sitemap', href: '/sitemap' },
        ],
    },

    {
        links: [
            { label: 'Help Center & FAQs', href: 'http://support.patreon.com' },
            {
                label: 'Developers',
                href: '/developers',
            },
            {
                label: 'App Directory',
                href: '/apps',
            },
            { label: 'Creator Blog', href: 'https://blog.patreon.com/' },
            { label: 'Creator Guides', href: 'https://learn.patreon.com/' },
            { label: 'Community Guidelines', href: '/guidelines' },
            { label: 'Terms of Use', href: '/legal' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
    },
]

export const SOCIAL_LINKS = [
    {
        icon: 'socialTwitter',
        href: 'https://twitter.com/patreon',
    },
    {
        icon: 'socialFacebook',
        href: 'https://www.facebook.com/patreon',
    },
    {
        icon: 'socialInstagram',
        href: 'http://instagram.com/patreon',
    },
]

export const MOBILE_DOWNLOAD_BUTTONS = [
    {
        backgroundImage:
            'https://c5.patreon.com/external/mobile-download-buttons/android-download-badge.png',
        dataTag: 'androidButton',
        href:
            'https://play.google.com/store/apps/details?id=com.patreon.android',
        hrefTarget: '_new',
        analyticsEventTitle: FOOTER_EVENTS
            ? FOOTER_EVENTS.CLICK_ANDROID_LINK
            : null,
    },
    {
        backgroundImage:
            'https://c5.patreon.com/external/mobile-download-buttons/ios-download-badge.png',
        dataTag: 'iOSButton',
        href: 'https://itunes.apple.com/app/id1044456188',
        hrefTarget: '_new',
        analyticsEventTitle: FOOTER_EVENTS
            ? FOOTER_EVENTS.CLICK_IOS_LINK
            : null,
    },
]



// WEBPACK FOOTER //
// ./app/modules/Footer/constants/links.js