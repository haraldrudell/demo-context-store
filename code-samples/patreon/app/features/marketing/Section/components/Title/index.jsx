import PropTypes from 'prop-types'
import React from 'react'

import Block from 'components/Layout/Block'
import Text from 'components/Text'

const Title = ({ sectionColor, text, noMargin, lowercase }) =>
    <Block mb={noMargin ? 0 : 4}>
        <Text
            el="h2"
            color={sectionColor === 'dark' ? 'light' : 'dark'}
            align="center"
            weight="bold"
            size={3}
            uppercase={!lowercase}
            noMargin
        >
            {text}
        </Text>
    </Block>
Title.propTypes = {
    /*
     * The color of the section this goes on. If dark, then text will be light, and vice versa.
     */
    sectionColor: PropTypes.oneOf(['light', 'dark']),
    text: PropTypes.string.isRequired,
    /*
     * Whether to remove bottom margin on text
     */
    noMargin: PropTypes.bool,
    lowercase: PropTypes.bool,
}

export default Title



// WEBPACK FOOTER //
// ./app/features/marketing/Section/components/Title/index.jsx