import styled, { css } from 'styled-components'

import SIZE_TO_UNITS from 'constants/sizes'

import Block from 'components/Layout/Block'

import helpers from 'styles/themes/helpers'
const { components, units, zIndex } = helpers

const { getContainerStyle, getHandleStyle, headerStyle } = components.dropdown

const getHeight = size => `
    max-height: ${units.getValue(SIZE_TO_UNITS[size] * 20)};
`
export const Wrapper = styled(Block)`
    ${props => props.fluidWidth && 'width: 100%'};
    align-self: center;
`

export const DropdownHandle = styled.div`
    ${props =>
        !props.hasCustomHandle &&
        getHandleStyle(props.borderColor, props.isOpen)} min-width: ${props =>
            props.minWidth && units.getValue(props.minWidth)};
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`

export const sharedDropdownContainerStyles = css`
    ${props => props.size && getHeight(props.size)} ${getContainerStyle(
            'gray4',
        )} box-sizing: border-box;
    overflow: hidden;
    z-index: ${zIndex.Z_INDEX_9()};
    ${props => (props.grow ? 'min-width: 100%;' : 'width: 100%;')};
`
export const DropdownContainer = styled(Block)`
${sharedDropdownContainerStyles}
border-top: ${props =>
    `${props.theme.strokeWidths.default} solid ${props.theme.colors['gray5']};`}
transform: translateY(-${props => props.theme.strokeWidths.default});
`

export const DropdownHeader = styled(Block)`
    ${headerStyle};
`



// WEBPACK FOOTER //
// ./app/components/Dropdown/styled-components/index.js