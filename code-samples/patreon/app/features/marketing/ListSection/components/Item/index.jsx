import PropTypes from 'prop-types'
import React from 'react'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Text from 'components/Text'

import Illustration from '../Illustration'

const alignToJustify = alignment => {
    switch (alignment) {
        case 'left':
            return 'flex-start'
        case 'center':
            return 'center'
        case 'right':
            return 'flex-end'
        default:
            return 'flex-start'
    }
}

const Item = ({
    align,
    description,
    icon,
    iconSize,
    svg,
    iconColors,
    title,
    color,
    inline,
    uppercaseTitle,
    uppercaseDescription,
}) =>
    <Flexy display={inline ? 'flex' : 'block'}>
        <div>
            <Flexy justifyContent={alignToJustify(align)}>
                {svg && <Illustration name={svg} size={8} />}
                {icon &&
                    <Icon type={icon} color={iconColors} size={iconSize} />}
            </Flexy>
        </div>
        <Block ml={inline ? 3 : 0} mt={inline ? 0 : 2}>
            <Text
                el="h5"
                align={align}
                size={uppercaseTitle ? 2 : 3}
                weight={uppercaseTitle ? 'bold' : 'normal'}
                color={color}
                noMargin
                uppercase={uppercaseTitle}
            >
                {title}
            </Text>
            <Text
                el="p"
                align={align}
                color={color}
                weight={uppercaseDescription ? 'bold' : 'normal'}
                uppercase={uppercaseDescription}
            >
                {description}
            </Text>
        </Block>
    </Flexy>

Item.propTypes = {
    align: PropTypes.oneOf(['left', 'center', 'right']),
    // Item text color
    color: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    // icon type to be passed along to <Icon> component
    icon: PropTypes.string,
    // @DEPRECATED
    // This is a string representation of an SVG element that must be dangerouslySet
    // Ideally, these will all be deprecated in favor of icon types
    svg: PropTypes.string,
    // Colors for icon; is ignored for "svg" Illustrations
    iconColors: PropTypes.arrayOf(PropTypes.string),
    iconSize: PropTypes.string,
    inline: PropTypes.bool,
    uppercaseTitle: PropTypes.bool,
    uppercaseDescription: PropTypes.bool,
}

Item.defaultProps = {
    align: 'left',
    color: 'dark',
    iconSize: 'xxl',
    iconColors: ['dark', 'highlightPrimary'],
    inline: true,
}

export default Item



// WEBPACK FOOTER //
// ./app/features/marketing/ListSection/components/Item/index.jsx