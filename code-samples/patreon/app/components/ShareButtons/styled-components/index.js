import styled from 'styled-components'
import Color from 'color'

const colorForSocialNetworkName = {
    facebook: '#3B5998',
    twitter: '#55ACEE',
    tubmlr: '#36465d',
    pinterest: '#BD081C',
    google: '#DB4437',
}

const hoverColorForSocialNetworkName = socialNetworkName =>
    Color(colorForSocialNetworkName[socialNetworkName]).lighten(0.03).string()

export const SocialButton = styled.a`
    text-decoration: none;
    display: inline-block;
    box-sizing: border-box;
    margin: 5px 0;

    svg,
    span {
        transition: all 100ms ease-in-out;
    }

    &:hover {
        span {
            color: ${props =>
                hoverColorForSocialNetworkName(
                    props.socialNetworkName,
                )} !important;
        }

        svg {
            fill: ${props =>
                hoverColorForSocialNetworkName(props.socialNetworkName)};
        }
    }
`



// WEBPACK FOOTER //
// ./app/components/ShareButtons/styled-components/index.js