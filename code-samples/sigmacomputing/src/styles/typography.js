// @flow

import { css } from 'react-emotion';
import facepaint from 'facepaint';

const mq = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 920px)',
  '@media(min-width: 1120px)'
]);

export const fontSizes = [12, 14, 16, 18, 20, 24, 32, 48, 64];

export const weights = {
  light: 300,
  regular: 400,
  semiBold: 600,
  bold: 700
};

export const families = {
  primary: '"Source Sans Pro", sans-serif',
  formula:
    '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  table:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Robot", "Helvetica Neue", Helvetica, sans-serif'
};

const web1 = css(
  mq({
    fontFamily: families.primary,
    lineHeight: 1,
    fontSize: ['30px', '30px', '60px', '60px'],
    fontWeight: '700'
  })
);

const web2 = css(
  mq({
    fontFamily: families.primary,
    lineHeight: 1,
    fontSize: ['24px', '24px', '30px', '30px'],
    fontWeight: weights.semiBold
  })
);

const web4 = css`
  font-family: ${families.primary};
  font-size: 18px;
`;

const display1 = css`
  font-family: ${families.primary};
  font-size: 38px;
  font-weight: ${weights.regular};
`;

const header1 = css`
  font-family: ${families.primary};
  font-size: 30px;
  font-weight: ${weights.regular};
`;

const header2 = css`
  font-family: ${families.primary};
  font-size: 24px;
  font-weight: ${weights.regular};
`;

const header3 = css`
  font-family: ${families.primary};
  font-size: 20px;
  font-weight: ${weights.regular};
`;

const header4 = css`
  font-family: ${families.primary};
  font-size: 16px;
  font-weight: ${weights.semiBold};
`;

const header5 = css`
  font-family: ${families.primary};
  font-size: 14px;
  font-weight: ${weights.semiBold};
`;

const header6 = css`
  font-family: ${families.primary};
  font-size: 12px;
  font-weight: ${weights.semiBold};
`;

const bodyLarge = css`
  font-family: ${families.primary};
  font-size: 16px;
  font-weight: ${weights.light};
`;

const bodyMedium = css`
  font-family: ${families.primary};
  font-size: 14px;
  font-weight: ${weights.regular};
`;

const bodySmall = css`
  font-family: ${families.primary};
  font-size: 12px;
  font-weight: ${weights.regular};
`;

const formula = css`
  font-family: ${families.formula};
  font-size: 14px;
`;

const formulaSmall = css`
  font-family: ${families.formula};
  font-size: 12px;
`;

const table = css`
  font-family: ${families.table};
  font-size: 12px;
  font-feature-settings: 'tnum', 'lnum';
`;

export default {
  web1,
  web2,
  web4,

  display1,

  header1,
  header2,
  header3,
  header4,
  header5,
  header6,

  bodyLarge,
  bodyMedium,
  bodySmall,

  formula,
  formulaSmall,

  table
};



// WEBPACK FOOTER //
// ./src/styles/typography.js