import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import times from 'lodash/times'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'

export default class BlurredPoll extends Component {
    static propTypes = {
        numberOfRows: t.number,
    }

    static defaultProps = {
        numberOfRows: 3,
    }

    renderFakeChoice() {
        return (
            <Block mv={1}>
                <Flexy alignItems="stretch">
                    <Block p={1} backgroundColor="gray2">
                        <Icon type="checkmark" size="xs" color="white" />
                    </Block>
                    <Flexy grow={2}>
                        <Block
                            backgroundColor="gray2"
                            ml={1}
                            fluidHeight
                            fluidWidth
                        />
                    </Flexy>
                </Flexy>
            </Block>
        )
    }

    render() {
        return (
            <StyledFakeChoice>
                <Flexy
                    alignItems="center"
                    direction="row"
                    fluidHeight
                    fluidWidth
                    justifyContent="space-around"
                >
                    <Block ph={2} fluidWidth>
                        {times(this.props.numberOfRows, this.renderFakeChoice)}
                    </Block>
                </Flexy>
            </StyledFakeChoice>
        )
    }
}

const StyledFakeChoice = styled.div`
    ${props => `
    background-color: ${props.theme.colors.gray4};
    opacity: 0.11;
    height: 100%;
`};
`



// WEBPACK FOOTER //
// ./app/components/BlurredPoll/index.jsx