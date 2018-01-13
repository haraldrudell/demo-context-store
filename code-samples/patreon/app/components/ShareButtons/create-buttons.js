import url from 'url'

import { PATREON_COM } from 'constants/hostnames'

export const FACEBOOK = 'facebook'
export const TWITTER = 'twitter'
export const TUMBLR = 'tumblr'
export const PINTEREST = 'pinterest'
export const GOOGLE = 'googleplus'

export const createTrackingParams = (source, campaign) => {
    return {
        'utm_medium': 'social',
        'utm_source': source,
        'utm_campaign': campaign
    }
}

/**
 * Facebook
 */
export const facebook = (
    canonicalUrl,
    title,
    query = {}
) => {
    const href = url.format({
        host: 'facebook.com',
        pathname: '/sharer.php',
        query: {
            u: canonicalUrl,
            t: title,
            ...query
        }
    })

    return {
        href: href,
        hrefTitle: title,
        icon: 'socialRoundedFacebook',
        key: FACEBOOK,
        platform: 'Facebook',
        label: 'Facebook',
        color: 'facebookBlue',
        windowConfig: {
            width: 600,
            height: 380
        }
    }
}

/**
 * Twitter
 */
export const twitter = (
    canonicalUrl,
    title,
    query = {}
) => {
    const href = url.format({
        host: 'twitter.com',
        pathname: '/share',
        query: {
            url: canonicalUrl,
            text: title,
            ...query
        }
    })

    return {
        href: href,
        hrefTitle: title,
        icon: 'socialRoundedTwitter',
        key: TWITTER,
        platform: 'Twitter',
        label: 'Twitter',
        color: 'twitterBlue',
        windowConfig: {
            width: 800,
            height: 320
        }
    }
}

/**
 * Tumblr
 */
export const tumblr = (
    canonicalUrl,
    title,
    query = {}
) => {
    if (process.env.NODE_ENV === 'development') {
        if (!query.source) console.warn('Tumblr share is missing media `source` query param. =>', query)
    }

    const href = url.format({
        host: 'tumblr.com',
        pathname: '/share/photo',
        query: {
            caption: title,
            clickthru: canonicalUrl,
            ...query
        }
    })

    return {
        href: href,
        hrefTitle: title,
        icon: 'socialRoundedTumblr',
        key: TUMBLR,
        platform: 'Tumblr',
        label: 'Tumblr',
        color: 'tumblrBlue',
        windowConfig: {
            width: 450,
            height: 435
        }
    }
}

/**
 * Pinterest
 */
export const pinterest = (
    canonicalUrl,
    title,
    query = {}
) => {
    if (process.env.NODE_ENV === 'development') {
        if (!query.media) console.warn('Pinterest share is missing `media` query param. =>', query)
    }

    const href = url.format({
        host: 'pinterest.com',
        pathname: '/pin/create/button',
        query: {
            url: canonicalUrl,
            description: title,
            ...query
        }
    })

    return {
        href: href,
        hrefTitle: title,
        icon: 'socialRoundedPinterest',
        key: PINTEREST,
        platform: 'Pinterest',
        label: 'Pinterest',
        color: 'pinterestRed',
        windowConfig: {
            width: 600,
            height: 300
        }
    }
}

/**
 * Google
 */
export const google = (
    canonicalUrl,
    title,
    query = {}
) => {
    const href = url.format({
        host: 'plus.google.com',
        pathname: '/share',
        query: {
            url: canonicalUrl,
            ...query
        }
    })

    return {
        href: href,
        hrefTitle: title,
        icon: 'socialRoundedGoogleplus',
        key: GOOGLE,
        platform: 'Google',
        label: 'Google+',
        color: 'googleRed',
        windowConfig: {
            width: 500,
            height: 320
        }
    }
}

export function createFromPostLaunchTips ({ imageUrl, oneLiner }, {id, fullName, vanity}, utm) {
    const prefillText = `It's official: I just launched on @Patreon! Check out my new page here:`

    const UTM_LAUNCH_SHARE = utm || 'launchshare'
    const shareUrl = (source) => {
        const _url = {
            protocol: 'https',
            hostname: PATREON_COM,
            query: {}
        }

        if (vanity) {
            _url['pathname'] = vanity
        } else {
            _url['pathname'] = 'user'
            _url.query['u'] = id
        }

        _url.query = {
            ..._url.query,
            ...createTrackingParams(source, UTM_LAUNCH_SHARE)
        }

        return url.format(_url)
    }

    return [
        facebook(shareUrl(FACEBOOK), prefillText),
        twitter(shareUrl(TWITTER), prefillText, {hashtags: 'NowOnPatreon'}),
        tumblr(shareUrl(TUMBLR), prefillText, { source: ((imageUrl && imageUrl.url) ? imageUrl.url : 'https://' + imageUrl) }),
        pinterest(
            shareUrl(PINTEREST),
            `Pin ${fullName} on Pinterest`,
            {
                description: oneLiner, media: imageUrl
            }
        ),
        google(shareUrl(GOOGLE), prefillText)
    ]
}

export function createFromCampaign ({ imageUrl, oneLiner }, { id, fullName, vanity }, shareMessage, utmCode) {
    // this needs refactored (explicitly pass in text)
    let prefillText = `Support ${fullName}`
    if (shareMessage){
        prefillText = shareMessage
    }

    // this needs refactored (explicitly pass in utm)
    let utm = 'creatorshare'
    if (utmCode) {
        utm = utmCode
    }

    const shareUrl = (source) => {
        const _url = {
            protocol: 'https',
            hostname: PATREON_COM,
            query: {}
        }

        if (vanity) {
            _url['pathname'] = vanity
        } else {
            _url['pathname'] = 'user'
            _url.query['u'] = id
        }

        _url.query = {
            ..._url.query,
            ...createTrackingParams(source, utm)
        }

        return url.format(_url)
    }
    return [
        facebook(shareUrl(FACEBOOK), prefillText),
        twitter(shareUrl(TWITTER), prefillText),
        tumblr(shareUrl(TUMBLR), prefillText, { source: ((imageUrl && imageUrl.url) ? imageUrl.url : 'https://' + imageUrl) }),
        pinterest(
            shareUrl(PINTEREST),
            `Pin ${fullName} on Pinterest`,
            {
                description: oneLiner, media: imageUrl
            }
        ),
        google(shareUrl(GOOGLE), prefillText)
    ]
}

export function createFromParsedPost(post) {
    return createFromPost({id: post.id, attributes: post}, post.user)
}

export function createFromPost ({ id, attributes }, author) {
    const { title, image } = attributes

    const { isOwner, fullName } = author

    const imageUrl = image || `//www.patreon.com/images/logo_p.png`

    const prefillText = title
        ? title
        : `Check out ${isOwner ? 'my' : 'this' } post on patreon.com`

    const UTM_CREATOR_POSTS = 'postshare'
    const shareUrl = (source) => {
        const _url = url.parse(attributes.url)

        _url.query = {
            ..._url.query,
            ...createTrackingParams(source, UTM_CREATOR_POSTS)
        }

        return url.format(_url)
    }

    return [
        facebook(shareUrl(FACEBOOK), prefillText),
        twitter(shareUrl(TWITTER), prefillText),
        tumblr(shareUrl(TUMBLR), prefillText, { source: ((imageUrl && imageUrl.url) ? imageUrl.url : 'https://' + imageUrl) }),
        pinterest(
            shareUrl(PINTEREST),
            `Pin ${title || fullName}'s post on Pinterest`,
            { description: prefillText, media: imageUrl }
        ),
        google(shareUrl(GOOGLE), prefillText)
    ]
}



// WEBPACK FOOTER //
// ./app/components/ShareButtons/create-buttons.js