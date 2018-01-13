import styled from 'styled-components'

const SCROLLABLE_MIN_HEIGHT = '150px'

export const LikesLoadingSpinnerContainer = styled.div`
    ${props =>
        props.initialLoading
            ? `display: flex;
align-items: center;
height: ${SCROLLABLE_MIN_HEIGHT};`
            : `padding: ${props.theme.units.getValue(1)};`};
`
export const IconContainer = styled.div`
    margin-left: auto;
    display: inline-flex;
`

export const ScrollContainer = styled.div`
    max-height: 370px;
    min-height: ${SCROLLABLE_MIN_HEIGHT};
    padding: ${props => props.theme.units.getValue(1)};
    overflow: scroll;
`



// WEBPACK FOOTER //
// ./app/components/LikesDetail/styled-components/index.js