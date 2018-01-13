import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import Card from 'components/Card'
import Popover from 'components/Popover'
import Flexy from 'components/Layout/Flexy'
import Block from 'components/Layout/Block'
import { SocialButton } from './styled-components'

export default class extends React.Component {
    static propTypes = {
        card: PropTypes.bool,
        children: PropTypes.object,
        popover: PropTypes.bool,
        onShareClick: PropTypes.func,
        buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
        isPopoverOpen: PropTypes.bool,
        togglePopover: PropTypes.func,
        onOuterAction: PropTypes.func,
    }

    static defaultProps = {
        isPopoverOpen: false,
    }

    renderButton = btn => {
        function _onclick(e) {
            this.onclick(e, btn)
        }

        return (
            <SocialButton
                href={btn.href}
                key={btn.key}
                socialNetworkName={btn.key}
                title={btn.hrefTitle}
                onClick={_onclick.bind(this)}
            >
                <Icon
                    type={btn.icon}
                    size="xxs"
                    label={btn.label}
                    color={btn.color}
                />
            </SocialButton>
        )
    }

    onclick = (e, btn) => {
        e.preventDefault()
        if (this.props.onShareClick) {
            this.props.onShareClick()
        }
        const config = btn.windowConfig

        const posX = (window.screen.width - config.width) / 2
        const posY = (window.screen.height - config.height) / 2

        const shareWindow = window.open(
            btn.href,
            'shareWindow',
            `height=${config.height},width=${config.width},` +
                `left=${posX},top=${posY}`,
        )

        if (shareWindow && shareWindow.focus) {
            shareWindow.focus()
        }
    }

    render() {
        const buttons = this.props.buttons.map(this.renderButton)

        if (this.props.card) {
            return (
                <Card>
                    <Flexy direction="column">{buttons}</Flexy>
                </Card>
            )
        }

        const plainButtons = (
            <Block m={2}>
                <Flexy direction="column">{buttons}</Flexy>
            </Block>
        )

        if (this.props.popover) {
            const popoverStyle = {
                width: '154px',
            }

            return (
                <Popover
                    isOpen={this.props.isPopoverOpen}
                    preferPlace="below"
                    onOuterAction={this.props.onOuterAction}
                    body={plainButtons}
                    style={popoverStyle}
                >
                    <div
                        onClick={this.props.togglePopover}
                        style={{ cursor: 'pointer' }}
                    >
                        {this.props.children}
                    </div>
                </Popover>
            )
        }

        return plainButtons
    }
}



// WEBPACK FOOTER //
// ./app/components/ShareButtons/index.jsx