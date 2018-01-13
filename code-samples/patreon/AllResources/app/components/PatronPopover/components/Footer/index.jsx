import t from 'prop-types'
import React from 'react'

import Button from 'components/Button'
import Flexy from 'components/Layout/Flexy'
import Block from 'components/Layout/Block'
import ButtonWithIcon from 'components/ButtonWithIcon'
import MoreWithBlock from './components/MoreWithBlock'

const Footer = ({
    canMessage,
    patronId,
    openBlockUserModal,
    openMessageUserModal,
    isUserBlocked,
    isBlockUserModalOpen,
    morePopoverOpen,
    setMorePopoverOpen,
}) => {
    return (
        <Block pt={2} ph={2}>
            <Flexy direction="row" fluidWidth justifyContent="space-between">
                {canMessage &&
                    <ButtonWithIcon
                        color="primary"
                        size="sm"
                        icon="email"
                        onClick={openMessageUserModal}
                    >
                        Message
                    </ButtonWithIcon>}
                {!canMessage &&
                    <Button
                        color="primary"
                        href={`/user?u=${patronId}`}
                        size="sm"
                    >
                        View profile
                    </Button>}
                <MoreWithBlock
                    patronId={patronId}
                    morePopoverOpen={morePopoverOpen}
                    setMorePopoverOpen={setMorePopoverOpen}
                    isUserBlocked={isUserBlocked}
                    isBlockUserModalOpen={isBlockUserModalOpen}
                    openBlockUserModal={openBlockUserModal}
                />
            </Flexy>
        </Block>
    )
}

Footer.propTypes = {
    patronId: t.string.isRequired,
    canMessage: t.bool,
    isUserBlocked: t.bool,
    isBlockUserModalOpen: t.bool,
    openBlockUserModal: t.func.isRequired,
    openMessageUserModal: t.func.isRequired,
    morePopoverOpen: t.bool,
    setMorePopoverOpen: t.func,
}

export default Footer



// WEBPACK FOOTER //
// ./app/components/PatronPopover/components/Footer/index.jsx