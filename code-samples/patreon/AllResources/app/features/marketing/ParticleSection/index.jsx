import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Measure from 'react-measure'

import helpers from 'styles/themes/helpers'

import Block from 'components/Layout/Block'
import ParticleScene from 'components/Effects/ParticleScene'

import Title from 'features/marketing/Section/components/Title'

import { FlexyContainer } from './styled-components'

const { colors } = helpers

class ParticleSection extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        /**
         * Title text to appear at the top of the section
         */
        title: PropTypes.string,
    }

    render() {
        const { children, title } = this.props
        return (
            <Measure bounds>
                {({ measureRef, contentRect }) => {
                    return (
                        <div ref={measureRef}>
                            <FlexyContainer
                                direction="column"
                                alignItems="center"
                            >
                                {contentRect.bounds.width > 0 && (
                                    <ParticleScene
                                        colors={colors.primaryColors}
                                        viewportWidth={contentRect.bounds.width}
                                        viewportHeight={300}
                                    />
                                )}
                                <Block mt={10} position="relative">
                                    <Title text={title} sectionColor="dark" />
                                </Block>
                                {children}
                            </FlexyContainer>
                        </div>
                    )
                }}
            </Measure>
        )
    }
}

export default ParticleSection



// WEBPACK FOOTER //
// ./app/features/marketing/ParticleSection/index.jsx