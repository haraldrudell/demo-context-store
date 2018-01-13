import PropTypes from 'prop-types'
import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import shallowCompare from 'utilities/shallow-compare'
import Icon from 'components/Icon'
import Block from 'components/Layout/Block'

import IframeWrapper from './components/IframeWrapper'

import { IconOverlayContainer, PlayButton } from './styled-components'

const variants = ['video', 'audio']

class MediaEmbed extends Component {
    shouldComponentUpdate = shallowCompare

    static propTypes = {
        variant: PropTypes.oneOf(variants),
        iframe: PropTypes.string.isRequired,
        thumbnailUrl: PropTypes.string,
        isGridOptionSelected: PropTypes.bool,
    }

    state = {
        /* iframe scripts are heavy and block rendering. show thumbnail until user interacts with them. -gb */
        loadIframe: false,
        customImgSize: null,
    }

    componentDidMount() {
        const { variant } = this.props
        if (variant === 'video' || variant === 'livestream_youtube') {
            window.addEventListener('resize', this.updateDimensions)
            this.updateDimensions()
        }
    }

    componentWillUnmount() {
        const { variant } = this.props
        if (variant === 'video' || variant === 'livestream_youtube') {
            window.removeEventListener('resize', this.updateDimensions)
        }
    }

    updateDimensions = debounce(function() {
        const measurementContainer = this.measurementContainer
        if (!measurementContainer) {
            return
        }
        this.setState({
            customImgSize: {
                width: this.measurementContainer.offsetWidth,
                height: this.measurementContainer.offsetWidth * 9 / 16,
            },
        })
    }, 100)

    onThumbnailClick = () => {
        this.setState({ loadIframe: true })
    }

    renderIframe = () => {
        return <IframeWrapper innerHTML={this.props.iframe} />
    }

    renderThumbnail = () => {
        const { variant, isGridOptionSelected } = this.props
        const isVideoOrYT =
            variant === 'video' || variant === 'livestream_youtube'
        const iconType = isVideoOrYT ? 'youtubePlay' : 'genericPlay'
        let figureStyles = {
            margin: 0,
        }
        let containersStyles = {
            minHeight: isGridOptionSelected ? '100px' : '200px',
        }
        let imgStyles = { minHeight: isGridOptionSelected ? '100px' : '200px' }
        if (isVideoOrYT && this.state.customImgSize) {
            imgStyles = {
                ...imgStyles,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
            }
            containersStyles = {
                ...containersStyles,
                ...this.state.customImgSize,
                position: 'relative',
                overflow: 'hidden',
            }
        }
        return (
            <figure
                ref={ref => (this.measurementContainer = ref)}
                title={`${variant} thumbnail`}
                style={figureStyles}
            >
                <Block
                    onClick={this.onThumbnailClick}
                    style={containersStyles}
                    position="relative"
                >
                    <img
                        src={this.props.thumbnailUrl}
                        style={imgStyles}
                        width="100%"
                        height="auto"
                        role="presentation"
                    />
                    <IconOverlayContainer className="middle-xs center-xs">
                        <PlayButton title="Start playback">
                            <Icon type={iconType} color="white" size="fluid" />
                        </PlayButton>
                    </IconOverlayContainer>
                </Block>
            </figure>
        )
    }

    render() {
        return this.state.loadIframe
            ? this.renderIframe()
            : this.renderThumbnail()
    }
}

export default MediaEmbed



// WEBPACK FOOTER //
// ./app/features/posts/MediaEmbed/index.jsx