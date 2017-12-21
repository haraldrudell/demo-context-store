// @flow
import * as React from 'react';
import { css, keyframes } from 'react-emotion';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const spinnerStyle = css`
  display: inline-block;
  vertical-align: middle;
  height: 1.25em;
  margin-right: 0.5em;
  stroke: currentColor;
  animation: ${spin} 1s infinite linear;
`;

const Spinner = () => (
  <svg className={spinnerStyle} viewBox="0 0 64 64">
    <circle
      strokeWidth="4"
      strokeDasharray="128"
      strokeDashoffset="8"
      r="26"
      cx="32"
      cy="32"
      fill="none"
    />
  </svg>
);

export default Spinner;



// WEBPACK FOOTER //
// ./src/widgets/Spin/index.js