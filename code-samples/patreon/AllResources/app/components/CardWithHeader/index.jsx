import t from 'prop-types'
import React, { Component } from 'react'

import Block from 'components/Layout/Block'
import Card from 'components/Card'
import Header from 'components/Header'
import SIZE_TO_UNITS, { SIZE_KEYS } from 'constants/sizes'

const BORDER_OPTIONS = ['all', 'noBottom', 'noTop', 'none']

class CardWithHeader extends Component {
    static propTypes = {
        /**
         * `all` `noBottom` `noTop`, 'none'
         */
        border: t.oneOf(BORDER_OPTIONS),

        /**
         * Border color of the card.
         */
        borderColor: t.string,
        children: t.node,
        /**
         * Adds a border below the header.
         */
        hasHeaderBorder: t.bool,

        /**
         * No padding in the body of the card.
         */
        noPadding: t.bool,

        /**
         * `hidden`(default) `visible`
         */
        overflow: t.string,

        /**
         * Render prop for content that goes in the right side of the header.
         */
        renderHeaderContent: t.func,

        /**
         * `sm` `md` `lg`
         */
        size: t.oneOf(SIZE_KEYS),

        /**
         * Remove default rounded corners.
         */
        square: t.bool,

        /**
         * Title that will be rendered in the header.
         */
        title: t.string,
    }

    static defaultProps = {
        size: 'md',
    }

    _getBlockProps() {
        const { hasHeaderBorder, noPadding, size } = this.props
        const unit = SIZE_TO_UNITS[size]

        const blockProps = {
            cornerRadius: 'none',
        }

        if (hasHeaderBorder) {
            blockProps['ph'] = unit
            blockProps['pb'] = unit
            blockProps['bb'] = true
            if (noPadding) {
                blockProps['pt'] = unit
            } else {
                blockProps['mh'] = -unit
                blockProps['mb'] = unit
            }
        } else {
            blockProps['mb'] = unit - 1
            if (noPadding) {
                blockProps['ph'] = unit
                blockProps['pt'] = unit
            }
        }

        return blockProps
    }

    render() {
        const {
            border,
            borderColor,
            children,
            noPadding,
            overflow,
            renderHeaderContent,
            size,
            square,
            title,
        } = this.props

        const cardProps = {
            border,
            borderColor,
            noPadding,
            overflow,
            paddingSize: size,
            square,
        }

        return (
            <Card {...cardProps}>
                <Block {...this._getBlockProps()}>
                    <Header
                        renderHeaderContent={renderHeaderContent}
                        title={title}
                        size={size}
                    />
                </Block>
                {children}
            </Card>
        )
    }
}

export default CardWithHeader



// WEBPACK FOOTER //
// ./app/components/CardWithHeader/index.jsx