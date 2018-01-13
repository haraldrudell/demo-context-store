import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Measure from 'react-measure'
import styled, { css } from 'styled-components'
import { withState } from 'recompose'

import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Flexy from 'components/Layout/Flexy'

@withState('width', 'setWidth', 0)
@withState('activeSlide', 'setActiveSlide', 0)
class SlidingCarousel extends Component {
    static propTypes = {
        activeSlide: PropTypes.number, // from state, index
        children: PropTypes.node,
        setActiveSlide: PropTypes.func,
        setWidth: PropTypes.func,
        slideScaleFactor: PropTypes.number,
        slideWidth: PropTypes.number, // units
        transitionMillis: PropTypes.number,
        width: PropTypes.number, // from state, in pixels
    }

    static defaultProps = {
        slideScaleFactor: 0.8,
        transitionMillis: 1200,
    }

    moveTo = index => {
        this.props.setActiveSlide(index)
    }

    movePrevious = () => {
        const { activeSlide, setActiveSlide } = this.props

        if (activeSlide === 0) return
        setActiveSlide(activeSlide - 1)
    }

    moveNext = () => {
        const { activeSlide, children, setActiveSlide } = this.props

        if (activeSlide === React.Children.count(children) - 1) return
        setActiveSlide(activeSlide + 1)
    }

    renderSlide = (slide, i) => {
        const { activeSlide, slideScaleFactor, slideWidth } = this.props

        return (
            <Slide
                active={i === activeSlide}
                key={`slide-${i}`}
                onClick={() => {
                    this.moveTo(i)
                }}
                scaleFactor={slideScaleFactor}
                width={slideWidth}
            >
                {slide}
            </Slide>
        )
    }

    renderControls = () => {
        return (
            <Controls width={this.props.slideWidth}>
                <Block mr={2}>
                    <Button
                        color="white"
                        size="sm"
                        data-tag="carousel-left"
                        onClick={this.movePrevious}
                    >
                        <Icon type="arrowLeft" />
                    </Button>
                </Block>
                <Button
                    color="white"
                    size="sm"
                    onClick={this.moveNext}
                    data-tag="carousel-right"
                >
                    <Icon type="arrowRight" />
                </Button>
            </Controls>
        )
    }

    render() {
        const {
            activeSlide,
            children,
            setWidth,
            slideWidth,
            transitionMillis,
            width,
        } = this.props

        const offsetX = -1 * activeSlide * width // px

        return (
            <Flexy
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Block display={{ xs: 'block', lg: 'none' }}>
                    {this.renderControls()}
                </Block>
                <Measure
                    bounds
                    onResize={contentRect => setWidth(contentRect.bounds.width)}
                >
                    {({ measureRef, contentRect }) => (
                        <Frame
                            offsetX={offsetX}
                            transitionMillis={transitionMillis}
                            width={slideWidth}
                            innerRef={measureRef}
                        >
                            {React.Children.map(children, this.renderSlide)}
                        </Frame>
                    )}
                </Measure>
            </Flexy>
        )
    }
}

const widthStyles = css`
    max-width: 100%;
    width: ${props => props.theme.units.getValue(props.width)};
`

const Frame = styled.div`
    align-items: center;
    display: flex;
    transform: translateX(${props => props.offsetX}px);
    transition: ${props => `
        all
        ${props.transitionMillis}ms
        ${props.theme.transitions.easing.default}
    `};
    ${widthStyles};
`

export const Slide = styled.div`
    flex-shrink: 0;
    opacity: ${props => (props.active ? 1 : 0.5)};
    ${props => (props.active ? '' : '> * { pointer-events: none; }')}
    transform: scale(${props => (props.active ? 1 : props.scaleFactor)});
    transition: ${props => props.theme.transitions.slow};
    ${widthStyles}

    ${props =>
        props.active
            ? ''
            : `
            &:hover {
                cursor: pointer;
                opacity: 0.666;
                transform: scale(${(1 + props.scaleFactor * 3) / 4});
            }
        `}
`

const Controls = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: ${props => props.theme.units.getValue(2)};
    ${widthStyles};
`

export default SlidingCarousel



// WEBPACK FOOTER //
// ./app/components/SlidingCarousel/index.jsx