import t from 'prop-types'
import React from 'react'
import { PATRON_CARD_EVENTS, logPatronCardEvent } from 'analytics'
import styled from 'styled-components'

import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import Flexy from 'components/Layout/Flexy'
import Block from 'components/Layout/Block'
import Text from 'components/Text'

const Header = ({
    name,
    avatar,
    source,
    isPatron,
    joinDate,
    warning,
    patronId,
}) => {
    return (
        <Block>
            {warning &&
                <Warning>
                    <Icon type="info" size="xs" color="white" />
                    <Block ml>
                        <Text size={0} color="white">
                            {warning}
                        </Text>
                    </Block>
                </Warning>}
            <a
                href={`/user?u=${patronId}`}
                onClick={() =>
                    logPatronCardEvent(PATRON_CARD_EVENTS.GO_TO_PROFILE, {
                        source,
                    })}
            >
                <Block pt={2} verticalAlign="middle">
                    <Flexy
                        direction="row"
                        fluidWidth
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Avatar src={avatar} size="xs" />
                        <Block pl={2} pr={2}>
                            <Text size={1} weight="bold">
                                {name}
                            </Text>
                            <Text el="div" size={-1} uppercase weight="bold">
                                {isPatron
                                    ? `Your patron since ${joinDate}`
                                    : `Joined Patreon ${joinDate}`}
                            </Text>
                        </Block>
                    </Flexy>
                </Block>
            </a>
        </Block>
    )
}
Header.propTypes = {
    name: t.string.isRequired,
    source: t.string.isRequired,
    avatar: t.string.isRequired,
    isPatron: t.bool,
    joinDate: t.string.isRequired,
    warning: t.oneOfType([t.string, t.bool]),
    patronId: t.string.isRequired,
}

const Warning = styled.div`
    ${props => `
  background-color: ${props.theme.colors.brick};
  margin-left: ${props.theme.units.getValue(-3)};
  margin-right: ${props.theme.units.getValue(-3)};
  padding: ${props.theme.units.getValue(1)} ${props.theme.units.getValue(2)};
  text-align: center;
  display: flex;
  justify-content: center;
`};
`

export default Header



// WEBPACK FOOTER //
// ./app/components/PatronPopover/components/Header/index.jsx