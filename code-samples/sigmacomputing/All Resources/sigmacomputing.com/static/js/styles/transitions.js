// @flow

import { css } from 'react-emotion';

export const COLLAPSE_MS = 300;

export const collapseTransition = `${COLLAPSE_MS}ms ease-in-out`;

export const collapseOpacity = css`
  transition: opacity ${collapseTransition};
`;

export const collapseHeight = css`
  transition: height ${collapseTransition};
`;



// WEBPACK FOOTER //
// ./src/styles/transitions.js