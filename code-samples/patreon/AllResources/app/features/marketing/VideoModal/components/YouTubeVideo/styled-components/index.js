import styled from 'styled-components'

const Iframe = styled.iframe`
    display: block;
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            {
                xs: '100%',
                sm: props.theme.units.getValue(64),
                md: props.theme.units.getValue(80),
                lg: props.theme.units.getValue(110),
            },
            'width',
        )};
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            {
                xs: props.theme.units.getValue(21),
                sm: props.theme.units.getValue(36),
                md: props.theme.units.getValue(45),
                lg: props.theme.units.getValue(62),
            },
            'height',
        )};
`

export { Iframe }



// WEBPACK FOOTER //
// ./app/features/marketing/VideoModal/components/YouTubeVideo/styled-components/index.js