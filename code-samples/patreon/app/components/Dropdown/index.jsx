import t from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import noop from 'lodash/noop'

import keyCodes from 'constants/key-codes'
import isNodeInRoot from 'utilities/is-node-in-root'
import { SIZE_KEYS } from 'constants/sizes'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Header from 'components/Header'
import Icon from 'components/Icon'
import Text from 'components/Text'

import DropdownList from './DropdownList'
import DropdownListItem from './DropdownListItem'

import {
    DropdownContainer,
    DropdownHandle,
    DropdownHeader,
    Wrapper,
} from './styled-components'

class Dropdown extends Component {
    static propTypes = {
        children: t.node.isRequired,
        closeOnOutsideClick: t.bool,
        disabled: t.bool,
        /**
         * JSX or string of the selected item to render within the dropdown handle
         * Note: No need to add the Down/Up caret; they're handled by the Dropdown component
         **/
        displayValue: t.node,
        /**
         * React component to render instead of the default dropdown handle.
         * `displayValue` and `placeholder` values will be rendered inside of this
         * e.g. a fully bordered Block or a Button
         * ```javascript
         * import Block from 'components/Layout/Block'
         * ...
         * const dropdownHandleComponent = {
         *    component: Block,
         *    props: {
         *      b: true,
         *      backgroundColor: 'light'
         *    }
         * }
         * ```
         **/
        dropdownHandleComponent: t.shape({
            component: t.func.isRequired,
            props: t.object,
        }),
        /**
         * Enables dropdown to stretch to full width of parent container
         **/
        fluidWidth: t.bool,
        /**
         * Allow arbitrarily wide content in the dropdown container,
         * unhindered by the dropdown handle size
         **/
        grow: t.bool,
        /**
         * Header text to display above children in the open dropdown container
         **/
        header: t.string,
        /*
         * Enable to disable open/close caret
         */
        hideCaret: t.bool,
        isOpen: t.bool,
        /**
         * Min width (in units) of dropdown handle + container.
         * Defaults to width of `displayValue` or width of parent
         **/
        minWidth: t.number,
        /**
         * Eliminates input-styled border on dropdown handle
         **/
        noHandleBorder: t.func,
        onOpen: t.func,
        onClose: t.func,
        /**
         * JSX or string of the placeholder the dropdown handle displays before a selection is made.
         * e.g. This is what's shown when the dropdown is collapsed,
         * and is generally a placeholder like 'Select a reward...'
         **/
        placeholder: t.node,
        /**
         * Vertical (max) size of dropdown container
         **/
        size: t.oneOf(SIZE_KEYS),
    }

    static defaultProps = {
        closeOnOutsideClick: true,
        placeholder: 'Select…',
        hideCaret: false,
        onClose: noop,
        onOpen: noop,
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('mousedown', this.handleMouseClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('mousedown', this.handleMouseClickOutside)
    }

    handleKeyDown = e => {
        if (!this.props.closeOnOutsideClick) {
            return
        }
        if (this.props.isOpen && e.keyCode === keyCodes.ESC) {
            this.props.onClose()
        }
    }

    handleMouseClickOutside = e => {
        if (!this.props.closeOnOutsideClick || !this.props.isOpen) {
            return
        }

        // We also want to consider clicks on the toggle div as 'inside' clicks
        // so we don't preempt onClick's call of this.props.onClose
        if (
            isNodeInRoot(
                e.target,
                ReactDOM.findDOMNode(this.childrenWrapper),
            ) ||
            isNodeInRoot(e.target, ReactDOM.findDOMNode(this.menuToggleDiv))
        ) {
            return
        }

        e.stopPropagation()
        this.props.onClose()
    }

    toggleMenuShowing = () => {
        const { disabled, onOpen, onClose, isOpen } = this.props
        if (disabled) return

        if (!isOpen) {
            onOpen()
        } else {
            onClose()
        }
    }

    renderHeader = () => {
        const { header } = this.props
        return (
            <DropdownHeader bb>
                <Header title={header} />
            </DropdownHeader>
        )
    }

    renderDisplayValue = () => {
        const { disabled } = this.props
        const displayValue = this.props.displayValue || this.props.placeholder
        return typeof displayValue === 'string' ? (
            <Text color={disabled ? 'gray4' : 'gray1'}>{displayValue}</Text>
        ) : (
            displayValue
        )
    }

    renderHandleContent = () => {
        const isOpen = this.props.isOpen
        const caretColor = this.props.disabled ? 'gray4' : 'gray2'
        return (
            <Flexy justifyContent="space-between" alignContent="center">
                <Block mr={1.5}>{this.renderDisplayValue()}</Block>
                <Icon
                    type={isOpen ? 'caretUp' : 'caretDown'}
                    color={caretColor}
                    size="xxs"
                />
            </Flexy>
        )
    }

    render() {
        const {
            disabled,
            dropdownHandleComponent: handleComponent,
            fluidWidth,
            grow,
            hideCaret,
            isOpen,
            minWidth,
            noHandleBorder,
            size,
        } = this.props
        const borderColor = disabled ? 'gray6' : 'gray5'
        let handleContent = hideCaret ? null : this.renderHandleContent()
        if (handleComponent) {
            handleContent = React.createElement(
                handleComponent.component,
                handleComponent.props,
                handleContent,
            )
        }

        return (
            <Wrapper
                position="relative"
                disabled={disabled}
                fluidWidth={fluidWidth}
            >
                <DropdownHandle
                    ref={ref => (this.menuToggleDiv = ref)}
                    data-tag="menuToggleDiv"
                    isOpen={isOpen}
                    minWidth={minWidth}
                    hasCustomHandle={!!handleComponent}
                    borderColor={!noHandleBorder && borderColor}
                    onClick={this.toggleMenuShowing}
                >
                    {handleContent}
                </DropdownHandle>
                {isOpen && (
                    <DropdownContainer
                        position="absolute"
                        backgroundColor="light"
                        grow={grow}
                        size={size}
                        ref={ref => (this.childrenWrapper = ref)}
                    >
                        {this.props.header && this.renderHeader()}
                        {this.props.children}
                    </DropdownContainer>
                )}
            </Wrapper>
        )
    }
}

export default Dropdown
export { DropdownContainer, DropdownList, DropdownListItem }



// WEBPACK FOOTER //
// ./app/components/Dropdown/index.jsx