import {
    POST_DISPLAY_TYPES,
    API_POST_TYPES,
    SUPPORTED_IMAGE_TYPES_RE,
    SUPPORTED_AUDIO_HOSTS_RE,
    SUPPORTED_VIDEO_HOSTS_RE,
} from 'constants/posts'

import url from 'url'
import autolink from 'libs/autolink'
import access from 'safe-access'
import get from 'lodash/get'

const POST_WIDTH_IN_POST_PAGE = 730
const POST_WIDTH_IN_FEED_CUTOFF = 620

export default (data, attachments, { preferredImageWidth } = {}) => {
    const { postDisplayType, media } = _getDisplayTypeAndMedia(
        data,
        preferredImageWidth,
    )

    return {
        postDisplayType,
        media,
        content: autolink(data.content),
        attachments: _getAttachments(attachments),
    }
}

const _getPreferredImageSrc = (
    data,
    preferredImageWidth = POST_WIDTH_IN_POST_PAGE,
) => {
    if (preferredImageWidth < POST_WIDTH_IN_FEED_CUTOFF) {
        return get(data, 'image.url', get(data, 'image.largeUrl'))
    }
    return get(data, 'image.largeUrl', get(data, 'image.url'))
}

function _getDisplayTypeAndMedia(data, preferredImageWidth) {
    let postDisplayType, media

    if (_isAudioUploadWithImage(data)) {
        postDisplayType = POST_DISPLAY_TYPES.AUDIO_WITH_IMAGE
        media = {
            audio: {
                src: access(data, 'postFile.url'),
            },
            image: {
                src: _getPreferredImageSrc(data, preferredImageWidth),
                width: access(data, 'image.width'),
                height: access(data, 'image.height'),
            },
        }
        media.imageSrc = media.image.src
        return { postDisplayType, media }
    }

    if (_isAudioUpload(data)) {
        postDisplayType = POST_DISPLAY_TYPES.AUDIO
        media = {
            src: access(data, 'postFile.url'),
        }
        return { postDisplayType, media }
    }

    if (data.postType === API_POST_TYPES.LIVESTREAM_CROWDCAST) {
        postDisplayType = POST_DISPLAY_TYPES.LIVESTREAM_CROWDCAST

        media = {
            src: _getPreferredImageSrc(data, preferredImageWidth),
            url: access(data, 'embed.url'),
        }
        return {
            postDisplayType,
            media,
        }
    }

    if (_isImageUpload(data) || _isLegacyImageUpload(data)) {
        postDisplayType = POST_DISPLAY_TYPES.IMAGE
        let imageURL
        if (_getPreferredImageSrc(data, preferredImageWidth)) {
            imageURL = _getPreferredImageSrc(data, preferredImageWidth)
        } else if (access(data, 'postFile.url')) {
            imageURL = access(data, 'postFile.url')
        } else if (access(data, 'thumbnail.url')) {
            imageURL = access(data, 'thumbnail.url')
        } else if (access(data, 'image.thumbUrl')) {
            imageURL = access(data, 'image.thumbUrl')
        }
        media = {
            src: imageURL,
            width: access(data, 'image.width'),
            height: access(data, 'image.height'),
        }
        media.imageSrc = media.src
        media.originalImageSrc = access(data, 'postFile.url')
        return { postDisplayType, media }
    }

    let legacyMediaEmbedType
    const isMediaEmbed =
        _isVideoEmbed(data) ||
        _isAudioEmbed(data) ||
        !!(legacyMediaEmbedType = _getLegacyMediaEmbedType(data))
    if (isMediaEmbed) {
        const isVideoEmbed =
            _isVideoEmbed(data) ||
            legacyMediaEmbedType === API_POST_TYPES.VIDEO_EMBED
        postDisplayType = isVideoEmbed
            ? POST_DISPLAY_TYPES.VIDEO_EMBED
            : POST_DISPLAY_TYPES.AUDIO_EMBED

        let embedHtml = access(data, 'embed.html')

        /* one known case for no embedHtml is when someone tried to link to to a private video on Vimeo.
           There's no image or embed data, so just pass through and this will be a rich text post. -gb */
        if (embedHtml) {
            const htmlWithAutoplay = embedHtml.replace(
                /src\s*=\s*"(.+?)"/,
                (match, urlString) => {
                    const parsed = url.parse(urlString, true)
                    parsed.query.autoplay = 1

                    const newUrl = url.format(parsed)
                    return `src=${newUrl}`
                },
            )
            media = {
                embedHtml: htmlWithAutoplay,
                thumbnailUrl: _getPreferredImageSrc(data, preferredImageWidth),
            }
            media.imageSrc = media.thumbnailUrl
            return { postDisplayType, media }
        }
    }

    if (_isImageEmbed(data)) {
        postDisplayType = POST_DISPLAY_TYPES.IMAGE
        media = {
            src: access(data, 'embed.url'),
            width: access(data, 'image.width'),
            height: access(data, 'image.height'),
        }
        media.imageSrc = media.src
        return { postDisplayType, media }
    }

    if (_isGenericEmbed(data)) {
        postDisplayType = POST_DISPLAY_TYPES.LINK
        let thumbnailUrl
        if (_getPreferredImageSrc(data, preferredImageWidth)) {
            thumbnailUrl = _getPreferredImageSrc(data, preferredImageWidth)
        } else if (access(data, 'thumbnail.url')) {
            thumbnailUrl = access(data, 'thumbnail.url')
        } else if (access(data, 'image.thumbUrl')) {
            thumbnailUrl = access(data, 'image.thumbUrl')
        }
        media = {
            url: access(data, 'embed.url'),
            imageSrc: thumbnailUrl,
            subject: access(data, 'embed.subject'),
            description: access(data, 'embed.description'),
            domain: access(data, 'embed.provider'),
        }
        return { postDisplayType, media }
    }

    if (_isPrivateEmbeddedContentWithThumbnail(data)) {
        return {
            postDisplayType: POST_DISPLAY_TYPES.PRIVATE_CONTENT,
            media: {
                imageSrc: access(data, 'image.largeUrl'),
            },
        }
    }

    if (_isPoll(data)) {
        return {
            postDisplayType: POST_DISPLAY_TYPES.POLL,
            media: null,
        }
    }

    /* for now, use text-only for non-image links
    (later add preview box of link content to match mobile UI)  */
    postDisplayType = POST_DISPLAY_TYPES.RICH_TEXT_ONLY
    media = null
    return { postDisplayType, media }
}

function _isVideoEmbed(data) {
    return data.postType === API_POST_TYPES.VIDEO_EMBED
}

function _isAudioEmbed(data) {
    return data.postType === API_POST_TYPES.AUDIO_EMBED
}

function _getLegacyMediaEmbedType(data) {
    if (!access(data, 'embed.url')) return null
    const embedURL = data.embed.url
    const parsedEmbedURL = url.parse(embedURL)
    if (_isVideoHost(parsedEmbedURL.hostname)) {
        return API_POST_TYPES.VIDEO_EMBED
    } else if (_isAudioHost(parsedEmbedURL.hostname)) {
        return API_POST_TYPES.AUDIO_EMBED
    }
    return null
}

function _isVideoHost(hostname) {
    return SUPPORTED_VIDEO_HOSTS_RE.test(hostname)
}

function _isAudioHost(hostname) {
    return SUPPORTED_AUDIO_HOSTS_RE.test(hostname)
}

function _isImageEmbed(data) {
    return (
        access(data, 'embed.url') &&
        SUPPORTED_IMAGE_TYPES_RE.test(data.embed.url)
    )
}

function _isPoll(data) {
    return data.postType === API_POST_TYPES.POLL
}

function _isImageUpload(data) {
    return data.postType === API_POST_TYPES.IMAGE_FILE
}

function _isLegacyImageUpload(data) {
    return data.postType === API_POST_TYPES.LEGACY_IMAGE
}

function _isAudioUpload(data) {
    return data.postType === API_POST_TYPES.AUDIO_FILE
}

function _isAudioUploadWithImage(data) {
    return data.postType === API_POST_TYPES.AUDIO_FILE && data.image
}

// should only be used after other embed types have been exhausted
function _isGenericEmbed(data) {
    return data.postType === API_POST_TYPES.LINK || access(data, 'embed.url')
}

function _isPrivateEmbeddedContentWithThumbnail(data) {
    const isMediaEmbed =
        _isVideoEmbed(data) ||
        _isAudioEmbed(data) ||
        Boolean(_getLegacyMediaEmbedType(data))
    return (
        (isMediaEmbed || _isImageEmbed(data)) && access(data, 'image.largeUrl')
    )
}

function _getAttachments(attachments) {
    if (!attachments || !attachments.length) {
        return null
    }
    return attachments.map(attachment => {
        return { name: attachment.name, url: attachment.url }
    })
}



// WEBPACK FOOTER //
// ./app/features/posts/Post/get-display-props.js