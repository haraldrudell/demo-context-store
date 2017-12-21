// @flow

import styled from 'react-emotion';
import defaultProps from 'recompose/defaultProps';

import { color, font, space } from 'styles/system';

const Label = styled('label')`
  display: flex;
  align-items: center;
  width: 100%;
  ${color};
  ${font};
  ${space};
`;

Label.displayName = 'Label';

export default defaultProps({
  font: 'header5'
})(Label);



// WEBPACK FOOTER //
// ./src/widgets/Label.js