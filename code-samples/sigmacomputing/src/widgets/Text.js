// @flow
import styled, { css } from 'react-emotion';

import Widget from './Widget';
import { weights } from 'styles/typography';

const TextBase = tag => styled(Widget(tag))`
  ${props =>
    props.align &&
    css`
      text-align: ${props.align};
    `};
  ${props =>
    props.italic &&
    css`
      font-style: italic;
    `};
  ${props =>
    props.truncate &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `};
  ${props =>
    props.semiBold &&
    css`
      font-weight: ${weights.semiBold};
    `};
  ${props =>
    props.bold &&
    css`
      font-weight: ${weights.bold};
    `};
`;

const Text = TextBase('div');
Text.displayName = 'Text';

const TextSpan = TextBase('span');
TextSpan.displayName = 'TextSpan';

export { Text, TextSpan };



// WEBPACK FOOTER //
// ./src/widgets/Text.js