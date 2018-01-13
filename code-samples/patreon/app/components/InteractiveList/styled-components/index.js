import styled, { css } from 'styled-components'
import helpers from 'styles/themes/helpers'
const { colors, strokeWidths, transitions } = helpers

const HOVER_COLOR = colors.sky ? colors.sky() : colors.gray7()
const isSelectable = props =>
    !props.disabled &&
    css`
    &:hover {
        cursor: pointer;
        background-color: ${HOVER_COLOR};
    }
`

const isHighlighted = props =>
    props.isHighlighted &&
    css`
    background-color: ${colors.gray7()};
`
export const sharedListItemStyles = css`
    transition: ${transitions.default()};
    user-select: none;
    ${isSelectable}
    ${isHighlighted}

    ${props =>
        !props.hideLines &&
        css`
        &:not(:last-child) {
            border-bottom: ${strokeWidths.default()} solid ${colors.gray8()};
        }
    `}
`
export const ListItem = styled.li`${sharedListItemStyles};`



// WEBPACK FOOTER //
// ./app/components/InteractiveList/styled-components/index.js