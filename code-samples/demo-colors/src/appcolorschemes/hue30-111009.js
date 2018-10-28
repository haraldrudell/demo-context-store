/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
/*
for the palette, we want a has a list of hash color values
we want classifications: color, background
we want history how the palette was designed

Find the hue30 theme on c87:
find ~ -iname "*hue30*"
~/.vscode/extensions/hue30theme/hue30theme.tmTheme
all colors:

scale svg discussion
https://css-tricks.com/scale-svg/
*/

export default {
  date: '2011-10-09T09:08:23.000Z',
  name: 'hue30',
  scheme: [{
    hex: '#fce5cd',
    use: 'bg',
    name: 'bisque'
  },{
    hex: '#0055ff',
    use: 'fgComment',
  },{
    hex: '#000000',
    use: 'fg',
  },{
    hex: '#cde4fc',
  },{
    hex: '#007bff',
  },{
    hex: '#ff0000',
  },{
    hex: '#00ff00',
  },{
    hex: '#003E80',
  },{
    hex: '#ffccff',
  },{
    hex: '#008000',
  },{
    hex: '#ffffcc',
  },{
    hex: '#a6e22e',
  },{
    hex: '#ffff01',
  },{
    hex: '#ffff02',
  },{
    hex: '#ffff05',
  },{
    hex: '#fff0f0',
  }],
  events: [{
    heading: 'Primary Color',
    colors: [{
      hex: '#fce5cd',
      use: 'bg',
      name: 'bisque'
    },{
      hex: '#ffcc66',
    },{
      hex: '#fff0f0',
    },{
      hex: '#000000',
      }],
    texts: [
      'Picked a yellow from a wine bottle and modified it to #ffcc66',
      'Used black as foreground color for high contrast',
      'Changes to a very light pastel, but soon considered this too bright: $fff0f0',
      'Restarted with hue 30 for the first color, saturation about 90% and lightness about 90%',
    ],
  },{
    heading: 'Additional Colors',
    texts: [
      'Selected background is the first color with hue 180 degrees off',
      'Various text colors in 90 degree hue steps with saturation 100% lightness 25%',
    ],
    colors: [{
      hex: '#003e80',
    },{
      hex: '#800080',
    },{
      hex: '#008000',
    }],
  }],
}
