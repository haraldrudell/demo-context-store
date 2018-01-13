/* eslint-disable react/no-multi-comp */
import t from 'prop-types'

import React from 'react'
import Text from 'components/Text'
import Flexy from 'components/Layout/Flexy'

const HEADER_SIZES = ['sm', 'md', 'lg']

const renderTitle = (size, title) => {
    let titleProps = {
        color: 'gray2',
        noMargin: true,
        weight: 'bold',
    }

    switch (size) {
        case 'sm':
            titleProps.el = 'h6'
            titleProps.noMargin = true
            titleProps.size = -1
            titleProps.uppercase = true
            break
        case 'md':
            titleProps.el = 'h5'
            titleProps.size = 0
            titleProps.uppercase = true
            break
        case 'lg':
            titleProps.el = 'h4'
            titleProps.size = 2
            break
    }

    return (
        <div>
            <Text {...titleProps}>
                {title}
            </Text>
        </div>
    )
}

const Header = ({ renderHeaderContent, size, title }) => {
    const titleContent = !!title ? renderTitle(size, title) : null

    const headerContent = !!renderHeaderContent ? renderHeaderContent() : null

    return (
        <Flexy
            alignItems="center"
            justifyContent={!!title ? 'space-between' : 'flex-end'}
        >
            {titleContent}
            {headerContent}
        </Flexy>
    )
}

Header.propTypes = {
    renderHeaderContent: t.func,
    size: t.oneOf(HEADER_SIZES),
    title: t.string,
}

Header.defaultProps = {
    size: 'md',
}

export default Header



// WEBPACK FOOTER //
// ./app/components/Header/index.jsx