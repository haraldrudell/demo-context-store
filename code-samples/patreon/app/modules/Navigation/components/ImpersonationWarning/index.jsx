import React, { Component } from 'react'
import styled from 'styled-components'
import nion from 'nion'

import Block from 'components/Layout/Block'
import Text from 'components/Text'
import getDataOrNot from 'utilities/get-data-or-not'

@nion('currentUser')
class ImpersonationWarning extends Component {
    render() {
        const { currentUser } = this.props.nion

        return (
            <WarningContainer>
                <span>
                    ☠☠
                    <Block display="inline" mh={1}>
                        <Text color="white" weight="bold">
                            Impersonating {getDataOrNot(currentUser).fullName}{' '}
                            with write access enabled
                        </Text>
                    </Block>
                    ☠☠
                </span>
            </WarningContainer>
        )
    }
}

const WarningContainer = styled.div`
    background-color: ${props => props.theme.colors.error};
    height: 36px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    position: absolute;
    top: ${props => props.theme.components.navigation.navbarOffsetHeight};
`

export default ImpersonationWarning



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/ImpersonationWarning/index.jsx