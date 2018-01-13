import styled from 'styled-components'

export const Label = styled.div`
    ${props =>
        props.active &&
        `padding-left: ${props.theme.units.getValues(3)};`} ${props =>
            !props.active &&
            `
        &:hover {
            padding-left: ${props.theme.units.getValues(1)};
        }
    `} cursor: ${props => (props.active ? 'default' : 'pointer')};
    ${props =>
        `transition: padding ${props.theme.transitions.timeEasing
            .default};`} width: 100%;
`
export const MobileLabel = styled.div`text-align: center;`



// WEBPACK FOOTER //
// ./app/features/marketing/SectionCycler/styled-components/index.js