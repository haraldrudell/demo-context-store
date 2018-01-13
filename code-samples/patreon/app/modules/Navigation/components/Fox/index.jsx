import t from 'prop-types'
import React from 'react'

import SvgImage from 'components/SvgImage'
import FoxSVG from './svg/FoxSVG'

const Fox = ({ onClick }) =>
    <SvgImage
        el={FoxSVG}
        fills={['highlightPrimary', 'white']}
        onClick={onClick}
    />

Fox.propTypes = {
    onClick: t.func,
}

export default Fox



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/Fox/index.jsx