import t from 'prop-types'
import React, { Component } from 'react'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import TextButton from 'components/TextButton'

import withRedirect from 'utilities/with-redirect'

export default class AttachmentsElement extends Component {
    static propTypes = {
        attachments: t.arrayOf(
            t.shape({
                name: t.string.isRequired,
                url: t.string.isRequired,
            }),
        ),
        noHandling: t.bool,
    }

    renderAttachmentElements = (attachments, noHandling) => {
        return attachments.map(({ name, url }) => (
            <Block key={name} mr={3}>
                <TextButton
                    href={noHandling ? withRedirect('/login', url) : url}
                    size={0}
                >
                    {name}
                </TextButton>
            </Block>
        ))
    }

    render() {
        const { attachments, noHandling } = this.props

        if (!attachments || !attachments.length) return null

        return (
            <Block m={2} ml={0}>
                <Flexy>
                    <Block mr={1}>
                        <Icon type="paperclip" size="xxs" color="gray4" />
                    </Block>
                    <Flexy wrap="wrap">
                        {this.renderAttachmentElements(attachments, noHandling)}
                    </Flexy>
                </Flexy>
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/posts/Post/components/AttachmentsElement/index.jsx