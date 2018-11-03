/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createGlobalStyle, css} from 'styled-components'
import { bodyDefaults, body1 } from './bodyStyles'

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

export default {
  name: 'Evening', theme: {
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
  }
}
