import styled, { css } from 'styled-components'

import Block from 'components/Layout/Block'
import IconButton from 'components/IconButton'

const _withButtonsRight = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const AlertWrapper = styled(Block)`
    text-align: center;
    line-height: ${props => props.theme.text.getLineHeight(1.5)};
    ${props => props.isDismissable && `position: relative`};
    ${props => props.buttonsRight && _withButtonsRight}
`

const DismissIconButton = styled(IconButton)`
    position: absolute;
    top: ${props => props.theme.units.getValue(2)};
    right: ${props => props.theme.units.getValue(2)};
    display: inline-flex;

    &:hover {
        transition: ${props => props.theme.transitions.default};
        fill: ${props => props.theme.colors.gray6};
    }
`

export { AlertWrapper, DismissIconButton }



// WEBPACK FOOTER //
// ./app/components/Alert/styled-components/index.js