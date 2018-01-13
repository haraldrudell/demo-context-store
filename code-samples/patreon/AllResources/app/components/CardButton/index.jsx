import t from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import helpers from 'styles/themes/helpers'
const { buttons } = helpers

import Card from 'components/Card'

const CardButton = ({ children, href, target, onClick, ...cardProps }) =>
    <LinkWrapper href={href} onClick={onClick} target={target}>
        <Card {...cardProps}>
            {children}
        </Card>
    </LinkWrapper>
CardButton.propTypes = {
    children: t.node,
    href: t.string.isRequired,
    target: t.oneOf(['_blank', '_self', '_parent', '_top']),
    onClick: t.func,
    // + any regular Card props
}

CardButton.defaultProps = {
    target: '_self',
}

const LinkWrapper = styled.a`
    display: block;
    transition: ${props => props.theme.transitions.default};

    &:hover {
        ${buttons.getHoverStyles('light')};
    }

    &:active {
        ${buttons.getActiveStyles('light')};
    }
`

export default CardButton



// WEBPACK FOOTER //
// ./app/components/CardButton/index.jsx