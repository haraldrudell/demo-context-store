// @flow
//
// This is a simplified version of https://github.com/jxnblk/grid-styled, using
// emotion rather than styled-components.

import styled, { css } from 'react-emotion';

import {
  border,
  color,
  font,
  space,
  width,
  fontSize,
  fontWeight
} from 'styles/system';

const flex = props =>
  props.flex &&
  css`
    flex: ${props.flex};
  `;

const flexGrow = props => {
  if (props.flexGrow === true)
    return css`
      flex: 1 1 0%;
      min-width: 0;
    `;
  if (props.flexGrow != null)
    return css`
      flex-grow: ${props.flexGrow};
    `;
};

const flexOrder = props =>
  props.order != null &&
  css`
    order: ${props.order};
  `;

const Base = styled('div')`
  ${width};
  ${space};
  ${border};
  ${color};
  ${font};
  ${fontWeight};
  ${fontSize};
  ${flex};
  ${flexGrow};
  ${flexOrder};
`;

const boxInline = props =>
  props.inline &&
  css`
    display: inline-block;
  `;

const Box = styled(Base)`
  ${boxInline};
`;
Box.displayName = 'Box';

const flexDisplay = props =>
  css`
    display: ${props.inline ? 'inline-flex' : 'flex'};
  `;
const flexColumn = props =>
  props.column &&
  css`
    flex-direction: column;
  `;
const flexAlign = props =>
  props.align &&
  css`
    align-items: ${props.align};
  `;
const flexJustify = props =>
  props.justify &&
  css`
    justify-content: ${props.justify};
  `;
const flexWrap = props =>
  props.wrap &&
  css`
    flex-wrap: wrap;
  `;

const Flex = styled(Base)`
  ${flexDisplay};
  ${flexColumn};
  ${flexAlign};
  ${flexJustify};
  ${flexWrap};
`;
Flex.displayName = 'Flex';

export { Box, Flex };



// WEBPACK FOOTER //
// ./src/widgets/Box.js