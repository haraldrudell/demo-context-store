/* eslint-disable react/no-string-refs */

import t from 'prop-types'

import React from 'react'
import createReactClass from 'create-react-class'
import ReactDOM from 'react-dom'

import Text from 'components/Text'
import TextButton from 'components/TextButton'
import { IS_IOS } from 'utilities/browser'

import styles from './styles.less'

const SIZES = ['sm', 'md']
const SCALES = ['00', '0', '1', '2', '3', '4', '5', '6']
const COPY_TIMEOUT = 2000

export default createReactClass({
    displayName: 'LinkCopier',

    propTypes: {
        url: t.string.isRequired,
        borderRadius: t.bool,
        copyLabel: t.string,
        copiedLabel: t.string,
        onCopyLink: t.func,
        confirmCopy: t.bool,
        size: t.oneOf(SIZES),
        scale: t.oneOf(SCALES),
    },

    getDefaultProps: () => ({
        borderRadius: false,
        copyLabel: 'copy link',
        copiedLabel: 'copied',
        onCopyLink: () => {},
        confirmCopy: false,
        size: 'sm',
        scale: '1',
    }),

    getInitialState: () => ({
        isCopied: false,
    }),

    generateButton() {
        const buttonBorderRadiusClass = this.props.borderRadius
            ? styles.buttonBorderRadius
            : ''
        const copyLinkClass =
            this.props.size === 'sm' ? styles.sizeSm : styles.sizeMd
        const useCopiedLabel = this.props.confirmCopy && this.state.isCopied
        const labelText = useCopiedLabel
            ? this.props.copiedLabel
            : this.props.copyLabel
        let button
        if (this.props.size === 'md') {
            button = (
                <button
                    onClick={this.onCopyLink}
                    className={`${buttonBorderRadiusClass} ${styles.button} ${styles.blue} ${styles.copyLink} ${copyLinkClass}`}
                >
                    <div
                        className={`${styles.copiedLabel} ${useCopiedLabel
                            ? styles.copiedLabelVisible
                            : null}`}
                    >
                        {this.props.copiedLabel}
                    </div>
                    <div
                        className={`${useCopiedLabel
                            ? styles.copyLabelInvisible
                            : null}`}
                    >
                        {this.props.copyLabel}
                    </div>
                </button>
            )
        } else {
            let label
            if (useCopiedLabel) {
                label = (
                    <Text color="gray3" scale={this.props.scale}>
                        {labelText}
                    </Text>
                )
            } else {
                label = (
                    <TextButton onClick={this.onCopyLink}>
                        <Text scale={this.props.scale} color="blue">
                            {labelText}
                        </Text>
                    </TextButton>
                )
            }
            button = <div className={copyLinkClass}>{label}</div>
        }
        return button
    },

    isCopySupported: () =>
        document.queryCommandSupported &&
        document.queryCommandSupported('copy') &&
        !IS_IOS,

    onCopyLink() {
        if (this.state.isCopied) {
            return
        }

        ReactDOM.findDOMNode(this.linkRef).select()
        document.execCommand('copy')
        this.setState({ isCopied: true })
        setTimeout(() => {
            if (this.isMounted()) {
                this.setState({ isCopied: false })
            }
        }, COPY_TIMEOUT)
        this.props.onCopyLink()
    },

    onClickLink() {
        const link = ReactDOM.findDOMNode(this.linkRef)
        // Using `setSelectionRange()` because of crappy `select()` support on iOS
        link.setSelectionRange(0, 9999)
    },

    render() {
        const linkUrlSizeClass =
            this.props.size === 'sm' ? styles.linkUrlSm : styles.linkUrlMd
        const borderRadiusClass = this.props.borderRadius
            ? styles.borderRadius
            : ''
        let button = this.isCopySupported() && this.generateButton()

        return (
            <div
                className={`${borderRadiusClass} ${styles.link} ${styles[
                    `scale${this.props.scale}`
                ]}`}
            >
                <input
                    ref={ref => (this.linkRef = ref)}
                    className={`${styles.linkUrl} ${linkUrlSizeClass} p-sm`}
                    type="text"
                    value={this.props.url}
                    onClick={this.onClickLink}
                    readOnly
                />
                {button}
            </div>
        )
    },
})



// WEBPACK FOOTER //
// ./app/components/LinkCopier/index.jsx