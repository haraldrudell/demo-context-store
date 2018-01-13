import PropTypes from 'prop-types'
import React, { Component } from 'react'
import map from 'lodash/map'

import Block from 'components/Layout/Block'
import Col from 'components/Layout/Col'
import Text from 'components/Text'

import Section from 'features/marketing/Section'

//@TODO move this to a better location
import List from 'pages/creators_v2/components/List'

export default class BulletsSection extends Component {
    static propTypes = {
        bgColor: PropTypes.string,
        bulletsArr: PropTypes.array,
        colorsArr: PropTypes.array,
        title: PropTypes.string,
        titleFirst: PropTypes.bool,
        titleTop: PropTypes.bool,
    }

    render() {
        const {
            bgColor,
            title,
            colorsArr,
            bulletsArr,
            titleFirst,
            titleTop,
        } = this.props

        const textColor = bgColor === 'dark' ? 'light' : 'dark'

        const renderBullet = bullet => {
            return (
                <Text color={textColor} size={2} key={bullet}>
                    {bullet}
                </Text>
            )
        }

        const renderBullets = () => {
            return (
                <List colors={colorsArr}>{map(bulletsArr, renderBullet)}</List>
            )
        }
        const renderTitle = () => {
            return (
                <Block
                    pl={{ xs: 0, md: titleFirst ? 0 : 2 }}
                    pr={{ xs: 0, md: titleFirst ? 2 : 0 }}
                    pb={{ xs: 2, md: 0 }}
                >
                    <Text
                        align={titleTop ? 'center' : 'left'}
                        color={textColor}
                        el="h2"
                        noMargin
                        size={3}
                        uppercase
                        weight="bold"
                    >
                        {title}
                    </Text>
                </Block>
            )
        }
        const order = titleFirst ? undefined : { xs: 'unset', md: 1 }
        return (
            <Block>
                {titleTop ? (
                    <Section color={bgColor} maxWidth="md" wrapCol>
                        <Block mb={4}>{titleTop && renderTitle()}</Block>
                        <Col offset={{ md: 4 }}>{renderBullets()}</Col>
                    </Section>
                ) : (
                    <Section color={bgColor} maxWidth="md">
                        <Col xs={12} md={6} order={order}>
                            {renderTitle()}
                        </Col>
                        <Col xs={12} md={6}>
                            {titleTop && renderTitle()}
                            {renderBullets()}
                        </Col>
                    </Section>
                )}
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/pages/index_america/components/BulletsSection/index.jsx