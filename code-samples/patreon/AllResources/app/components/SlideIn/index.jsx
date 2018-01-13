import React from 'react'
import t from 'prop-types'
import styled from 'styled-components'

import { spring, Motion } from 'react-motion'
import { DEFAULT_SPRING } from 'constants/motion'

const directions = {
    top: ['Y', -1],
    bottom: ['Y', 1],
    right: ['X', -1],
    left: ['X', 1],
}

class SlideIn extends React.Component {
    static propTypes = {
        children: t.node.isRequired,
        /**
         * Direction that children should slide in from.
         */
        from: t.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
        show: t.bool,

        /**
         * Absolutely position the element that is sliding in. This means it
         * will take no space in the layout of the page, which is often
         * desirable.
         */
        absolute: t.bool,
    }

    render() {
        const { from, show, absolute, children } = this.props
        const directionInfo = directions[from]
        const propertyName = `translate${directionInfo[0]}`
        const motionStyle = {
            opacity: spring(show ? 1 : 0.01, DEFAULT_SPRING),
            translate: spring(
                show ? 0 : 100 * directionInfo[1],
                DEFAULT_SPRING,
            ),
        }

        return (
            <Motion style={motionStyle}>
                {motion =>
                    <SlidingWrapper
                        isAbsolute={absolute}
                        propertyName={propertyName}
                        translate={motion.translate}
                        opacity={motion.opacity}
                    >
                        {children}
                    </SlidingWrapper>}
            </Motion>
        )
    }
}

const SlidingWrapper = styled.div`
    ${props => {
        let positioningCss = ''
        if (props.isAbsolute) {
            positioningCss = `
              position: absolute;
              left: 0;
              right: 0;
              z-index: 1;
            `
        }
        return `
            transform: ${props.propertyName}(${props.translate}%);
            opacity: ${props.opacity};
            visibility: ${props.opacity === 0.01 ? 'hidden' : 'visible'};
            ${positioningCss}
        `
    }};
`

export default SlideIn



// WEBPACK FOOTER //
// ./app/components/SlideIn/index.jsx