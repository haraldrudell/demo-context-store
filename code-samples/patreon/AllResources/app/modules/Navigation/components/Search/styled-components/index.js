import styled from 'styled-components'

import helpers from 'styles/themes/helpers'
const { colors, units } = helpers

const SEARCH_INPUT_UNITS = 40

const searchBorder = color => props =>
    `${props.theme.strokeWidths.default} solid ${props.theme.colors[color]}`

export const Form = styled.form`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    border-left: ${searchBorder('gray6')};
    border-right: ${searchBorder('gray6')};

    padding: ${units.getValues([0, 2])};
    margin-right: ${units.getValue(1)};

    > input {
        transition: all 200ms ease-in;
        width: ${units.getValue(SEARCH_INPUT_UNITS / 4)};
        text-overflow: ellipsis;

        color: ${colors.gray1()};
        background: ${colors.white()};

        padding: ${units.getValues([0, 2])};

        font-size: ${props => props.theme.text.getSize(1)};
        font-weight: bold;

        border: none;
        height: 32px;

        ${props =>
            props.isOpen
                ? props.theme.responsive.cssPropsForBreakpointValues(
                      { lg: props.theme.units.getValue(SEARCH_INPUT_UNITS) },
                      'width',
                  )
                : ''};

        &::placeholder {
            color: ${colors.gray4()};
            font-weight: normal;
        }
    }
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/Search/styled-components/index.js