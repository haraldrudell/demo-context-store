import styled from 'styled-components'

import helpers from 'styles/themes/helpers'
const { colors, components, strokeWidths, text, units } = helpers

export const SearchMenu = styled.div`
    width: 100%;
    background-color: ${colors.white()};

    border: ${strokeWidths.default()} solid ${colors.gray5()};
    border-top: 2px solid ${colors.gray5()};

    position: absolute;
    top: ${components.navigation.height()};
    left: -${strokeWidths.default()};

    font-size: ${text.getSize(1)};

    color: ${colors.gray1()};
`

const selectedResult = props => `
    background-color: ${props.theme.colors.pollFill};
    &:last-child {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }
`

const resultLink = () => props => `
    width: 100%;
    color: ${props.theme.colors.gray3};
    font-size: ${props.theme.text.getSize(1)};
    font-weight: bold;
    box-sizing: border-box;
    cursor: pointer;
    border-bottom: 1px solid ${props.theme.colors.gray6};
`

export const CampaignResultLink = styled.a`
    ${resultLink()};
    padding: ${units.getValues([1, 2])};

    display: flex;
    flex-direction: row;
    align-items: center;

    ${props => (props.selected ? selectedResult(props) : ' ')};
`

export const PostResultLink = styled.a`
    ${resultLink()} padding: ${units.getValues([1, 2])};

    display: block;

    ${props => (props.selected ? selectedResult(props) : ' ')};
    &:last-child {
        border-bottom: 0;
    }
`

export const MoreResults = styled.div`
    display: block;
    width: 100%;
    padding: ${units.getValues([1, 2])};
    box-sizing: border-box;
    cursor: pointer;

    ${props => (props.selected ? selectedResult(props) : ' ')};
    &:hover {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }
`

export const CampaignAvatar = styled.div`
    margin-right: ${units.getValue(2)};
    /* one-line */
`

export const CampaignDetails = styled.div`
    min-width: 0;
    /* one-line */
`

export const EmptySearchResultsList = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    padding: ${units.getValues([4, 2])};
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/SearchResults/styled-components/index.js