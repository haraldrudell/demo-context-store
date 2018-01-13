import t from 'prop-types'
import React, { Component } from 'react'
import styled, { css } from 'styled-components'

class Image extends Component {
    // if we add more image effects make an imageEffects prop obj
    static propTypes = {
        children: t.node,
        backgroundSize: t.string,
        blur: t.bool,
        cropHeightRatio: t.number,
        height: t.string,
        minHeight: t.number,
        onClickEvent: t.func,
        retinaAvailable: t.bool,
        src: t.string,
        darken: t.bool,
    }

    static defaultProps = {
        backgroundSize: 'cover',
        cropHeightRatio: 1,
        minHeight: 0,
    }

    constructor() {
        super()
        this.state = {
            cssFilterEnabled: false,
        }
    }

    componentDidMount() {
        this.setStateOnMount()
    }

    setStateOnMount = () => {
        // Our current linter doesn't allow setState in componentDidMount
        // This is a simple workaround till the next refactor.
        const style = document.body.style
        const filterEnabled = 'filter' in style
        this.setState({
            cssFilterEnabled: filterEnabled,
        })
    }

    render() {
        const {
            backgroundSize,
            blur,
            children,
            cropHeightRatio,
            height,
            minHeight,
            onClickEvent,
            retinaAvailable,
            src,
            darken,
        } = this.props

        const { cssFilterEnabled } = this.state

        const backgroundImageSrcSet = {
            1: `${darken
                ? `linear-gradient(
                      rgba(0, 0, 0, 0.2),
                      rgba(0, 0, 0, 0.2)
                  ), `
                : ''}url(${src});`,
        }
        if (cssFilterEnabled && retinaAvailable) {
            const retinaSrc = src.replace(/(\.[^\.]+)$/i, '@2x$1')
            backgroundImageSrcSet[2] = `url(${retinaSrc})`
        }
        /*
            http://www.goldenapplewebdesign.com/responsive-aspect-ratios-with-pure-css/
            Padding, including vertical padding, is always defined as a % of an element's width.
            https://www.w3.org/TR/CSS21/box.html#padding-properties
            This can be used to create images with fixed aspect ratios
            by setting the element's proper height to 0,
            and using a padding-bottom of the desired aspect ratio.
            The background-image will then fill the padding height.
        */
        const bottomPadding = height ? height : `${100 / cropHeightRatio}%;`

        return (
            <ImageContainer
                backgroundSize={backgroundSize}
                blur={blur}
                backgroundImageSrcSet={backgroundImageSrcSet}
                minHeight={minHeight}
                bottomPadding={bottomPadding}
                onClick={onClickEvent}
            >
                {children}
            </ImageContainer>
        )
    }
}

const _blur = props =>
    props.blur &&
    css`
        blur: 30px;
        overflow: hidden;
    `
const _clickable = props =>
    props.onClick &&
    css`
        cursor: pointer;
    `
const ImageContainer = styled.div`
    width: 100%;
    ${props =>
        props.theme.responsive.cssPropsForResolutionValues(
            props.backgroundImageSrcSet,
            'background-image',
        )};
    background-size: ${props => props.backgroundSize};
    background-repeat: no-repeat;
    background-position: center;
    min-height: ${props => `${props.minHeight}px`};
    padding-bottom: ${props => props.bottomPadding};
    ${_blur} ${_clickable};
`

export default Image



// WEBPACK FOOTER //
// ./app/components/Image/index.jsx