// @flow
//
// This is a simplified version of https://github.com/jxnblk/styled-system.
//
// The main difference is that it uses a 4px base alignment instead of 8px and
// hardcodes this rather than using a theming system. It doesn't support tiered
// responsive styles.

import colors from './colors';
import typography, { fontSizes } from './typography';

const num = n => typeof n === 'number' && !isNaN(n);
const neg = n => n < 0;
const px = n => (num(n) ? n + 'px' : n);

const getProperties = (properties, key, suffix = '') => {
  const [a, b] = key.split('');
  const prop = properties[a];
  const dirs = directions[b] || [''];
  return dirs.map(dir => prop + dir + suffix);
};

const spaceProperties = {
  m: 'margin',
  p: 'padding'
};

const borderProperties = {
  b: 'border'
};

const directions = {
  t: ['Top'],
  r: ['Right'],
  b: ['Bottom'],
  l: ['Left'],
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom']
};

const SPACE_REG = /^[mp][trblxy]?$/;
const BORDER_REG = /^b[trblxy]?$/;

// 4px grid alignment
const BASE_SPACING = 4;

function scale(n) {
  if (n === 0) return 0;
  return BASE_SPACING * Math.pow(2, Math.abs(n) - 1);
}

function widthX(x) {
  if (!num(x)) return x;
  if (x <= 0) return 0;
  return px(scale(x));
}

export function width(props: Object) {
  const x = props.width;
  if (!x) return null;
  return {
    width: widthX(x)
  };
}

function spaceX(x) {
  if (!num(x)) return x;
  if (x === 0) return 0;
  const sign = neg(x) ? -1 : 1;
  return px(sign * scale(x));
}

export function space(props: Object) {
  const keys = Object.keys(props)
    .filter(key => SPACE_REG.test(key))
    .sort();

  return keys.map(key => {
    const val = props[key];
    const p = getProperties(spaceProperties, key);
    return p.reduce((a, b) => {
      return Object.assign(a, {
        [b]: spaceX(val)
      });
    }, {});
  });
}

export const colorX = (x: string) => colors[x] || x;

export function color(props: Object) {
  const col = props.color != null ? { color: colorX(props.color) } : null;
  const bg = props.bg != null ? { backgroundColor: colorX(props.bg) } : null;
  const opacity = props.opacity != null ? { opacity: props.opacity } : null;

  return {
    ...col,
    ...bg,
    ...opacity
  };
}

export function fontWeight(props: Object) {
  return props.fontWeight;
}

export function fontSize(props: Object) {
  return props.fontSize ? fontSizes[props.fontSize] : null;
}

export function font(props: Object) {
  return props.font ? typography[props.font] : null;
}

export function border(props: Object) {
  const keys = Object.keys(props)
    .filter(key => BORDER_REG.test(key))
    .sort();
  if (keys.length === 0 && !props.borderRadius) return null;

  const borderWidth: {} = keys.reduce(
    (accum: {}, key: string) => {
      const val = props[key];
      const p = getProperties(borderProperties, key, 'Width');
      return p.reduce((a, b) => {
        return Object.assign(a, {
          [b]: px(val)
        });
      }, accum);
    },
    { borderWidth: 0 }
  );

  const radius = px(props.borderRadius || 0);

  return {
    borderStyle: 'solid',
    borderColor: colorX(props.borderColor || 'currentColor'),
    borderRadius: radius,
    ...borderWidth
  };
}



// WEBPACK FOOTER //
// ./src/styles/system.js