import styled from 'styled-components'

export const ContentWrapper = styled.div`
    padding: ${props => props.theme.units.getValue(2)};
    text-align: center;
    margin-top: ${props => props.theme.units.getValue(-7)};
`

export const CreatorAvatarContainer = styled.div`
    transform: translateY(${props => props.theme.units.getValue(-5)});
    margin: 0 auto ${props => props.theme.units.getValue(1)} auto;
    width: ${props => props.theme.units.getValue(10)};
`

export const HeroImage = styled.div`
    height: ${props => (props.large ? '138' : '65')}px;

    img {
        max-height: ${props => (props.large ? '138' : '65')}px;
        object-fit: cover;
        width: 100%;
    }
`



// WEBPACK FOOTER //
// ./app/components/CreatorCardContent/styled-components/index.js