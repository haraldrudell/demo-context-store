import t from 'prop-types'
import React, { Component } from 'react'
import responsive from 'libs/responsive'
import withRenderAsClient from 'libs/with-render-as-client'

import Block from 'components/Layout/Block'
import Input from 'components/Form/Input'
import Text from 'components/Text'
import UserList from 'components/UserList'

@responsive
@withRenderAsClient
export default class MessageSelectParticipants extends Component {
    static propTypes = {
        onChange: t.func,
        onParticipantsSelected: t.func,
        query: t.string,
        suggestedLabel: t.string,
        suggestedParticipants: t.array,
        responsive: t.shape({ lt: t.func }),
        renderAsClient: t.bool,
    }

    render() {
        const {
            suggestedParticipants,
            suggestedLabel,
            onChange,
            onParticipantsSelected,
            query,
            renderAsClient,
        } = this.props

        // Auto-focus always, unless we know we're on mobile/tablet
        const isMobileOrTablet =
            renderAsClient && this.props.responsive.lt('md')
        const autoFocus = !isMobileOrTablet

        return (
            <div className="pb-lg">
                <Block mb={2}>
                    <Input
                        prefix="To"
                        type="text"
                        onChange={e => onChange(e.target.value)}
                        value={query}
                        autoFocus={autoFocus}
                        fluid
                    />
                </Block>
                <Text el="h4">
                    {suggestedLabel}
                </Text>
                <UserList
                    items={suggestedParticipants}
                    onClick={user => onParticipantsSelected([user.id])}
                    keyboardNav
                />
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/MessageModal/MessageSelectParticipants/index.jsx