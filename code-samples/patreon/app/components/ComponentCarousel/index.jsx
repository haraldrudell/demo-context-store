import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import Block from 'components/Layout/Block'

const arrow = require('./svg/arrow.svg')

/* eslint-disable react/no-array-index-key */

class ComponentCarousel extends Component {
    // @TODO Add pause autoplay on hover functionality

    slideTimer = undefined

    static propTypes = {
        autoplay: PropTypes.bool,
        autoplayInterval: PropTypes.number,
        controlsPosition: PropTypes.oneOf(['inside', 'outside']),
        dotColor: PropTypes.oneOf(['light', 'gray1']),
        // Navigation arrow element should be right-facing.
        navigationArrowElement: PropTypes.element,
        showNavigationArrows: PropTypes.bool,
        showNavigationDots: PropTypes.bool,
        slides: PropTypes.arrayOf(PropTypes.node).isRequired,
        transitionDuration: PropTypes.number,
    }

    static defaultProps = {
        autoplay: true,
        autoplayInterval: 5000,
        controlsPosition: 'inside',
        dotColor: 'light',
        transitionDuration: 500,
        showNavigationDots: true,
        showNavigationArrows: true,
    }

    state = {
        activeSlide: 0,
    }

    componentDidMount() {
        this.startAutoPlay()
    }

    componentWillUnmount() {
        this.stopAutoPlay()
    }

    startAutoPlay = () => {
        const { autoplay, slides, autoplayInterval } = this.props
        if (autoplay) {
            this.stopAutoPlay()
            this.slideTimer = setInterval(() => {
                this.setState({
                    activeSlide: (this.state.activeSlide + 1) % slides.length,
                })
            }, autoplayInterval)
        }
    }

    stopAutoPlay = () => {
        clearInterval(this.slideTimer)
    }

    onClickPrev = () => {
        const prevSlideIndex =
            this.state.activeSlide === 0
                ? this.props.slides.length - 1
                : this.state.activeSlide - 1
        this.setState({ activeSlide: prevSlideIndex })
        this.startAutoPlay()
    }

    onClickNext = () => {
        const nextSlideIndex =
            (this.state.activeSlide + 1) % this.props.slides.length
        this.setState({ activeSlide: nextSlideIndex })
        this.startAutoPlay()
    }

    goToSlideAtIndex = i => {
        this.setState({ activeSlide: i })
        this.startAutoPlay()
    }

    renderSlides = () => {
        const { activeSlide } = this.state

        return this.props.slides.map((slide, index) => {
            const slideStyle = {
                opacity: index === activeSlide ? 1 : 0,
                pointerEvents: index === activeSlide ? 'auto' : 'none',
                position: index === activeSlide ? 'relative' : 'absolute',
                width: '100%',
                top: 0,
                transition: `opacity ${this.props.transitionDuration /
                    1000}s ease-in-out`,
            }
            return (
                <div key={index} style={slideStyle}>
                    {this.props.slides[index]}
                </div>
            )
        })
    }

    renderDots = () => {
        const dots = this.props.slides.map((slide, i) => {
            return (
                <Block mh={0.5} display="inline-block" key={i}>
                    <Dot
                        key={i}
                        active={this.state.activeSlide === i}
                        onClick={() => this.goToSlideAtIndex(i)}
                        dotColor={this.props.dotColor}
                    >
                        •
                    </Dot>
                </Block>
            )
        })

        const controlsInside = this.props.controlsPosition === 'inside'

        return (
            <DotsContainer controlsInside={controlsInside}>
                {dots}
            </DotsContainer>
        )
    }

    renderNextPrevButtons = isNext => {
        const onClickIcon = isNext ? this.onClickNext : this.onClickPrev
        const arrowEl =
            this.props.navigationArrowElement ||
            <Block p={3}>
                <Arrow src={arrow} />
            </Block>
        const controlsInside = this.props.controlsPosition === 'inside'

        return (
            <ArrowContainer
                isNext={isNext}
                onClick={onClickIcon}
                controlsInside={controlsInside}
            >
                {arrowEl}
            </ArrowContainer>
        )
    }

    render() {
        const {
            controlsPosition,
            showNavigationArrows,
            showNavigationDots,
        } = this.props

        return (
            <CarouselContainer>
                <ContentRow controlsOutside={controlsPosition === 'outside'}>
                    {showNavigationArrows && this.renderNextPrevButtons(false)}
                    <SlidesContainer>
                        {this.renderSlides()}
                    </SlidesContainer>
                    {showNavigationArrows && this.renderNextPrevButtons(true)}
                </ContentRow>
                {showNavigationDots && this.renderDots()}
            </CarouselContainer>
        )
    }
}

const CarouselContainer = styled.div`
    position: relative;
    width: 100%;
`

const ContentRow = styled.div`
    ${props =>
        props.controlsOutside &&
        `
        align-items: stretch;
        display: flex;
    `};
`

const SlidesContainer = styled.div`
    flex-grow: 1;
    position: relative;
`

const ArrowContainer = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    ${props => (props.isNext ? '' : 'transform: scaleX(-1);')};

    ${props =>
        props.controlsInside &&
        `
        bottom: 0;
        height: 100%;
        position: absolute;
        z-index: ${props.theme.zIndex.Z_INDEX_2};
        ${props.isNext ? 'right: 0;' : 'left: 0;'}
    `};
`

const Arrow = styled.img`opacity: 0.7;`

const DotsContainer = styled.div`
    text-align: center;
    width: 100%;
    z-index: ${props => props.theme.zIndex.Z_INDEX_2};
    ${props =>
        props.controlsInside &&
        `
        bottom: 0;
        margin-bottom: ${props.theme.units.getValue(3)};
        position: absolute;
        z-index: ${props.theme.zIndex.Z_INDEX_2};
    `};
`

const Dot = styled.span`
    color: ${props => props.theme.colors[props.dotColor]};
    cursor: pointer;
    font-size: ${props => props.theme.text.getSize(5)};
    opacity: ${props => (props.active ? 1 : 0.33)};
    user-select: none;

    &:hover {
        opacity: 1;
    }
`

export default ComponentCarousel



// WEBPACK FOOTER //
// ./app/components/ComponentCarousel/index.jsx