import styled, { css } from 'styled-components'
import Color from 'color'

const _fallbackImageStyles = props =>
    props.fallbackImageSrcSet &&
    css`
    ${props.theme.responsive.cssPropsForResolutionValues(
        props.fallbackImageSrcSet,
        'background-image',
    )};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`

export const HeaderVideoWrapper = styled.div`
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
    ${_fallbackImageStyles} &:after {
        background-color: ${props =>
            Color(props.theme.colors.gray1).fade(0.75).string()};
        bottom: 0;
        content: '';
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
    }
`



// WEBPACK FOOTER //
// ./app/features/marketing/BannerWithVideo/styled-components/index.js