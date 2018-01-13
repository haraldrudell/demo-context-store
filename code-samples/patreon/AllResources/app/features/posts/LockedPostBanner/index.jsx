import { POST_EVENTS, logPostEvent } from 'analytics'
import t from 'prop-types'
import React, { Component } from 'react'
import formatCurrencyFromCents from 'utilities/format-currency-from-cents.js'

import { getBlurredTextImage } from './utilities'

import {
    MEDIA_NAME_FOR_BLURRED_POSTS_FROM_CATEGORY,
    POST_DISPLAY_TYPES,
} from 'constants/posts'
import { SINGLE_POST } from 'constants/feednames'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'

import BlurredPoll from 'components/BlurredPoll'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Text from 'components/Text'

import LightboxImageWrapper from 'components/LightboxImageWrapper'

import { BlurredContent, Opaque } from './styled-components'

export default class LockedPostBanner extends Component {
    static propTypes = {
        creatorId: t.string,
        id: t.string,
        isGridOptionSelected: t.bool,
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
        minCentsPledgedToView: t.number.isRequired,
        pageSource: t.string,
        postDisplayType: t.oneOf(Object.keys(POST_DISPLAY_TYPES)).isRequired,
        title: t.string,
        url: t.string.isRequired,
    }

    onLockedPostClick = e => {
        const { creatorId, id, minCentsPledgedToView, pageSource } = this.props
        e.stopPropagation()

        logPostEvent(POST_EVENTS.CLICKED_TO_GET_ACCESS, {
            creator_id: creatorId,
            is_blurred: true,
            post_id: id,
            min_cents_pledged_to_view: minCentsPledgedToView,
            source: pageSource,
        })
    }

    /* This text is used for all locked banners */
    bannerText = () => {
        const { minCentsPledgedToView, postDisplayType } = this.props
        const mediaName = postDisplayType
            ? MEDIA_NAME_FOR_BLURRED_POSTS_FROM_CATEGORY[postDisplayType]
            : 'post'

        return minCentsPledgedToView === 1
            ? `${mediaName} for patrons only`
            : `${mediaName} for ${formatCurrencyFromCents(
                  minCentsPledgedToView,
              )}+ patrons`
    }

    /* This textAndIcon is used for all locked banners */
    renderTextAndIcon = isDark => {
        const { pageSource } = this.props
        const isPostPage = pageSource === SINGLE_POST

        const buttonColor = isDark ? 'tertiary' : 'tertiary-inverse'
        const buttonSize = isPostPage ? 'md' : 'sm'
        const iconColor = isDark ? 'darkGray' : 'white'
        const iconSize = isPostPage ? 'xl' : 'md'
        const textColor = isDark ? 'dark' : 'white'
        const textScale = isPostPage ? '1' : '0'

        return (
            <Flexy
                alignItems="center"
                direction="column"
                fluidWidth
                justifyContent="space-around"
            >
                <Block mb={1}>
                    <Opaque>
                        <Icon color={iconColor} size={iconSize} type="lock" />
                    </Opaque>
                </Block>
                <Block mb={2}>
                    <Text
                        align="center"
                        color={textColor}
                        el="p"
                        noMargin
                        scale={textScale}
                        tracking="wide"
                        weight="bold"
                        uppercase
                    >
                        {this.bannerText()}
                    </Text>
                </Block>
                <Block>
                    <Button
                        color={buttonColor}
                        size={buttonSize}
                        onClick={this.onLockedPostClick}
                    >
                        Unlock it now
                    </Button>
                </Block>
            </Flexy>
        )
    }

    blurredImageSrc = () => {
        const { media } = this.props
        let imageSrc = null
        if (media) {
            imageSrc = media.src
            if (!imageSrc || imageSrc.length === 0) {
                imageSrc = media.imageSrc
            }
        }
        return imageSrc
    }

    /* This blurred image is only used for renderLockedDefaultBanner */
    renderBlurredImage = () => {
        const { pageSource, url, isGridOptionSelected } = this.props
        const bannerHeight =
            pageSource === SINGLE_POST
                ? '355px'
                : isGridOptionSelected ? '100%' : '186px'
        const imageSrc = this.blurredImageSrc()

        return (
            <LightboxImageWrapper
                currentUserCanView={false}
                imageSrc={imageSrc}
                height={bannerHeight}
                url={url}
                darken
            />
        )
    }

    renderLockedPollBanner = () => {
        const { isGridOptionSelected, pageSource, url } = this.props
        const numberOfRows =
            pageSource === SINGLE_POST ? 5 : isGridOptionSelected ? 3 : 3
        const padding = pageSource === SINGLE_POST ? 6 : 4

        return (
            <Block p={padding} position="relative" fluidWidth fluidHeight>
                <a href={url} onClick={this.onLockedPostClick}>
                    <BlurredContent>
                        <BlurredPoll
                            numberOfRows={numberOfRows}
                            patreonUrl={url}
                        />
                    </BlurredContent>
                    <Flexy
                        alignItems="center"
                        justifyContent="center"
                        fluidHeight
                    >
                        <Block p={2}>{this.renderTextAndIcon(true)}</Block>
                    </Flexy>
                </a>
            </Block>
        )
    }

    renderLockedDefaultBanner = () => {
        const { pageSource } = this.props
        const isPostPage = pageSource === SINGLE_POST
        const padding = isPostPage ? 6 : 4
        const imageSrc = this.blurredImageSrc()
        const content = (
            <Flexy alignItems="center" justifyContent="center" fluidHeight>
                {this.renderTextAndIcon()}
            </Flexy>
        )

        return (
            <Block p={padding} position="relative" fluidWidth fluidHeight>
                <a href={this.props.url} onClick={this.onLockedPostClick}>
                    <BlurredContent
                        backgroundColor={imageSrc ? undefined : 'dark'}
                    >
                        {this.renderBlurredImage()}
                    </BlurredContent>
                    {isPostPage ? <Block pv={6}>{content}</Block> : content}
                </a>
            </Block>
        )
    }

    renderLockedTextBanner = () => {
        const { pageSource, title, url } = this.props
        const isPostPage = pageSource === SINGLE_POST
        const padding = isPostPage ? 6 : 4
        const { src } = getBlurredTextImage(isPostPage, title)

        return (
            <Block p={padding} position="relative" fluidWidth fluidHeight>
                <a href={url} onClick={this.onLockedPostClick}>
                    <BlurredContent
                        style={{ backgroundImage: `url(${src})` }}
                    />
                    <Flexy
                        alignItems="center"
                        justifyContent="center"
                        fluidHeight
                        fluidWidth
                    >
                        {this.renderTextAndIcon(true)}
                    </Flexy>
                </a>
            </Block>
        )
    }

    render() {
        const { postDisplayType } = this.props
        const { POLL, RICH_TEXT_ONLY } = POST_DISPLAY_TYPES

        switch (postDisplayType) {
            case POLL:
                return this.renderLockedPollBanner()
            case RICH_TEXT_ONLY:
                return this.renderLockedTextBanner()
            default:
                return this.renderLockedDefaultBanner()
        }
    }
}



// WEBPACK FOOTER //
// ./app/features/posts/LockedPostBanner/index.jsx