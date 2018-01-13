import styled, { css } from 'styled-components'
import helpers from 'styles/themes/helpers'
const { colors, units } = helpers

const rowBottom = css`
    border-bottom: 1px solid ${colors.gray5()};
    margin-bottom: ${units.getValue(4)};
`

const lastRowBottom = css`
    margin-bottom: 0;
`

export const RewardWrapper = styled.div`
    margin: ${units.getValues([2, -2, 4, -2])};
    padding: ${units.getValues([0, 2, 4, 2])};
    ${props => (props.isLast ? lastRowBottom : rowBottom)};
    a {
        color: ${props => props.theme.textButtons.getColor('default')};
        font-weight: ${props => props.theme.text.getWeight('bold')};
    }
`

export const LimitedLouderExp = styled.div`
    background: ${props => props.theme.colors.coral};
    color: ${props => props.theme.colors.white};
    padding: 2px 10px;
    display: inline-block;
`

export const RewardsUnorderedListContainer = styled.div`
    ul {
        padding-left: ${props => props.theme.units.getValue(3)};
        word-wrap: break-word;
    }
    p {
        word-wrap: break-word;
    }
`



// WEBPACK FOOTER //
// ./app/components/RewardsCard/RewardsList/styled-components/index.js