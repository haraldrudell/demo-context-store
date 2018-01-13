import t from 'prop-types'
import React, { Component } from 'react'
import numeral from 'numeral'
import styled from 'styled-components'

const COLORS = ['highlightPrimary', 'highlightSecondary']
const BACKGROUND_COLORS = [
    'gray1',
    'gray2',
    'gray3',
    'gray4',
    'gray5',
    'gray6',
    'gray7',
    'gray8',
    'light',
]
const DEFAULT_BACKGROUND_COLOR = 'gray4'

class ProgressMeter extends Component {
    static propTypes = {
        /**
         * The background color for the ProgressMeter
         * Choices: gray1, gray2, gray3, gray4, gray5, gray6, gray7, gray8, light
         * Defaults to gray6
         **/
        backgroundColor: t.oneOf(BACKGROUND_COLORS),
        /**
         * The color of progress made bar.
         * Choices: highlightPrimary, highlightSecondary
         * Defaults to highlightPrimary
         **/
        color: t.oneOf(COLORS),
        /**
         * Percentage of how much progress has been made.
         **/
        percentage: t.number,
        /**
         * Whether to show percentage label
         * Defaults to False
         **/
        showPercentage: t.bool,
        /**
         * Custom percentage label to display next to progress meter
         **/
        percentageLabel: t.oneOfType([t.string, t.node]),
    }

    static defaultProps = {
        backgroundColor: 'gray6',
        color: 'highlightSecondary',
        percentage: 0,
        showPercentage: false,
        percentageLabel: '',
    }

    render() {
        const {
            backgroundColor,
            color,
            percentage,
            showPercentage,
            percentageLabel,
        } = this.props

        const formattedPercentage = numeral(percentage).format('0%')
        const meter = (
            <StyledBar color={backgroundColor || DEFAULT_BACKGROUND_COLOR}>
                <StyledBar
                    color={color}
                    formattedPercentage={formattedPercentage}
                    isForeground
                />
            </StyledBar>
        )

        if (!showPercentage) {
            return meter
        }

        return (
            <div>
                <StyledProgressLabel>
                    <span>
                        {percentageLabel}
                    </span>
                    <span>
                        {formattedPercentage}
                    </span>
                </StyledProgressLabel>
                {meter}
            </div>
        )
    }
}

const getColor = props => {
    const { color, theme } = props
    switch (color) {
        case 'highlightPrimary':
            return theme.colors.highlightPrimary
        case 'highlightSecondary':
            return theme.colors.highlightSecondary
        default:
            return theme.colors[color]
    }
}

const StyledProgressLabel = styled.div`
    font-size: ${props => props.theme.text.getSize(0)};
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
`

const StyledBar = styled.div`
    ${props =>
        props.isForeground
            ? `transition: ${props.theme.transitions.defaultTransition}`
            : ''};
    height: 8px;
    background-color: ${props => getColor(props)};
    border-radius: ${props => props.theme.cornerRadii.imageDefault};
    width: ${props => props.formattedPercentage || '100%'};
`

export default ProgressMeter



// WEBPACK FOOTER //
// ./app/components/ProgressMeter/index.jsx