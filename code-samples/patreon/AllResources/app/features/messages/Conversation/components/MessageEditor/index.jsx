import t from 'prop-types'
import React, { Component } from 'react'
import responsive from 'libs/responsive'
import withRenderAsClient from 'libs/with-render-as-client'

import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Block from 'components/Layout/Block'

import {
    MessageForm,
    MessageFormBody,
    MessageFormTextarea,
} from './styled-components'

@responsive
@withRenderAsClient
export default class MessageEditor extends Component {
    static propTypes = {
        userAvatar: t.string,
        onSend: t.func,
        isLoading: t.bool,
        isSent: t.bool,
        isError: t.bool,
        messagingDisallowed: t.bool,
        placeholderText: t.string,
        disabled: t.bool,
        responsive: t.shape({ lt: t.func }),
        renderAsClient: t.bool,
    }

    constructor(props) {
        super(props)
        this.state = { content: '' }
    }

    static defaultProps = {
        onSend: () => {},
        placeholderText: 'Write your message…',
    }

    handleSend = e => {
        e.preventDefault()
        this.props.onSend(this.state.content)
    }

    handleChange = e => {
        this.setState({ content: e.target.value })
    }

    handleKeyDown = e => {
        if (e.keyCode === 13 && e.metaKey) this.props.onSend(this.state.content)
    }

    renderButton = () => {
        const { content } = this.state
        const { messagingDisallowed, isSent, isError } = this.props

        let color = 'secondary'
        let type = 'submit'
        let disabled =
            content === '' || this.props.disabled || messagingDisallowed
        let text = 'Send'

        if (isSent) {
            color = 'success'
            text = 'Sent!'
            disabled = true
        } else if (isError) {
            color = 'error'
            text = 'Error'
            disabled = true
        }

        return (
            <Button
                color={color}
                type={type}
                size="sm"
                disabled={disabled}
                isLoading={this.props.isLoading}
            >
                {text}
            </Button>
        )
    }

    render() {
        // Auto-focus always, unless we know we're on mobile/tablet
        const isMobileOrTablet =
            this.props.renderAsClient && this.props.responsive.lt('md')
        const autoFocus = !isMobileOrTablet

        return (
            <MessageForm onSubmit={this.handleSend}>
                {this.props.userAvatar &&
                    <Block mr={2} display={{ xs: 'none', md: 'block' }}>
                        <Avatar src={this.props.userAvatar} size="sm" />
                    </Block>}
                <MessageFormBody>
                    <MessageFormTextarea
                        type="text"
                        rows="4"
                        placeholder={this.props.placeholderText}
                        value={this.state.content}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        autoFocus={autoFocus}
                        disabled={this.props.disabled || this.props.isLoading}
                    />
                    <Block mt={1} position="relative">
                        {this.props.messagingDisallowed
                            ? <span>
                                  Sorry, but you're no longer allowed to send a
                                  message to this person.
                              </span>
                            : this.renderButton()}
                    </Block>
                </MessageFormBody>
            </MessageForm>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/messages/Conversation/components/MessageEditor/index.jsx