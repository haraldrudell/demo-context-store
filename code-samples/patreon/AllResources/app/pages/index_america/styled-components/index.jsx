import styled from 'styled-components'

export const BannerButtonContent = styled.div`
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            { xs: props.theme.units.getValue(20), sm: 'auto' },
            'width',
        )};
`

export const Tagline = styled.div`
    max-width: ${props => props.theme.units.getValue(80)};
`

export const CategoryContent = styled.div`
    align-items: center;
    display: flex;
    padding: ${props => props.theme.units.getValues([1.5, 0.5])};
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            { xs: '100%', sm: props.theme.units.getValue(25) },
            'width',
        )};
`



// WEBPACK FOOTER //
// ./app/pages/index_america/styled-components/index.jsx