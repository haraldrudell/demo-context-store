/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createGlobalStyle, css} from 'styled-components'

/*
hue30 theme
https://coolors.co/b1740f-ffd07b-fdb833-296eb4-1789fc

light off-white hue 30° color
*/
const bisque = '#fce5cd' // light yellow-pink
/*
What is between bisque #fce5cd 30° 19% 99%
and purple #800080 300° 100% 50%
that would be #bf4c69 345° 60% 75% - terrible
then a shaded bisque:
url palette: https://i.pinimg.com/474x/bc/19/a2/bc19a2891ab62a609f4e1ac353337a9a--red-color-palettes-color-palette-fall.jpg
the pink is: TextEdit - format - font - show colors, use pipette
#f9a8c5 339° 33% 98%
*/
const nadeshikoPink = '#f9a8c5'
/*
Default button:
Take the same green hue as for primary button:  120°
Create a light tone by taking brightness to 80%
pale towards gray with saturation to 15%
*/
const lightMossGreen = '#adccad'
/*
hover default button
reduce brightness to 70%
increase saturation to 20%
*/
const darkSeaGreen = '#8eb28e'
/*
Primary button:
90° degrees hue off bisque towards green: 120°
should contrast white text: saturation 100%
brightness down to 40%
*/
const pakistanGreen = '#006600'
/*
onHover should darken pakistanGreen
brightness down to 25%
*/
const darkGreen = '#003f00'
/*
secondary button
material-UI has #f50057 which is very intense hue 339° sat 100% brightness 96%
text is white
- hue 60° off bisque: 330°. No, want it red: 0°
- 300 is purple, too much off red
- much more pale: sat to 30%. No to get red increase: 50%
- darken for the white text: brightness to 50%
https://coolors.co/7f3f3f-fce5cd-662d2d-f50057-171123
*/
const mediumTuscanRed = '#7f3f3f'
/*
secondary onHover: increase saturation +5%
reduce brightness -10%
*/
const liver = '#662d2d'
/*
evening theme: red-green only and low-luminance
using https://coolors.co/ae6000-60d394-aaf683-ffd97d-ff9b85
*/
const ginger = '#ae6000' // text in night theme
const sealBrown = '#512c00' // spraypaint in night theme
/*
buttons: take default theme and set blue to 0
- used seal brown
hover: reduce brightness -5%
*/
//const nightDefault = '#adcc00'
const nightDefaultHover = '#3F2300'
const nightPrimary = '#006600'
const nightPrimaryHover = '#003f00'
const nightSecondary = '#7f3f00'
const nightSecondaryHover = '#662d00'

const bodyDefaults = css`
  font-size: 15pt;
`
const body1 = css`
  font-size: 15pt;
`
/*
Material-UI color scheme
primary button: #3f51b5 231° 65% 71%
primary button onhover: #303f9f 232° 70% 62%
*/
export function getThemeData() {
  return {
    theme: 0,
    themes: [{value: 0, name: 'Default Theme', theme: {
      BodyStyle: createGlobalStyle`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
            background-color: ${bisque};
            ${bodyDefaults}
        }
      `,
      body1,
      backgroundColor: bisque,
      logoSpray: nadeshikoPink,
      buttonDefault: css`
        background-color: ${lightMossGreen};
        :hover {
          background-color: ${darkSeaGreen};
        }
      `,
      buttonPrimary: css`
        background-color: ${pakistanGreen};
        :hover {
          background-color: ${darkGreen};
        }
      `,
      buttonSecondary: css`
        background-color: ${mediumTuscanRed};
        :hover {
          background-color: ${liver};
        }
      `,
    }}, {value: 1, name: 'Evening', theme: {
      BodyStyle: createGlobalStyle`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
            background-color: black;
            color: ${ginger};
            ${bodyDefaults}
        }
      `,
      body1,
      color: ginger,
      backgroundColor: 'black',
      logoSpray: sealBrown,
      logoText: ginger,
      buttonDefault: css`
        color: ${ginger};
        background-color: ${sealBrown};
        :hover {
          background-color: ${nightDefaultHover};
        }
      `,
      buttonPrimary: css`
        background-color: ${nightPrimary};
        color: black;
        :hover {
          background-color: ${nightPrimaryHover};
        }
      `,
      buttonSecondary: css`
      color: black;
      background-color: ${nightSecondary};
        :hover {
          background-color: ${nightSecondaryHover};
        }
      `,
    }}, {value: 2, name: 'Alternate Theme', theme: {
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
    }}],
  }
}
