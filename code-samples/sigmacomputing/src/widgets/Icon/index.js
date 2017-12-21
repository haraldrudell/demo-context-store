// @flow
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { color, space } from 'styles/system';

import icons from './icons';

type Props = {
  className?: string,
  size?: string,
  type: string
};

const iconStyle = css`
  position: relative;
  top: -0.0625em;
  display: inline-block;
  height: 1em;
  width: 1em;
  vertical-align: middle;
  pointer-events: none;
`;

function Base(props: Props) {
  const { className = '', type } = props;
  const RawIcon = icons[type];
  if (!RawIcon) return null;
  return <RawIcon className={`${iconStyle} ${className}`} />;
}

const Icon = styled(Base)`
  ${space};
  ${color};
  ${props =>
    props.size &&
    css`
      height: ${props.size};
      width: ${props.size};
    `};
`;
Icon.displayName = 'Icon';
export default Icon;



// WEBPACK FOOTER //
// ./src/widgets/Icon/index.js