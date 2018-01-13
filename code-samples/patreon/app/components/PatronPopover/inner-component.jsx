import t from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withState } from 'recompose'
import moment from 'moment'
import { PATRON_CARD_EVENTS, logPatronCardEvent } from 'analytics'

import MessageUserModal, * as messageUser from 'modules/MessageUserModal'
import BlockUserModal, * as blockUser from 'modules/BlockUserModal'

import LoadingSpinner from 'components/LoadingSpinner'
import Block from 'components/Layout/Block'
import Popover from 'components/Popover'
import Header from './components/Header'
import PatronInfo from './components/PatronInfo'
import Footer from './components/Footer'

const PROP_TYPES = {
    patronId: t.string.isRequired,
    name: t.string.isRequired,
    children: t.node,
    avatar: t.string.isRequired,
    isPatron: t.bool,
    isDeclined: t.bool,
    joinDate: t.string.isRequired,
    rewardTier: t.string,
    pledgeAmountCents: t.number,
    lifetimeSupportCents: t.number,
    isLoading: t.bool,
    isUserBlocked: t.bool,
    getData: t.func.isRequired,
    // Modal open/close status
    morePopoverOpen: t.bool,
    setMorePopoverOpen: t.func.isRequired,
    popoverOpen: t.bool,
    setPopoverOpen: t.func.isRequired,
    isBlockUserModalOpen: t.bool,
    openMessageUserModal: t.func.isRequired,
    closeMessageUserModal: t.func.isRequired,
    isMessageUserModalOpen: t.bool,
    openBlockUserModal: t.func.isRequired,
    closeBlockUserModal: t.func.isRequired,
}

@connect(
    (state, ownProps) => ({
        isBlockUserModalOpen: blockUser.getIsModalOpen(state),
        isMessageUserModalOpen: messageUser.getIsModalOpen(state),
        isUserBlocked: blockUser.getIsUserBlocked(ownProps.patronId)(state),
    }),
    {
        openBlockUserModal: blockUser.openModal,
        closeBlockUserModal: blockUser.closeModal,
        openMessageUserModal: messageUser.openModal,
        closeMessageUserModal: messageUser.closeModal,
    },
)
@withState('morePopoverOpen', 'setMorePopoverOpen', false)
@withState('popoverOpen', 'setPopoverOpen', false)
export default class PatronPopover extends Component {
    static propTypes = PROP_TYPES

    handleClickOutsidePopover = () => {
        const {
            popoverOpen,
            setPopoverOpen,
            setMorePopoverOpen,
            isBlockUserModalOpen,
            isMessageUserModalOpen,
        } = this.props

        if (!popoverOpen) {
            return
        }

        if (!(isBlockUserModalOpen || isMessageUserModalOpen)) {
            setPopoverOpen(false)
        }
        setMorePopoverOpen(false)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.popoverOpen && !this.props.popoverOpen) {
            this.props.getData()
        }
    }

    delayedClosePopover = () => {
        const { morePopoverOpen } = this.props
        this.cancelDelayedOpenPopover()
        this.closeTimeout = window.setTimeout(() => {
            if (!morePopoverOpen) {
                return this.handleClickOutsidePopover()
            }
        }, 450)
    }

    cancelDelayedClosePopover = () => {
        window.clearTimeout(this.closeTimeout)
    }

    cancelDelayedOpenPopover = () => {
        window.clearTimeout(this.openTimeout)
    }

    openPopover = () => {
        this.cancelDelayedOpenPopover()
        this.props.getData()
        this.openTimeout = window.setTimeout(() => {
            logPatronCardEvent(PATRON_CARD_EVENTS.HOVER, {
                source: this.source,
            })
            this.props.setPopoverOpen(true)
        }, 200)
    }

    renderMessageModal = () => {
        const { patronId, avatar, name } = this.props

        return (
            <MessageUserModal
                onRequestClose={this.props.closeMessageUserModal}
                userToMessage={{
                    id: patronId,
                    imageUrl: avatar,
                    fullName: name,
                }}
            />
        )
    }

    renderBlockModal = () => {
        const { patronId, avatar, name } = this.props

        const onRequestClose = () => {
            this.props.isBlockUserModalOpen && this.props.closeBlockUserModal()
        }
        return (
            <BlockUserModal
                onRequestClose={onRequestClose}
                userToBlock={{
                    id: patronId,
                    imageUrl: avatar,
                    fullName: name,
                }}
            />
        )
    }

    render() {
        const {
            name,
            avatar,
            children,
            isPatron,
            patronId,
            joinDate,
            isLoading,
            isDeclined,
            rewardTier,
            morePopoverOpen,
            setMorePopoverOpen,
            popoverOpen,
            isUserBlocked,
            isBlockUserModalOpen,
            pledgeAmountCents,
            lifetimeSupportCents,
        } = this.props

        this.source = window.location.pathname.split('/')[1] || 'unknown'

        const canMessage = isPatron || lifetimeSupportCents > 0

        const warning = isDeclined && 'Patron must update payment information'
        // To calculate pledge and ditch you need to determine if someone
        // has pledged and ditched in the past... not something for the FE.
        // Punt for now.
        // (pledgeAmountCents >= lifetimeSupportCents && 'Potential fraud risk')

        const body = (
            <div
                onMouseLeave={this.delayedClosePopover}
                onMouseEnter={this.cancelDelayedClosePopover}
            >
                <Block ph={2}>
                    <Header
                        warning={warning}
                        name={name}
                        patronId={patronId}
                        avatar={avatar}
                        isPatron={isPatron}
                        source={this.source}
                        joinDate={moment(joinDate).format('YYYY')}
                    />
                    {isLoading
                        ? <Block pt={2}>
                              <LoadingSpinner size="md" />
                          </Block>
                        : <Block>
                              {isPatron &&
                                  <PatronInfo
                                      rewardTier={rewardTier}
                                      pledgeAmountCents={pledgeAmountCents}
                                      lifetimeSupportCents={
                                          lifetimeSupportCents
                                      }
                                  />}
                          </Block>}
                    <Block bt mv={2} mh={-2}>
                        <Footer
                            patronId={patronId}
                            setMorePopoverOpen={setMorePopoverOpen}
                            morePopoverOpen={morePopoverOpen}
                            isUserBlocked={isUserBlocked}
                            isBlockUserModalOpen={isBlockUserModalOpen}
                            openBlockUserModal={() => {
                                logPatronCardEvent(PATRON_CARD_EVENTS.BLOCK, {
                                    source: this.source,
                                })
                                this.props.openBlockUserModal()
                            }}
                            openMessageUserModal={() => {
                                logPatronCardEvent(PATRON_CARD_EVENTS.MESSAGE, {
                                    source: this.source,
                                })
                                this.props.openMessageUserModal()
                            }}
                            canMessage={canMessage}
                        />
                    </Block>
                </Block>
            </div>
        )

        return (
            <Popover
                body={body}
                style={{ minWidth: 250 }}
                isOpen={popoverOpen}
                onOuterAction={() => this.handleClickOutsidePopover()}
                preferPlace="column"
            >
                <span
                    onMouseOver={() => {
                        this.openPopover()
                        this.cancelDelayedClosePopover()
                    }}
                    onMouseLeave={this.delayedClosePopover}
                >
                    {popoverOpen && this.renderBlockModal()}
                    {popoverOpen && this.renderMessageModal()}
                    {children}
                </span>
            </Popover>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PatronPopover/inner-component.jsx