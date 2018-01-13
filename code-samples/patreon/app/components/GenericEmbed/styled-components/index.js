import styled from 'styled-components'

export const ImgContainer = styled.div`
    max-height: 500px;
    overflow-y: hidden;

    img {
        width: 100%;
    }
`

export const EmbedDetails = styled.div`
    padding: ${props => props.theme.units.getValue(2)};
    & > * {
        &:not(:last-child) {
            margin-bottom: ${props => props.theme.units.getValue(1)};
        }
    }
`



// WEBPACK FOOTER //
// ./app/components/GenericEmbed/styled-components/index.js