import t from 'prop-types'
import React, { Component } from 'react'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withState } from 'recompose'
import nion, { exists, selectData } from 'nion'
import { buildUrl, JsonApiPayload } from 'utilities/json-api'

import Button from 'components/Button'
import NewModalWithContent from 'components/NewModalWithContent'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import reasons from './reasons'

import { getIsModalOpen, closeModal } from '../../core'

const blockInclude = [
    'blocked.null',
    'block_action.blocked',
    'block_action.chosen_reason',
]
const blockFields = {
    user: ['full_name', 'vanity'],
}

@connect(
    createStructuredSelector({
        currentUser: selectData('currentUser'),
        isModalOpen: getIsModalOpen,
    }),
    {
        closeModal,
    },
)
@withState('selectedReason', 'setSelectedReason', null)
@withState('isWorking', 'setIsWorking', false)
@withState('error', 'setError', null)
@nion(({ userToBlock }) => ({
    block: {
        dataKey: `modules:blockUser:${userToBlock.id}`,
        endpoint: buildUrl(`/block/${userToBlock.id}`, {
            include: blockInclude,
            fields: blockFields,
        }),
        fetchOnInit: true,
    },
}))
class BlockUserModal extends Component {
    static propTypes = {
        closeModal: t.func,
        currentUser: t.object,
        isWorking: t.bool,
        isModalOpen: t.bool,
        onRequestClose: t.func,
        onBlockOrUnblock: t.func,
        setIsWorking: t.func,
        selectedReason: t.string,
        setSelectedReason: t.func,
        userToBlock: t.object,
        error: t.string,
        setError: t.func,
    }

    canUnblock = () => {
        const { block } = this.props.nion
        const canUnblock = exists(block) && get(block, 'blockAction.id')

        return canUnblock
    }

    block = selectedReason => {
        const { block } = this.props.nion
        const { currentUser, userToBlock } = this.props

        const blockPayload = new JsonApiPayload('block_action', {})
        blockPayload.addRelationship('blocker', {
            type: 'user',
            id: currentUser.id,
        })
        blockPayload.addRelationship('blocked', {
            type: 'user',
            id: userToBlock.id,
        })

        if (selectedReason) {
            blockPayload.addRelationship('chosen_reason', {
                type: 'block_reason',
                id: selectedReason,
            })
        }

        // Because the POST request requires a different endpoint, we'll manually override it here
        const endpoint = buildUrl('/block', {
            include: blockInclude,
            fields: blockFields,
        })

        this.props.setIsWorking(true)

        return block.actions
            .post(blockPayload.toRequest(), { endpoint })
            .then(() => {
                this.props.setIsWorking(false)
                this.props.closeModal()
            })
            .catch(e => {
                this.props.setIsWorking(false)
                this.props.setError(e)
            })
    }

    getBlockActionId = () => {
        const { block } = this.props.nion
        return get(block, 'blockAction.id')
    }

    unblock = () => {
        const { block } = this.props.nion
        const blockActionId = this.getBlockActionId()

        // Create a new endpoint to be passed to the delete action, since it uses a different
        // signature than the post action
        const endpoint = buildUrl(`/block_action/${blockActionId}`)

        this.props.setIsWorking(true)

        return block.actions
            .delete({ endpoint })
            .then(() => {
                this.props.setIsWorking(false)
                this.props.closeModal()
            })
            .catch(e => {
                this.props.setIsWorking(false)
                this.props.setError(e)
            })
    }

    renderReasons = () => {
        const canUnblock = this.canUnblock()

        if (canUnblock) {
            return
        }

        return (
            <form>
                {reasons.map(this.renderReason)}
            </form>
        )
    }

    renderReason = reason => {
        const { setSelectedReason } = this.props

        return (
            <Block mb={2} key={reason.id}>
                <Flexy>
                    <div>
                        <input
                            type="radio"
                            name="reason"
                            value={reason.id}
                            onChange={() => setSelectedReason(reason.id)}
                        />
                    </div>
                    <Block ml={1}>
                        <Text>
                            {reason.displayDescription}
                        </Text>
                    </Block>
                </Flexy>
            </Block>
        )
    }

    headerText = () => {
        const { userToBlock } = this.props

        const canUnblock = this.canUnblock()
        return canUnblock
            ? `Unblock ${userToBlock.fullName}?`
            : `Why are you blocking ${userToBlock.fullName}?`
    }

    renderFooter = () => {
        const { block } = this.props.nion
        const { isWorking } = this.props

        const canUnblock = this.canUnblock()

        const cancelButton = (
            <Block mr={2} display="inline-block">
                <Button
                    color="tertiary"
                    size="sm"
                    onClick={this.props.closeModal}
                >
                    Cancel
                </Button>
            </Block>
        )

        const selectedReason = this.props.selectedReason

        const onBlockButtonClick = () => {
            if (canUnblock) {
                this.unblock().then(
                    () =>
                        this.props.onBlockOrUnblock &&
                        this.props.onBlockOrUnblock(),
                )
            } else {
                this.block(selectedReason).then(
                    () =>
                        this.props.onBlockOrUnblock &&
                        this.props.onBlockOrUnblock(),
                )
            }
        }

        const { isLoading } = block.request

        // Want to preemptively show load state for CSRF ticket fetching
        const isButtonLoading = isLoading || isWorking

        const blockButton = (
            <Button
                color="secondary"
                size="sm"
                isLoading={isButtonLoading}
                onClick={onBlockButtonClick}
            >
                {canUnblock ? 'Unblock' : 'Block'}
            </Button>
        )

        const error = this.props.error

        return (
            <Block p={2} bt style={{ width: '100%', boxSizing: 'border-box' }}>
                <Flexy
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {cancelButton}
                    <Flexy alignItems="center" direction="row">
                        {error
                            ? <Block pr={1}>
                                  There was an error. Try again.{' '}
                              </Block>
                            : ''}
                        {blockButton}
                    </Flexy>
                </Flexy>
            </Block>
        )
    }

    renderContent = () => {
        const { fullName } = this.props.userToBlock

        const canUnblock = this.canUnblock()

        const unblockMessage = `Unblocking ${fullName} will allow them to become your patron and contact you.`
        const blockMessage = `Blocking ${fullName} will remove their pledge, remove any declined or pending payments, prevent them from contacting you, and prevent them from becoming your patron in the future.`

        return (
            <div>
                <div className="stackable">
                    {canUnblock ? unblockMessage : blockMessage}
                </div>
                <TextButton href="https://patreon.zendesk.com/hc/en-us/articles/207982093">
                    {' '}Learn more about blocking
                </TextButton>
            </div>
        )
    }

    onRequestClose = () => {
        this.props.setError(null)
        this.props.onRequestClose()
    }

    render = () => {
        const { isModalOpen } = this.props

        return (
            <NewModalWithContent
                isOpen={isModalOpen}
                onRequestClose={this.onRequestClose}
                header={this.headerText()}
                footer={this.renderFooter()}
            >
                <Block p={2}>
                    {this.renderReasons()}
                    {this.renderContent()}
                </Block>
            </NewModalWithContent>
        )
    }
}

BlockUserModal.propTypes = {
    currentUser: t.object,
    userToBlock: t.object,
    onRequestClose: t.func,
    isModalOpen: t.bool,
    setIsWorking: t.bool,
    closeModal: t.func,
    setSelectedReason: t.func,
    selectedReason: t.number,
}

export default BlockUserModal



// WEBPACK FOOTER //
// ./app/modules/BlockUserModal/containers/BlockUserModal/index.jsx