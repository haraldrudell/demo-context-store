/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createGlobalStyle, css} from 'styled-components'

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

const evening = {
  black: '#000000',
  ginger: '#ae6000',
  sealBrown: '#512c00',
  vividLimeGreen: '#adcc00',
  blackBean: '#3f2300',
  pakistanGreen: '#006600',
  darkGreen: '#003f00',
  chocolate: '#7f3f00',
  saddleBrown: '#662d00',
}
/*const uses =  {
  background: evening.black,
  color: evening.ginger,
  logoSpray: evening.sealBrown,
  defaultBackground: evening.vividLimeGreen,
  defaultBackgroundFocus: evening.blackBean,
  primaryBackground: evening.pakistanGreen,
  primaryBackgroundFocus: evening.darkGreen,
  secondaryBackground: evening.chocolate,
  secondaryBackgroundFocus: evening.saddleBrown,
}*/

const bodyDefaults = css`
  font-size: 15pt;
`
const body1 = css`
  font-size: 15pt;
`
export function getThemeData() {
  return {
    theme: 0,
    themes: [{value: 0, name: 'Default Theme', theme: {
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
    }}, {value: 1, name: 'Evening', theme: {
      BodyStyle: createGlobalStyle`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
            background-color: ${evening.black};
            color: ${evening.ginger};
            ${bodyDefaults}
        }
      `,
      body1,
      color: evening.ginger,
      backgroundColor: evening.black,
      logoSpray: evening.sealBrown,
      logoText: evening.ginger,
      buttonDefault: css`
        color: ${evening.ginger};
        background-color: ${evening.sealBrown};
        :hover {
          background-color: ${evening.blackBean};
        }
      `,
      buttonPrimary: css`
        background-color: ${evening.pakistanGreen};
        color: black;
        :hover {
          background-color: ${evening.darkGreen};
        }
      `,
      buttonSecondary: css`
      color: black;
      background-color: ${evening.chocolate};
        :hover {
          background-color: ${evening.saddleBrown};
        }
      `,
    }}/*, {value: 2, name: 'Alternate Theme', theme: {
      BodyStyle: createGlobalStyle`
        body {
          font-family: "Times";
          color: red
          background-color: black;
          ${bodyDefaults}
        }
      `,
      defaultFont: css`font-family: "Times";`,
      body1,
      color: 'red',
      backgroundColor: 'black',
    }}*/],
  }
}
