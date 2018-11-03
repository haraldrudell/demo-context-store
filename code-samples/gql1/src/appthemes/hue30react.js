/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createGlobalStyle, css} from 'styled-components'
import { bodyDefaults, body1 } from './bodyStyles'

const hue30react = {
  bisque: '#fce5cd',
  black: '#000000',
  japaneseViolet: '#592c59',
  teaRose: '#f9c7c7',
  nadeshikoPink: '#f9a8c5',
  azureishWhite: '#cde4fc',
  purple: '#800080',
  pakistanGreen: '#006600',
  darkGreen: '#003f00',
  mediumTuscanRed: '#7f3f3f',
  liver: '#662d2d',
  lightMossGreen: '#adccad',
  darkSeaGreen: '#8eb28e',
}
/*const uses =  {
  background: hue30react.bisque,
  color: hue30react.black,
  logoText: hue30react.japaneseViolet,
  logoSpray: hue30react.teaRose,
  logoSpray2: hue30react.nadeshikoPink,
  logoSpray3: hue30react.azureishWhite,
  logoText2: hue30react.purple,
  primaryBackground: hue30react.pakistanGreen,
  primaryBackgroundFocus: hue30react.darkGreen,
  secondaryBackground: hue30react.mediumTuscanRed,
  secondaryBackgroundFocus: hue30react.liver,
  defaultBackground: hue30react.lightMossGreen,
  defaultBackgroundFocus: hue30react.darkSeaGreen,
}*/

export default {
  name: 'Default Theme',
  theme: {
    BodyStyle: createGlobalStyle`
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
          "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
          sans-serif;
          background-color: ${hue30react.bisque};
          ${bodyDefaults}
      }
    `,
    body1,
    backgroundColor: hue30react.bisque,
    logoSpray: hue30react.teaRose,
    logoText: hue30react.japaneseViolet,
    buttonDefault: css`
      background-color: ${hue30react.lightMossGreen};
      :hover {
        background-color: ${hue30react.darkSeaGreen};
      }
    `,
    buttonPrimary: css`
      background-color: ${hue30react.pakistanGreen};
      :hover {
        background-color: ${hue30react.darkGreen};
      }
    `,
    buttonSecondary: css`
      background-color: ${hue30react.mediumTuscanRed};
      :hover {
        background-color: ${hue30react.liver};
      }
    `,
  }
}
