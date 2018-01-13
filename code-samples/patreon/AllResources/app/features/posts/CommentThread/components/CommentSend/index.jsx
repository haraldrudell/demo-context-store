import t from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import access from 'safe-access'
import { withState } from 'recompose'
import { getTextareaStyle } from 'textarea-autoresize'

import keyCodes from 'constants/key-codes'
import {
    User as userShape,
    Comment as commentShape,
} from 'utilities/prop-types'
import { isClient } from 'shared/environment'
import withRedirectBackHere from 'utilities/with-redirect-back-here'

import Avatar from 'components/Avatar'
import Block from 'components/Layout/Block'
import TextButton from 'components/TextButton'

import {
    AvatarWrapper,
    Cancel,
    CancelText,
    CommentField,
    FieldContainer,
    LoginField,
    SendRow,
} from './styled-components'

const resizeOptions = {
    minRows: 1,
    // maxRows: 5, this option doesn't work properly so max-height is used in styles.less instead
    canShrink: true,
}

@withState('isFocused', 'setIsFocused', false)
export default class CommentSend extends Component {
    static propTypes = {
        noHandling: t.bool,
        currentUser: t.oneOfType([t.object, userShape]), // eslint-disable-line
        parentCommentId: t.string,
        editingComment: commentShape,
        onPostComment: t.func,
        onEditComment: t.func,
        onCancelClick: t.func,
        isFocused: t.bool,
        setIsFocused: t.func,
    }

    static defaultProps = {
        onPostComment: (commentBody, parentCommentId) => {},
        onEditComment: (commentBody, commentId) => {},
        onCancelClick: () => {},
    }

    state = {
        content: access(this.props, 'editingComment.body') || '',
        inputStyle: null,
    }

    handleInputChange = e => {
        this.updateTextareaStyle()
        this.setState({ content: e.target.value })
    }

    handleInputKeyDown = e => {
        switch (e.keyCode) {
            case keyCodes.ENTER:
                if (e.shiftKey) {
                    // treat shift+enter as enter for textarea (newline)
                    e.shiftKey = false
                } else {
                    // treat enter as submit
                    e.preventDefault()
                    this.handlePostComment()
                }
                break
            case keyCodes.ESC:
                if (this.isCancelable()) {
                    e.preventDefault()
                    this.handleCancelClick()
                }
                break
        }
    }

    isCancelable = () => {
        return !!this.props.parentCommentId || !!this.props.editingComment
    }

    handlePostComment = () => {
        if (this.state.content.length === 0) return
        const commentBody = this.state.content.replace('<3', '&lt;3')
        this.setState({ content: '' })
        this.updateTextareaStyle()
        if (!!this.props.editingComment) {
            this.props.onEditComment(commentBody, this.props.editingComment.id)
        } else {
            this.props.onPostComment(commentBody, this.props.parentCommentId)
        }
    }

    handleCancelClick = () => {
        this.setState({ content: '' })
        this.props.onCancelClick()
    }

    focusInput = () => {
        if (this.input) ReactDOM.findDOMNode(this.input).focus()
    }

    updateTextareaStyle = () => {
        const input = ReactDOM.findDOMNode(this.input)
        if (input) {
            this.setState({
                inputStyle: getTextareaStyle(input, resizeOptions),
            })
        }
    }

    componentDidMount() {
        if (this.props.parentCommentId || this.props.editingComment) {
            this.focusInput()
        }
        if (isClient()) {
            this.updateTextareaStyle()
        }
    }

    render() {
        const { isFocused } = this.props
        const placeholder = !!this.props.editingComment
            ? 'Edit your comment...'
            : !!this.props.parentCommentId
              ? 'Write a reply ...'
              : 'Write a comment ...'

        const commentField = (
            <CommentField
                size="md"
                ref={ref => (this.input = ref)}
                style={this.state.inputStyle}
                type="text"
                rows="1"
                placeholder={placeholder}
                value={this.state.content}
                onChange={this.handleInputChange}
                onFocus={() => this.props.setIsFocused(true)}
                onBlur={() => this.props.setIsFocused(false)}
                onKeyDown={this.handleInputKeyDown}
            />
        )
        const logInField = (
            <LoginField>
                <TextButton href={withRedirectBackHere('/login')}>
                    Log in
                </TextButton>
                {`  to  ${!!this.props.parentCommentId
                    ? 'reply ...'
                    : 'comment ...'}`}
            </LoginField>
        )
        const cancel = (
            <Cancel>
                Press Esc to{' '}
                <CancelText onClick={this.handleCancelClick}>cancel</CancelText>
            </Cancel>
        )
        return (
            <Block flexDirection="column" mt={3}>
                <SendRow>
                    <AvatarWrapper>
                        <Block mr={2}>
                            <Avatar
                                src={access(this.props, 'currentUser.imageUrl')}
                                size="xs"
                            />
                        </Block>
                    </AvatarWrapper>
                    <FieldContainer focused={isFocused}>
                        {!!access(this.props, 'currentUser.id') &&
                        !this.props.noHandling
                            ? commentField
                            : logInField}
                    </FieldContainer>
                </SendRow>
                {!!access(this.props, 'currentUser.id') && this.isCancelable()
                    ? cancel
                    : null}
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/posts/CommentThread/components/CommentSend/index.jsx