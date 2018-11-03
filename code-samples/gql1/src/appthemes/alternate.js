/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createGlobalStyle, css} from 'styled-components'
import { bodyDefaults, body1 } from './bodyStyles'

export default {
  name: 'Alternate Theme',
  theme: {
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
  }
}
