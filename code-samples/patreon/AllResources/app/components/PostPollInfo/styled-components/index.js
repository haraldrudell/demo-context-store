import styled from 'styled-components'

export const PostPollInfoWrapper = styled.div`
    background-color: ${props => props.theme.colors.white};
    width: 100%;
`

export const StyledChoiceBar = styled.div`
    ${props => `
    background: ${props.theme.colors.pollFill};
    transition: width .2s ease-in-out;
    width: ${props.percentageVotes};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
`};
`

export const StyledChoiceTextAndBar = styled.div`
    ${props => `
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${props.showResults ? '0' : props.theme.strokeWidths.default};
    border: ${props.showResults
        ? props.theme.components.postPollInfo.border
        : '0'};
    border-radius: ${props.theme.cornerRadii.default};
    p {
        padding: ${props.theme.units.getValue(1)};
        padding-left: ${props.theme.units.getValue(2)};
        z-index: ${props.theme.zIndex.Z_INDEX_1};
    }
`};
`

export const AmountContainer = styled.div`
    margin-left: ${props => props.theme.units.getValue(1)};
    width: ${props => props.theme.units.getValue(6)};
    min-width: ${props => props.theme.units.getValue(6)};
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`



// WEBPACK FOOTER //
// ./app/components/PostPollInfo/styled-components/index.js