import t from 'prop-types'
import React from 'react'

import Card from 'components/Card'
import FlexModalWrapper from 'components/FlexModalWrapper'

import classNames from 'classnames'

export default class extends React.Component {
    static displayName = 'Modal'

    static propTypes = {
        noBodyPadding: t.bool,
        children: t.node,
        className: t.string,
        close: t.func.isRequired,
        closeOnEsc: t.bool,
        header: t.node,
        headerDiv: t.bool,
        inline: t.bool,
        footer: t.node,
        footerDiv: t.bool,
        isScrollable: t.bool,
        maxWidth: t.string,
        noCard: t.bool,
        overflowHidden: t.bool,
        show: t.bool,
        beforeClose: t.func,
        closeOnOutsideClick: t.bool,
    }

    static defaultProps = {
        className: 'col-xs-12 col-md-6',
        closeOnOutsideClick: true,
        closeOnEsc: true,
        headerDiv: false,
        footerDiv: true,
        overflowHidden: true,
    }

    renderHeader = () => {
        const headerClasses = classNames({ 'bd-xs-b': this.props.headerDiv })
        return (
            <div className={headerClasses}>
                {this.props.header}
            </div>
        )
    }

    renderFooter = () => {
        const footerClasses = classNames({ 'bd-xs-t': this.props.footerDiv })
        return (
            <div className={footerClasses}>
                {this.props.footer}
            </div>
        )
    }

    render() {
        const cardStyle = {}
        if (this.props.isScrollable) {
            cardStyle['overflowY'] = 'auto'
        }

        const card = (
            <Card noPadding overflow="visible">
                {!!this.props.header ? this.renderHeader() : null}
                <div
                    className={!this.props.noBodyPadding && `p-lg`}
                    style={cardStyle}
                >
                    {this.props.children}
                </div>
                {!!this.props.footer ? this.renderFooter() : null}
            </Card>
        )

        const noCard = (
            <div
                className={!this.props.noBodyPadding && `p-lg`}
                style={cardStyle}
            >
                {this.props.children}
            </div>
        )

        if (this.props.show && this.props.inline) return card

        return (
            <FlexModalWrapper
                className={this.props.className}
                isOpened={this.props.show}
                onClose={this.props.close}
                beforeClose={this.props.beforeClose}
                closeOnEsc={this.props.closeOnEsc}
                maxWidth={this.props.maxWidth}
                closeOnOutsideClick={this.props.closeOnOutsideClick}
                overflowHidden={this.props.overflowHidden}
            >
                {this.props.noCard ? noCard : card}
            </FlexModalWrapper>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/Modal/index.jsx