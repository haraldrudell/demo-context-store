import t from 'prop-types'
import React, { Component } from 'react'

import { withState } from 'recompose'

import Avatar from 'components/Avatar'
import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Col from 'components/Layout/Col'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Text from 'components/Text'

import {
    AvatarOutline,
    BackgroundImage,
    ButtonWrapper,
    EditPhoto,
    HiddenInput,
    PoweredBy,
    PreviewContent,
} from './styled-components'

import { CROWDCAST_EVENTS, POST_EVENTS, logCrowdcastEvent } from 'analytics'

/**
 * This component is used for both a preview on the makeAPost
 * page and as a header on the post stream / post pages.
 * On makeAPost it defaults to the creators avatar. It has additional
 * logic to add or remove images to replace the avatar.
 */
@withState('isHovering', 'setIsHovering', false)
export default class CrowdcastLivestreamPreview extends Component {
    static propTypes = {
        acceptedFileTypes: t.string,
        hasCustomImage: t.bool,
        isEditing: t.bool,
        isGridOptionSelected: t.bool,
        onAddImage: t.func,
        onRemoveImage: t.func,
        src: t.string,
        url: t.string,
        //@withState
        isHovering: t.bool,
        setIsHovering: t.func,
    }

    static defaultProps = {
        hasCustomImage: false,
        isEditing: false,
    }

    handleClickWatch = () => {
        logCrowdcastEvent([
            POST_EVENTS.DOMAIN,
            POST_EVENTS.CLICKED_WATCH_LIVESTREAM,
        ])
    }

    handleRemoveImage = () => {
        logCrowdcastEvent([
            CROWDCAST_EVENTS.UPLOAD_COVER_PHOTO,
            CROWDCAST_EVENTS.CLICKED_REMOVE_COVER_PHOTO,
        ])
        this.props.onRemoveImage()
    }

    renderEditPhoto = () => {
        const {
            acceptedFileTypes,
            hasCustomImage,
            isHovering,
            onAddImage,
        } = this.props

        const hiddenInput = (
            <HiddenInput
                accept={acceptedFileTypes}
                type="file"
                data-tag="editPhoto"
                onChange={onAddImage}
            />
        )

        return (
            <EditPhoto
                hidden={!isHovering}
                onClick={hasCustomImage && this.handleRemoveImage}
            >
                {hasCustomImage ? (
                    <Icon color="white" size="xxs" type="cancel" />
                ) : (
                    hiddenInput
                )}
                <Text
                    align="center"
                    color="white"
                    size={0}
                    uppercase
                    weight="bold"
                >
                    {hasCustomImage ? 'Remove' : 'Replace Photo'}
                </Text>
            </EditPhoto>
        )
    }

    renderAvatarSection = () => {
        const { isEditing, src, url } = this.props

        const avatarInner = (
            <a href={url} data-tag="editPhoto">
                {isEditing && this.renderEditPhoto()}
                <Avatar border size={{ xs: 'md', sm: 'lg' }} src={src} />
            </a>
        )

        const avatarOutlineProps = {
            b: { xs: false, sm: true },
            borderStrokeWidth: '5px',
            cornerRadius: 'circle',
            position: 'relative',
            display: 'inline-block',
        }

        return (
            <Flexy justifyContent="center">
                <AvatarOutline {...avatarOutlineProps} fade={0.95} p={1} mr={2}>
                    <AvatarOutline {...avatarOutlineProps} fade={0.75} p={2}>
                        {avatarInner}
                    </AvatarOutline>
                </AvatarOutline>
            </Flexy>
        )
    }

    renderButtonSection = () => {
        const { url } = this.props

        return (
            <Flexy display="inline-block" justifyContent="center">
                <ButtonWrapper className="mv-md" disabled={!url}>
                    <Button
                        color="tertiary-inverse"
                        disabled={!url}
                        href={url}
                        onClick={this.handleClickWatch}
                        size={{ xs: 'sm', sm: 'mdsm' }}
                        target="_blank"
                    >
                        Watch the livestream
                    </Button>
                </ButtonWrapper>
                <PoweredBy>
                    <Text align="center" color="white" el="div" size={0}>
                        <Icon color="white" type="crowdcast" />
                        &nbsp; Powered by Crowdcast
                    </Text>
                </PoweredBy>
            </Flexy>
        )
    }

    render() {
        const { isGridOptionSelected, setIsHovering, src } = this.props
        const content = (
            <Block
                fluidHeight
                fluidWidth
                mt={isGridOptionSelected ? 15 : 0}
                position={isGridOptionSelected ? 'static' : 'absolute'}
                pl={isGridOptionSelected ? 0 : 2}
                pt={2}
            >
                <Flexy fluidHeight>
                    <Col
                        display={{
                            xs: `${isGridOptionSelected ? 'none' : 'block'}`,
                        }}
                        xs={4}
                        sm={5}
                        alignSelf="center"
                    >
                        <PreviewContent>
                            {this.renderAvatarSection()}
                        </PreviewContent>
                    </Col>
                    <Col
                        xs={isGridOptionSelected ? 12 : 7}
                        sm={isGridOptionSelected ? 12 : 6}
                        alignSelf="center"
                    >
                        <PreviewContent>
                            {this.renderButtonSection()}
                        </PreviewContent>
                    </Col>
                </Flexy>
            </Block>
        )

        return (
            <Block
                backgroundColor="gray1"
                noOverflow
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                position="relative"
            >
                {content}
                <BackgroundImage src={src} />
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/CrowdcastLivestreamPreview/index.jsx