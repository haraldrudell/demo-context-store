import t from 'prop-types'
import React from 'react'
import get from 'lodash/get'

import { POST_DISPLAY_TYPES } from 'constants/posts'

import AudioPlayer, {
    VARIANT_DEFAULT,
    VARIANT_SQUARE,
} from 'components/AudioPlayer'
import GenericEmbed from 'components/GenericEmbed'
import CrowdcastLivestreamPreview from 'components/CrowdcastLivestreamPreview'
import Block from 'components/Layout/Block'
import MediaEmbed from 'features/posts/MediaEmbed'

import LightboxImageWrapper from 'components/LightboxImageWrapper'

const MediaHeader = props => {
    const {
        authorImagerUrl,
        currentUserCanView,
        handleClick,
        handleClickTitle,
        media,
        post,
        postDisplayType,
        url,
        isGridOptionSelected,
    } = props

    if (postDisplayType === POST_DISPLAY_TYPES.IMAGE || !currentUserCanView) {
        const imgStyle = {}
        const containerStyle = {
            textAlign: 'center',
            overflow: 'hidden',
            position: 'relative',
        }
        let imageSrc = null
        let originalImageSrc = null

        if (media) {
            if (currentUserCanView && media.width) {
                imgStyle['maxWidth'] = `${media.width}px`
            }
            imageSrc = get(media, 'src')
            if (!imageSrc || imageSrc.length === 0) {
                imageSrc = get(post, 'image.largeUrl')
            }
            if (!imageSrc || imageSrc.length === 0) {
                imageSrc = media.imageSrc
            }
            originalImageSrc = media.originalImageSrc
        }

        const imageOptions = {
            imageSrc,
            originalImageSrc,
            imgStyle,
            currentUserCanView,
            url,
            handleClickTitle,
            handleClick,
        }

        return imageSrc && imageSrc.length !== 0 ? (
            <div style={containerStyle}>
                <LightboxImageWrapper {...imageOptions} />
            </div>
        ) : (
            <span />
        )
    }

    if (
        postDisplayType === POST_DISPLAY_TYPES.VIDEO_EMBED ||
        postDisplayType === POST_DISPLAY_TYPES.AUDIO_EMBED
    ) {
        const embedType =
            postDisplayType === POST_DISPLAY_TYPES.VIDEO_EMBED
                ? 'video'
                : 'audio'
        return (
            <MediaEmbed
                variant={embedType}
                iframe={normalizeVideoUrl(media.embedHtml)}
                thumbnailUrl={media.thumbnailUrl}
                isGridOptionSelected={isGridOptionSelected}
            />
        )
    }

    if (
        postDisplayType === POST_DISPLAY_TYPES.AUDIO ||
        postDisplayType === POST_DISPLAY_TYPES.AUDIO_WITH_IMAGE
    ) {
        const hasImage = postDisplayType === POST_DISPLAY_TYPES.AUDIO_WITH_IMAGE
        const audioSrc = hasImage ? get(media, 'audio.src') : media.src
        const icon = hasImage ? media.image.src : authorImagerUrl

        return (
            <Block m={2}>
                <AudioPlayer
                    src={audioSrc}
                    thumbnail={icon}
                    variant={
                        isGridOptionSelected ? VARIANT_SQUARE : VARIANT_DEFAULT
                    }
                />
            </Block>
        )
    }

    if (postDisplayType === POST_DISPLAY_TYPES.LINK) {
        return isGridOptionSelected ? (
            <GenericEmbed
                {...media}
                isGridOptionSelected={isGridOptionSelected}
            />
        ) : (
            <Block m={3}>
                <GenericEmbed {...media} />
            </Block>
        )
    }

    if (postDisplayType === POST_DISPLAY_TYPES.LIVESTREAM_CROWDCAST) {
        return (
            <CrowdcastLivestreamPreview
                isGridOptionSelected={isGridOptionSelected}
                src={media.src || authorImagerUrl}
                url={media.url}
            />
        )
    }

    return <span />
}

function normalizeVideoUrl(link) {
    // Removes related videos at the end of youtube videos by adding 'rel=0' to the url.
    return link.replace('oembed&', 'oembed%26rel%3D0&')
}

MediaHeader.propTypes = {
    authorImagerUrl: t.string,
    currentUserCanView: t.bool,
    handleClick: t.func,
    post: t.object,
    media: t.shape({
        audio: t.shape({
            src: t.string,
        }),
        embedHtml: t.string,
        image: t.shape({
            src: t.string,
        }),
        imageSrc: t.string,
        src: t.string,
        thumbnailUrl: t.string,
        width: t.number,
    }),
    url: t.string.isRequired,
    handleClickTitle: t.func,
    postDisplayType: t.oneOf(Object.keys(POST_DISPLAY_TYPES)).isRequired,
    isGridOptionSelected: t.bool,
}

export default MediaHeader



// WEBPACK FOOTER //
// ./app/features/posts/MediaHeader/index.jsx