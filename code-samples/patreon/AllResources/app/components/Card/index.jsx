import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import Block from 'components/Layout/Block'

const PADDING_SIZES = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
}
const BORDER_OPTIONS = ['all', 'noBottom', 'noTop', 'none']
const OVERFLOW_OPTIONS = ['hidden', 'visible']

class Card extends Component {
    static propTypes = {
        /**
         * Background color of the card.
         */
        // TODO: See if there's a better way to check for oneOf within colors array
        bgColor: t.string,

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
         * Remove default padding.
         */
        noPadding: t.bool,

        /**
         * **DEPRECATED** – do not use `onClick` on a `Card`
         */
        onClick: t.func,

        /**
         * `hidden` `visible`
         */
        overflow: t.oneOf(OVERFLOW_OPTIONS),

        /**
         * `sm` `md` `lg` `xl`
         */
        paddingSize: t.oneOf(Object.keys(PADDING_SIZES)),

        /**
         * Remove default rounded corners.
         */
        square: t.bool,

        /**
         * Hooks for finding this element easily in tests
         */
        'data-tag': t.string,
    }

    static defaultProps = {
        border: 'all',
        overflow: 'hidden',
        paddingSize: 'lg',
        bgColor: 'white',
    }

    render() {
        const {
            bgColor,
            border,
            borderColor,
            children,
            noPadding,
            onClick,
            overflow,
            paddingSize,
            square,
        } = this.props

        const styledProps = {
            bgColor,
            border,
            borderColor,
            overflow,
            square,
            'data-tag': this.props['data-tag'],
        }

        return (
            <StyledCard onClick={onClick} {...styledProps}>
                <Block p={noPadding ? 0 : PADDING_SIZES[paddingSize]}>
                    {children}
                </Block>
            </StyledCard>
        )
    }
}

const _css = props => {
    const { bgColor, border, borderColor, overflow, square, theme } = props
    const hasTopBorder = !(border === 'noTop' || border === 'none')
    const hasBottomBorder = !(border === 'noBottom' || border === 'none')
    const hasSideBorders = border !== 'none'
    const borderCSS = borderColor
        ? `${theme.strokeWidths.default} solid ${theme.colors[borderColor]}`
        : theme.components.card.border
    return `
        ${`border-top: ${hasTopBorder ? borderCSS : 'none'};`}
        ${`border-bottom: ${hasBottomBorder ? borderCSS : 'none'};`}
        ${`border-left: ${hasSideBorders ? borderCSS : 'none'};`}
        ${`border-right: ${hasSideBorders ? borderCSS : 'none'};`}
        border-radius: ${square ? '0' : theme.cornerRadii.default};
        box-shadow: ${theme.components.card.boxShadow};
        background-color: ${theme.colors[bgColor]};
        overflow: ${overflow};
        img { max-width: 100%; }
        iframe { max-width: 100%; }
    `
}

const StyledCard = styled.div`
    ${_css};
`

export default Card



// WEBPACK FOOTER //
// ./app/components/Card/index.jsx