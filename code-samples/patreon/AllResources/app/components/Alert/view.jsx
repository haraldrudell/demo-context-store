/* eslint-disable react/prop-types */
import React from 'react'

import Button from 'components/Button'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import SlideIn from 'components/SlideIn'
import TextButton from 'components/TextButton'

import { AlertWrapper, DismissIconButton } from './styled-components'

const DEFAULT_BUTTON_SIZE = 'sm'
const DEFAULT_BUTTON_COLOR = 'blue'

export default class extends React.Component {
    static displayName = 'AlertView'

    _makeClickHandler = analyticsEventTitle => {
        return analyticsEventTitle
            ? () => this.props.trackClick(analyticsEventTitle)
            : this.trackClick
    }

    _renderButton = (buttonProp, i) => {
        const buttonColor = buttonProp.color || DEFAULT_BUTTON_COLOR
        const buttonSize = buttonProp.size || DEFAULT_BUTTON_SIZE
        const analyticsClick = this._makeClickHandler(
            buttonProp.analyticsEventTitle,
        )
        const isLoading = buttonProp.isLoading || false

        let handleClick
        if (buttonProp.onClick) {
            handleClick = e => {
                if (analyticsClick) {
                    analyticsClick.call(this, e)
                }
                buttonProp.onClick.call(this, e)
            }
        } else {
            handleClick = analyticsClick
        }

        return (
            <Block mv={1} mh={2} key={buttonProp.text}>
                <Button
                    key={i}
                    color={buttonColor}
                    size={buttonSize}
                    onClick={handleClick}
                    href={buttonProp.href}
                    target={buttonProp.hrefTarget}
                    isLoading={isLoading}
                >
                    {buttonProp.text}
                </Button>
            </Block>
        )
    }

    renderButtons = () => {
        const buttons = this.props.buttons.map(this._renderButton)
        if (this.props.buttonsPosition === 'bottom') {
            return (
                <Block mt={2}>
                    <Flexy
                        alignItems="center"
                        justifyContent="space-around"
                        wrap="wrap"
                    >
                        {buttons}
                    </Flexy>
                </Block>
            )
        }

        return buttons
    }

    _renderLink = (linkProp, i) => {
        const handleClick = this._makeClickHandler(linkProp.analyticsEventTitle)
        return (
            <TextButton
                key={i}
                href={linkProp.href}
                target={linkProp.hrefTarget}
                onClick={handleClick}
            >
                {linkProp.text}
            </TextButton>
        )
    }

    renderLinks = () =>
        <Block mt={2}>
            <Flexy
                alignItems="center"
                direction="row"
                justifyContent="space-around"
                wrap="wrap"
            >
                {this.props.links.map(this._renderLink)}
            </Flexy>
        </Block>

    renderDismissIcon = () => {
        if (this.props.size === 'sm') {
            return (
                <DismissIconButton
                    type="cancel"
                    size="xs"
                    onClick={this.props.onDismiss}
                    color="gray4"
                />
            )
        }
        return (
            <DismissIconButton
                type="close"
                size="xs"
                onClick={this.props.onDismiss}
                color="gray4"
            />
        )
    }

    render() {
        const {
            animate,
            children,
            buttons,
            backgroundColor,
            border,
            buttonsPosition,
            hasDismiss,
            links,
            show,
            thinStyle,
        } = this.props
        const hasButtons = !!buttons && buttons.length
        const hasLinks = !!links && links.length

        let contents = (
            <AlertWrapper
                p={thinStyle ? 1 : 3}
                backgroundColor={backgroundColor}
                data-tag="components-alert-contentsDiv"
                buttonsRight={hasButtons && buttonsPosition === 'right'}
                isDismissable={hasDismiss}
                bb={!!border}
            >
                {children}
                {hasButtons && this.renderButtons()}
                {hasLinks && this.renderLinks()}
                {hasDismiss && this.renderDismissIcon()}
            </AlertWrapper>
        )

        if (animate) {
            return (
                <SlideIn from="top" absolute show={show}>
                    {contents}
                </SlideIn>
            )
        } else {
            return this.props.show === false ? null : contents
        }
    }
}



// WEBPACK FOOTER //
// ./app/components/Alert/view.jsx