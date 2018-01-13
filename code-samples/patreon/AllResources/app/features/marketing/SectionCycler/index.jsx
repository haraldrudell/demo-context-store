import t from 'prop-types'
import React, { Component } from 'react'
import map from 'lodash/map'
import { withState } from 'recompose'

import Block from 'components/Layout/Block'
import Col from 'components/Layout/Col'
import Row from 'components/Layout/Row'
import Text from 'components/Text'

import Section from 'features/marketing/Section'

import { isClient } from 'shared/environment'
import { Label, MobileLabel } from './styled-components'

const PAGE_INTERVAL = 4000

@withState('activeIndex', 'setActiveIndex', 0)
class SectionCycler extends Component {
    static propTypes = {
        productImages: t.arrayOf(
            t.shape({
                label: t.string,
                image: t.string,
            }),
        ).isRequired,

        //withState
        activeIndex: t.number,
        setActiveIndex: t.func,
    }

    constructor(props) {
        super(props)
        this.startAutoPlay()
    }

    componentWillUnmount() {
        this.stopAutoPlay()
    }

    startAutoPlay = () => {
        if (!isClient()) {
            return
        }
        const { productImages, setActiveIndex } = this.props
        this.stopAutoPlay()
        this.slideTimer = setInterval(() => {
            //Without using this.props here the correct activeIndex isn't given.
            setActiveIndex((this.props.activeIndex + 1) % productImages.length)
        }, PAGE_INTERVAL)
    }

    stopAutoPlay = () => {
        if (!isClient()) {
            return
        }
        clearInterval(this.slideTimer)
    }

    setIndex = index => {
        this.props.setActiveIndex(index)
        // resets the interval to 0 seconds
        this.stopAutoPlay()
    }

    renderDesktopLabels = () => {
        const { activeIndex, productImages } = this.props
        return map(productImages, (screenshot, index) => {
            const isActive = index === activeIndex
            return (
                <Label
                    active={isActive}
                    key={screenshot.label}
                    onClick={() => this.setIndex(index)}
                >
                    <Block pv={2}>
                        <Text
                            color={isActive ? 'highlightSecondary' : 'dark'}
                            size={1}
                            weight="bold"
                        >
                            {screenshot.label}
                        </Text>
                    </Block>
                </Label>
            )
        })
    }

    renderSelectedImage = () => {
        const { activeIndex, productImages } = this.props

        return <img width="100%" src={productImages[activeIndex].image} />
    }

    renderDesktopMainSection() {
        return (
            <Row>
                <Col md={5} alignSelf="center">
                    {this.renderDesktopLabels()}
                </Col>
                <Col md={7} alignSelf="center">
                    {this.renderSelectedImage()}
                </Col>
            </Row>
        )
    }

    renderMobileMainSection() {
        const { activeIndex, productImages } = this.props

        return (
            <Row>
                <Col xs={12}>
                    <MobileLabel>
                        <Text size={2} weight="bold">
                            {productImages[activeIndex].label}
                        </Text>
                    </MobileLabel>
                </Col>
                <Col xs={12}>{this.renderSelectedImage()}</Col>
            </Row>
        )
    }

    render() {
        return (
            <Section
                color="light"
                title="The tools you need to manage your business"
                maxWidth="md"
                wrapCol
            >
                <Block display={{ xs: 'none', md: 'block' }}>
                    {this.renderDesktopMainSection()}
                </Block>
                <Block display={{ xs: 'block', md: 'none' }}>
                    {this.renderMobileMainSection()}
                </Block>
            </Section>
        )
    }
}

export default SectionCycler



// WEBPACK FOOTER //
// ./app/features/marketing/SectionCycler/index.jsx