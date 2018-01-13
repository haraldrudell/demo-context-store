import t from 'prop-types'
import React, { Component } from 'react'

import Image from 'components/Image'

import Lightbox from './Lightbox'

export default class LightboxImageWrapper extends Component {
    static propTypes = {
        currentUserCanView: t.bool,
        handleClick: t.func,
        imageSrc: t.string.isRequired,
        originalImageSrc: t.string,
        imgStyle: t.object,
        height: t.oneOfType([t.number, t.string]),
        url: t.string,
        darken: t.bool,
    }

    constructor(props) {
        super(props)
        this.state = {
            isLightboxOpen: false,
        }
    }

    onOpenLightbox = () => {
        this.setState({ isLightboxOpen: true })
    }

    onCloseLightbox = () => {
        this.setState({ isLightboxOpen: false })
    }

    render() {
        const {
            currentUserCanView,
            handleClick,
            imageSrc,
            originalImageSrc,
            imgStyle,
            url,
            height,
            darken,
        } = this.props

        if (!currentUserCanView) {
            const onImageClick = () => {
                if (handleClick) {
                    handleClick()
                }
            }

            return (
                <Image
                    cropHeightRatio={3}
                    onClickEvent={onImageClick}
                    src={imageSrc}
                    height={height}
                    width="100%"
                    darken={darken}
                />
            )
        }

        if (originalImageSrc) {
            return (
                <div>
                    <img
                        src={imageSrc}
                        style={{ cursor: 'zoom-in', ...imgStyle }}
                        width="100%"
                        height="auto"
                        onClick={() => this.onOpenLightbox()}
                    />
                    <Lightbox
                        originalImageSrc={originalImageSrc}
                        onClose={this.onCloseLightbox}
                        isOpen={this.state.isLightboxOpen}
                    />
                </div>
            )
        }

        return (
            <a href={url}>
                <img
                    src={imageSrc}
                    style={imgStyle}
                    width="100%"
                    height="auto"
                />
            </a>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/LightboxImageWrapper/index.jsx