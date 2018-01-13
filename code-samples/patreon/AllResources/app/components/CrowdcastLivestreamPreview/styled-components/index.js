import styled from 'styled-components'
import Color from 'color'
import helpers from 'styles/themes/helpers'

import Block from 'components/Layout/Block'

const BLUR_RADIUS = '20px'
const LARGE_RADIUS_TO_MAKE_ELEMENT_ROUND = '200px'

export const BackgroundImage = styled.div`
    background-position: center;
    background-image: url("${props => props.src}");
    padding: ${BLUR_RADIUS};
    margin: 0 -${BLUR_RADIUS};
    filter: blur(${BLUR_RADIUS});
    background-size: cover;
    overflow: hidden;
    width: 100%;
    padding-bottom: 38%;
    opacity: .4;
`

export const EditPhoto = styled.div`
    margin: ${props => props.theme.units.getValues(2)};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${props =>
        Color(props.theme.colors.gray1)
            .fade(0.2)
            .string()};
    border-radius: ${LARGE_RADIUS_TO_MAKE_ELEMENT_ROUND};
    cursor: pointer;
    border: 4px solid white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ${props => (props.hidden ? 'display: none' : '')};
`

export const AvatarOutline = styled(Block)`
    border-color: ${props =>
        Color(props.theme.colors.white)
            .fade(props.fade)
            .string()};
`

export const PoweredBy = styled.div`
    opacity: 0.7;
`

export const PreviewContent = styled.div`
    z-index: ${helpers.zIndex.Z_INDEX_1()};
    position: relative;
`

export const HiddenInput = styled.input`
    cursor: pointer;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: ${helpers.zIndex.Z_INDEX_1()};
`

export const ButtonWrapper = styled.div`
    ${props => (props.disabled ? 'cursor: not-allowed' : '')};
`



// WEBPACK FOOTER //
// ./app/components/CrowdcastLivestreamPreview/styled-components/index.js