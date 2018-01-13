import t from 'prop-types'
import React, { Component } from 'react'

import ButtonWithIcon from 'components/ButtonWithIcon'
import Popover from 'components/Popover'
import TextButton from 'components/TextButton'
import Text from 'components/Text'
import Icon from 'components/Icon'
import Block from 'components/Layout/Block'

export default class MoreWithBlock extends Component {
    static displayName = 'MoreWithBlock'

    static propTypes = {
        isUserBlocked: t.bool,
        isBlockUserModalOpen: t.bool,
        morePopoverOpen: t.bool,
        setMorePopoverOpen: t.func,
        openBlockUserModal: t.func,
    }

    renderBlockUserButton = () => {
        const onClick = this.props.openBlockUserModal
        const label = this.props.isUserBlocked ? 'Unblock User' : 'Block User'
        return (
            <TextButton onClick={onClick} icon="block" fluid size={0}>
                <Block ph={2} pv={1}>
                    <Text size={0}>
                        <Icon
                            type="block"
                            size="xxs"
                            color="gray2"
                            label={label}
                        />
                    </Text>
                </Block>
            </TextButton>
        )
    }

    handleClickOutsidePopover = () => {
        if (!this.props.morePopoverOpen) {
            return
        }

        if (!this.props.isBlockUserModalOpen) {
            this.props.setMorePopoverOpen(false)
        }
    }

    render() {
        const { morePopoverOpen, setMorePopoverOpen } = this.props

        return (
            <Popover
                body={this.renderBlockUserButton()}
                preferPlace="below"
                isOpen={morePopoverOpen}
                onOuterAction={() => this.handleClickOutsidePopover()}
            >
                <ButtonWithIcon
                    color="tertiary"
                    size="sm"
                    onClick={() => setMorePopoverOpen(true)}
                    icon="ellipsis"
                >
                    More
                </ButtonWithIcon>
            </Popover>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PatronPopover/components/Footer/components/MoreWithBlock/index.jsx