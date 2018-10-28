/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default {
  date: '2018-10-28T09:08:23.000Z',
  name: 'hue30react',
  scheme: [{
    hex: '#fce5cd',
    use: 'background',
    name: 'Bisque'
  },{
    hex: '#000000',
    use: 'color',
    name: 'Black',
  },{
    hex: '#592c59',
    name: 'Japanese Violet',
    use: 'logoText'
  },{
    hex: '#f9c7c7',
    name: 'Tea Rose',
    use: 'logoSpray'
  },{
    hex: '#f9a8c5',
    use: 'logoSpray',
    name: 'Nadeshiko Pink'
  },{
  hex: '#cde4fc',
    use: 'logoSpray',
    name: 'Azureish White'
  },{
    hex: '#800080',
    name: 'Purple',
    use: 'logoText'
  },{
    hex: '#006600',
    name: 'Pakistan Green',
    use: 'Primary Background'
  },{
    hex: '#003f00',
    name: 'Dark Green',
    use: 'Primary Background Focus'
  },{
    hex: '#7f3f3f',
    name: 'Medium Tuscan Red',
    use: 'Secondary Background'
  },{
    hex: '#662d2d',
    name: 'Liver',
    use: 'Secondary Background Focus'
  },{
    hex: '#adccad',
    name: 'Light Moss Green',
    use: 'Default Background'
  },{
    hex: '#8eb28e',
    name: 'Dark Sea Green',
    use: 'Default Background Focus'
  }],
  events: [{
    heading: 'Color and Background',
    colors: [{
      hex: '#fce5cd',
      use: 'background',
      name: 'Bisque'
    },{
      hex: '#000000',
      use: 'color',
      name: 'Black',
    }],
    texts: [
      'Started from hue30 color scheme from 2011',
      'Used bisque and black',
    ],
  },{
    heading: 'Logo on Light Blue',
    colors: [{
      hex: '#cde4fc',
      use: 'logoSpray',
      name: 'Azureish White'
    },{
      hex: '#800080',
      name: 'Purple',
      use: 'logoText'
      }],
    texts: [
      'Used selected-text background Azureish White from hue30 for SprayPaint',
      'Used purple from hue30 for logoText',
    ],
  },{
    heading: 'Logo in Pink',
    texts: [
      'Complementary color combinations are bad',
      'Instead, use hue contrast in steps of 30°',
      'What is between bisque #fce5cd 30° 19% 99% and purple #800080 300° 100% 50%?',
      '#bf4c69 345° 60% 75% - terrible',
      'Googled for a a shaded bisque: https://i.pinimg.com/474x/bc/19/a2/bc19a2891ab62a609f4e1ac353337a9a--red-color-palettes-color-palette-fall.jpg',
      'The pink: TextEdit - format - font - show colors, use pipette: Nadeshiko Pink',
      'Then, move further away from purple in hue to 360°, pale to 20%: Tea Rose',
      'Finally the logo color:',
      'o not want to change hue from 300°',
      '- 270° is too blue',
      'reduce saturation to 50%',
      '- less turn gray and color-less',
      'reduce brightness to 35%',
      '- less turns black and color-less',
      'Japanese Violet',
    ],
    colors: [{
      hex: '#f9a8c5',
      use: 'logoSpray',
      name: 'Nadeshiko Pink'
    },{
      hex: '#f9c7c7',
      name: 'Tea Rose',
      use: 'logoSpray'
    },{
      hex: '#592c59',
      name: 'Japanese Violet',
      use: 'logoText'
    }],
  },{
    heading: 'Material-UI Primary Button',
    texts: [
      'Default color scheme for reference',
      'primary button: #3f51b5 231° 65% 71%',
      'primary button onhover: #303f9f 232° 70% 62%',
    ],
    colors: [{
      hex: '#3f51b5',
    },{
      hex: '#303f9f',
    }],
  },{
    heading: 'Discarded Colors',
    texts: [
      'A previous strategy was to separate hues by 90°',
      'This is concluded to be a color matching that is not preferred',
      'Instead, use hues off background color in steps of 30°',
    ],
    colors: [{
      hex: '#003e80',
    },{
      hex: '#800080',
    },{
      hex: '#008000',
    },{
      name: 'Dodger Blue',
      hex: '#007bff',
    },{
      name: 'Red',
      hex: '#ff0000',
    },{
      name: 'Lime',
      hex: '#00ff00',
    },{
      name: 'Midnight Blue',
      hex: '#003e80',
    },{
      name: 'Lavender',
      hex: '#ffccff',
    },{
      name: 'Green',
      hex: '#008000',
    },{
      name: 'Lemon Chiffon',
      hex: '#ffffcc',
    },{
      name: 'Yellow Green',
      hex: '#a6e22e',
    },{
      name: 'Lavender Blush',
      hex: '#fff0f0',
    }],
  },{
    heading: 'Primary Button',
    texts: [
      'Primary button should be green and Material-UI has text color white',
      '90° degrees hue off bisque towards green: 120°',
      'should contrast white text: saturation 100%',
      'brightness down to 40%: Pakistan Green',
      'onHover should darken pakistanGreen',
      'brightness down to 25%: Dark Green',
    ],
    colors: [{
      hex: '#006600',
      name: 'Pakistan Green',
      use: 'Primary Background'
    },{
      hex: '#003f00',
      name: 'Dark Green',
      use: 'Primary Background Focus'
    }],
  },{
    heading: 'Secondary Button',
    texts: [
      'material-UI has #f50057 which is very intense hue 339° sat 100% brightness 96%',
      'text is white',
      '- hue 60° off bisque: 330°. No, want it red: 0°',
      '- 300 is purple, too much off red',
      '- much more pale: sat to 30%. No to get red increase: 50%',
      '- darken for the white text: brightness to 50%: Medium Tuscan Red',
      'https://coolors.co/7f3f3f-fce5cd-662d2d-f50057-171123',
      'secondary onHover: increase saturation +5%',
      'reduce brightness -10%',
    ],
    colors: [{
      hex: '#7f3f3f',
      name: 'Medium Tuscan Red',
      use: 'Secondary Background'
    },{
      hex: '#662d2d',
      name: 'Liver',
      use: 'Secondary Background Focus'
    }],
},{
  heading: 'Default Button',
  texts: [
    'Take the same green hue as for primary button:  120°',
    'Create a light tone by taking brightness to 80%',
    'pale towards gray with saturation to 15%: Light Moss Green',
    'hover default button',
    'reduce brightness to 70%',
    'increase saturation to 20%: Dark Sea Green',
  ],
  colors: [{
    hex: '#adccad',
    name: 'Light Moss Green',
    use: 'Default Background'
  },{
    hex: '#8eb28e',
    name: 'Dark Sea Green',
    use: 'Default Background Focus'
  }],
}],
}
