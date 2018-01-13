import t from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Measure from 'react-measure'
import Text from 'components/Text'
import helpers from 'styles/themes/helpers'
const { units } = helpers

const SIZES = ['sm', 'md']

const Badge = ({
    bgColor,
    children,
    maxDigits,
    size,
    target,
    textColor,
    xOffset,
    yOffset,
    dot,
    outline,
    hideIfZero,
}) => {
    const text =
        typeof children === 'number'
            ? Math.log10(children) > maxDigits
              ? Math.pow(10, maxDigits) - 1 + '+'
              : Math.floor(children)
            : children

    let textSize, weight
    if (size === 'sm') {
        textSize = '00'
        weight = 'ultrabold'
    } else if (size === 'md') {
        textSize = '0'
        weight = 'bold'
    }

    const shouldShow = !(hideIfZero && text === 0)

    return (
        <Wrapper>
            <Measure bounds>
                {({ contentRect }) => {
                    let rightOffset = undefined
                    let topOffset = undefined

                    if (
                        !!target &&
                        !!contentRect &&
                        !!contentRect.width &&
                        !!contentRect.height
                    ) {
                        if (xOffset === undefined) {
                            xOffset = contentRect.height / 2.0
                        }
                        if (yOffset === undefined) {
                            yOffset = contentRect.height / 2.0
                        }
                        rightOffset = xOffset - contentRect.width + 'px'
                        topOffset = yOffset - contentRect.height + 'px'
                    }

                    return shouldShow ? (
                        <BadgeSpan
                            backgroundColor={bgColor}
                            right={rightOffset}
                            top={topOffset}
                            dot={dot}
                            outline={outline}
                            badgeOnTarget={!!target}
                        >
                            {dot ? (
                                <Dot />
                            ) : (
                                <Text
                                    color={textColor}
                                    el="div"
                                    noSelect
                                    scale={textSize}
                                    weight={weight}
                                >
                                    {text}
                                </Text>
                            )}
                        </BadgeSpan>
                    ) : (
                        <span />
                    )
                }}
            </Measure>
            {target}
        </Wrapper>
    )
}

const standardColors = [
    'highlightPrimary',
    'highlightSecondary',
    'gray1',
    'gray2',
    'gray3',
    'gray4',
    'gray5',
    'gray6',
    'gray7',
    'gray8',
    'light',
    'success',
    'error',
]

Badge.propTypes = {
    /**
     * Background color of badge.
     */
    bgColor: t.oneOf(standardColors),

    /**
     * Badge count – needs to be pass as a number.
     */
    children: t.oneOfType([t.number, t.string]),

    /**
     * Maximum number of digits to display (truncates with `+`)
     */
    maxDigits: t.number,

    /**
     * `sm` `md`
     */
    size: t.oneOf(SIZES),

    /**
     * The React element to which the badge should be affixed (optional).
     */
    target: t.element,

    /**
     * Any `<Text>` color.
     */
    textColor: t.oneOf(standardColors),

    /**
     * X offset of badge from target in pixels. Defaults to half of the badge’s height.
     */
    xOffset: t.number,

    /**
     * Y offset of badge from target in pixels. Defaults to half of the badge’s height.
     */
    yOffset: t.number,

    /**
     * Show no numbers, just a dot.
     */
    dot: t.bool,

    /**
     * If passed zero, hide the badge entirely.
     */
    hideIfZero: t.bool,
    /**
     * Bool whether to show a light border
     */
    outline: t.bool,
}

Badge.defaultProps = {
    bgColor: 'highlightPrimary',
    maxDigits: 2,
    size: 'sm',
    target: null,
    textColor: 'light',
    hideIfZero: false,
}

const Wrapper = styled.span`
    display: inline-block;
    position: relative;
`

const BadgeSpan = styled.span`
    ${props => `
    background-color: ${props.theme.colors[props.backgroundColor]};
    ${props.right !== undefined ? `right: ${props.right};` : ''}
    ${props.top !== undefined ? `top: ${props.top};` : ''}
    display: inline-block;
    ${props.dot ? '' : `padding: 0 ${units.getValue(0.5)(props)};`}
    border-radius: ${props.dot ? '50%' : props.theme.cornerRadii.default};
    z-index: ${props.theme.zIndex.Z_INDEX_1};
    ${props.badgeOnTarget ? 'position: absolute;' : ''}
    ${props.outline ? `border: 2px solid ${props.theme.colors.light}` : ''}
`};
`

const Dot = styled.div`
    height: ${units.getValue(1)};
    width: ${units.getValue(1)};
`

export default Badge



// WEBPACK FOOTER //
// ./app/components/Badge/index.jsx