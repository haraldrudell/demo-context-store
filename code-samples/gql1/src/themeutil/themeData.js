/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createGlobalStyle} from 'styled-components'

export function getThemeData() {
  return {
    theme: 0,
    themes: [{value: 0, name: 'Default Theme', theme: {
      BodyStyle: createGlobalStyle`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
            background-color: #fce5cd;
        }
      `,
      color: 'green',
      backgroundColor: '#fce5cd',
    }}, {value: 1, name: 'Alternate Theme', theme: {
      BodyStyle: createGlobalStyle`
        body {
          font-family: "Times";
          color: red
          background-color: black;
        }
      `,
      color: 'red',
      backgroundColor: 'black',
    }}],
  }
}
