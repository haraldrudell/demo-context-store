// @flow
import styled from 'react-emotion';

import {
  border,
  color,
  font,
  space,
  width,
  fontSize,
  fontWeight
} from 'styles/system';

export default (tag: string) => styled(tag)`
  ${width};
  ${space};
  ${border};
  ${color};
  ${font};
  ${fontWeight};
  ${fontSize};
`;



// WEBPACK FOOTER //
// ./src/widgets/Widget.js