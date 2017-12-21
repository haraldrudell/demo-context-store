// @flow

import styled from 'react-emotion';
import defaultProps from 'recompose/defaultProps';

import Widget from './Widget';

const Divider = defaultProps({
  color: 'currentColor',
  mt: 2,
  mb: 2
})(styled(Widget('hr'))`
  border: 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`);
Divider.displayName = 'Divider';

export default Divider;



// WEBPACK FOOTER //
// ./src/widgets/Divider.js