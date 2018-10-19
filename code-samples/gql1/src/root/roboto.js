/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createGlobalStyle} from 'styled-components'
import robotolatin300woff from 'typeface-roboto/files/roboto-latin-300.woff'
import robotolatin300woff2 from 'typeface-roboto/files/roboto-latin-300.woff2'
import robotolatin300italicwoff from 'typeface-roboto/files/roboto-latin-300italic.woff'
import robotolatin300italicwoff2 from 'typeface-roboto/files/roboto-latin-300italic.woff2'
import robotolatin400woff from 'typeface-roboto/files/roboto-latin-400.woff'
import robotolatin400woff2 from 'typeface-roboto/files/roboto-latin-400.woff2'
import robotolatin400italicwoff from 'typeface-roboto/files/roboto-latin-400italic.woff'
import robotolatin400italicwoff2 from 'typeface-roboto/files/roboto-latin-400italic.woff2'
import robotolatin500woff from 'typeface-roboto/files/roboto-latin-500.woff'
import robotolatin500woff2 from 'typeface-roboto/files/roboto-latin-500.woff2'
import robotolatin500italicwoff from 'typeface-roboto/files/roboto-latin-500italic.woff'
import robotolatin500italicwoff2 from 'typeface-roboto/files/roboto-latin-500italic.woff2'

export default createGlobalStyle`
/* roboto-300normal - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-display: swap;
  font-weight: 300;
  src:
    local('Roboto Light '),
    local('Roboto-Light'),
    url(${robotolatin300woff2}) format('woff2'), /* Super Modern Browsers */
    url(${robotolatin300woff}) format('woff'); /* Modern Browsers */
}

/* roboto-300italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-display: swap;
  font-weight: 300;
  src:
    local('Roboto Light italic'),
    local('Roboto-Lightitalic'),
    url(${robotolatin300italicwoff2}) format('woff2'), /* Super Modern Browsers */
    url(${robotolatin300italicwoff}) format('woff'); /* Modern Browsers */
}

/* roboto-400normal - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src:
    local('Roboto Regular '),
    local('Roboto-Regular'),
    url(${robotolatin400woff2}) format('woff2'), /* Super Modern Browsers */
    url(${robotolatin400woff}) format('woff'); /* Modern Browsers */
}

/* roboto-400italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src:
    local('Roboto Regular italic'),
    local('Roboto-Regularitalic'),
    url(${robotolatin400italicwoff2}) format('woff2'), /* Super Modern Browsers */
    url(${robotolatin400italicwoff}) format('woff'); /* Modern Browsers */
}

/* roboto-500normal - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src:
    local('Roboto Medium '),
    local('Roboto-Medium'),
    url(${robotolatin500woff2}) format('woff2'), /* Super Modern Browsers */
    url(${robotolatin500woff}) format('woff'); /* Modern Browsers */
}

/* roboto-500italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-display: swap;
  font-weight: 500;
  src:
    local('Roboto Medium italic'),
    local('Roboto-Mediumitalic'),
    url(${robotolatin500italicwoff2}) format('woff2'), /* Super Modern Browsers */
    url(${robotolatin500italicwoff}) format('woff'); /* Modern Browsers */
}
`
