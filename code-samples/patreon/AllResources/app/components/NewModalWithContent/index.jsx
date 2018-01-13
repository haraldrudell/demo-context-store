import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Card from 'components/Card'
import CardWithHeader from 'components/CardWithHeader'
import NewModal from 'components/NewModal'

export default class NewModalWithContent extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        footer: PropTypes.node,
        header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        isOpen: PropTypes.bool,
        isScrollable: PropTypes.bool,
        onRequestClose: PropTypes.func,
        overlayClosesModal: PropTypes.bool,
        closeOnEscape: PropTypes.bool,
        width: PropTypes.oneOf(['lg', 'md', 'sm']),
    }

    static defaultProps = {
        isOpen: false,
        overlayClosesModal: true,
        closeOnEscape: true,
        onRequestClose: function() {},
        width: 'md',
    }

    renderHeader() {
        return typeof this.props.header === 'string'
            ? null
            : <div className="bd-xs-b">
                  {this.props.header}
              </div>
    }

    renderFooter() {
        return (
            <div>
                {this.props.footer}
            </div>
        )
    }

    render() {
        const cardStyle = {}
        if (this.props.isScrollable) {
            cardStyle['overflowY'] = 'auto'
        }

        const constructHeader = typeof this.props.header === 'string'

        const cardContent = (
            <div>
                {!!this.props.header ? this.renderHeader() : null}
                <div
                    className={constructHeader ? null : 'p-lg'}
                    style={cardStyle}
                >
                    {this.props.children}
                </div>
                {!!this.props.footer ? this.renderFooter() : null}
            </div>
        )

        const card = constructHeader
            ? <CardWithHeader
                  title={this.props.header}
                  hasHeaderBorder
                  noPadding
                  forceHeaderPadding
              >
                  {cardContent}
              </CardWithHeader>
            : <Card noPadding overflow="visible" border="none">
                  {cardContent}
              </Card>

        return (
            <NewModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                closeOnEscape={this.props.closeOnEscape}
                overlayClosesModal={this.props.overlayClosesModal}
                width={this.props.width}
            >
                {card}
            </NewModal>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/NewModalWithContent/index.jsx