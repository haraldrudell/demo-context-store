import styled from 'styled-components'

export const AudioPlayerContainer = styled.div`
    ${props => `
    display: flex;
    position: relative;
    align-items: stretch;
    user-select: none;
    border: 1px solid ${props.theme.colors.gray8};

    ${props.variant === 'VARIANT_SQUARE'
        ? `
        flex-direction: column;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
       `
        : ''}

    ${props.variant === 'VARIANT_STACKED' ? `flex-direction: column;` : ''}
`};
`

export const PlayerControlButtons = styled.div`
    ${props => `
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;

    ${props.variant === 'VARIANT_SQUARE'
        ? `
        margin-top: auto;
       `
        : ''}

    ${props.variant === 'VARIANT_WIDE'
        ? `
        margin-top: 4%;
       `
        : ''}
`};
`

export const MainActionButton = styled.div`
    ${props => `
    cursor: pointer;
    height: ${props.theme.units.getValue(7)};
    width: ${props.theme.units.getValue(7)};
`};
`

export const SkipSecondsButton = styled.div`
    cursor: pointer;
    display: inherit;
`

export const TimelineBar = styled.div`
    ${props => `
    z-index: ${props.theme.zIndex.Z_INDEX_1};
    width: 100%;
    cursor: pointer;
`};
`

export const TimelineBackground = styled.div`
    ${props => `
        height: 0.5rem;
        border-radius: 1rem;
        background-color: ${props.theme.colors.gray8};
`};
`

export const TimelineForeground = styled.div`
    ${props => `
        display: flex;
        height: 0.5rem;
        background-color: ${props.theme.colors.gray5};
        border-radius: 1rem;
        transition: width 200ms ease-in-out;
`};
`

export const FloatRight = styled.div`float: right;`

/* Components specific to VARIANT_WIDE */
export const WideThumbnailContainer = styled.div`
    ${props => `
    max-height: 165px;
    max-width: 165px;
    min-height: 125px;
    min-width: 125px;
    width: 28%;
`};
`

export const WideImageBackground = styled.div`
    background-position: center;
    height: 0;
    width: 100%;
    padding-bottom: 100%;
    background-size: cover;
`

/* Components specific to VARIANT_STACKED */
export const StackedThumbnailContainer = styled.div`
    ${props => `
    height: 160px;
    width: 100%;
    overflow: hidden;
`};
`

export const StackedImageBackground = styled.div`
    ${props => `
        background-position: center;
        height: 160px;
        width: 100%;
        overflow: hidden;

        // To avoid the edges looking embossed
        padding: ${props.theme.units.getValue(2)};
        margin: -${props.theme.units.getValue(2)};
        filter: blur(${props.theme.units.getValue(2)});
        background-size: cover;
        z-index: 1;
`};
`

export const StackedThumbnailImage = styled.div`
    width: 100%;
    height: 160px;
    position: absolute;
    top: 0;
`

export const StackedThumbnailImageElement = styled.img`
    display: block;
    margin: 0 auto;
    height: 160px;
    width: auto;
    position: relative;
`

/* Components specific to VARIANT_SQUARE */

export const SquareThumbnailContainer = styled.div`
    ${props => `
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
`};
`

export const SquareImageBackground = styled.div`
    ${props => `
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-position: center;
    overflow: hidden;

    // To avoid the edges looking embossed
    padding: ${props.theme.units.getValue(2)};
    margin: -${props.theme.units.getValue(2)};
    filter: blur(${props.theme.units.getValue(2)});
    background-size: cover;
    z-index: 1;
`};
`

export const SquareThumbnailImage = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 2;
`



// WEBPACK FOOTER //
// ./app/components/AudioPlayer/styled-components/index.jsx