import styled from 'styled-components'
import Color from 'color'
import {
    HOVER_TRANSITION_TIME,
    HOVER_TRANSITION_EASE,
} from 'styles/shared/hover'

export const PlayButton = styled.button`
    appearance: none;
    background: none;
    border: 0;
    display: flex;

    width: 15%;
    max-width: ${props => props.theme.units.getValue(10)};
    margin-left: auto;
    margin-right: auto;

    opacity: 0.9;
    transition: all ${HOVER_TRANSITION_TIME} ${HOVER_TRANSITION_EASE};

    &:focus {
        opacity: 1;
    }
`

export const IconOverlayContainer = styled.div`
    display: flex;
    position: absolute;
    left: 0px;
    bottom: 3px;
    right: 0px;
    top: 0px;

    background: ${props =>
        Color(props.theme.colors.dark)
            .alpha(0.1)
            .string()};
    cursor: pointer;

    &:hover ${PlayButton} {
        opacity: 1;
    }
`



// WEBPACK FOOTER //
// ./app/features/posts/MediaEmbed/styled-components/index.js