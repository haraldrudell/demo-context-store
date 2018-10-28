/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent } from 'react'
import Color from 'color'
import styled from 'styled-components'

const Pre = styled.div`
  display: inline-block;
  white-space: pre;
`
export default class ColorPalette extends PureComponent {
  static defaultHex = '#000000'
  static defaultUse = 'unused'
  static paletteName = 'palette'

  filterString(name, defaultName = '') {
    name = String(name || '').replace(/[^0-9a-zA-Z]/g, '') || defaultName
    return `${name.substring(0, 1).toLowerCase()}${name.substring(1)}`
  }

  createEntry(schemeEntry) {
    let {name, use, hex} = Object(schemeEntry)
    name = this.filterString(name || '')
    use = this.filterString(use || '')
    hex = this.ensureHex(hex)
    const color = Color(hex)
    return {color, name, use, hex}
  }

  /*
  css RGB color in hexadecimal notation without alpha channel
  https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors
  */
  ensureHex(hex) {
    const {defaultHex} = ColorPalette
    hex = String(hex || '').toLowerCase()
    return hex.length !== 7 || // wrong length
      !hex.startsWith('#') || // does not start with '#'
      !hex.substring(1).match(/[0-9a-f]{6}/) // does not end with 6 hexadecimal digits
      ? defaultHex // it failed, use black
      : hex
  }

  getPaletteAndUse(scheme, paletteName) {
    const {defaultUse} = ColorPalette
    const colorNames = {}
    const useNames = {}
    const palette = []
    const uses = []

    for (let {name, use, color} of scheme) {
      !name && (name = color.keyword())
      name = this.ensureUnique(colorNames, name)
      use = this.ensureUnique(useNames, use || defaultUse)
      const hex = color.hex().toLowerCase()
      palette.push({name, hex})
      uses.push({use, name: `${paletteName}.${name}`})
    }
    return {palette, uses}
  }

  ensureUnique(map, str) {
    // if str occured before get next suffix: color => color2
    // if new str, suffix is empty string
    let suffix = map[str] + 1 || ''
    let unique
    for (;;) {
      unique = `${str}${suffix}`
      if (!map[unique]) { // we found a unique key
        map[unique] = 1 // key with suffix: color2 first time
        if (suffix) map[str] = suffix // last suffix of color was 2: color2
        break
      }
      if (!suffix) suffix = 2 // color color2…
      else suffix++
    }
    return unique
  }

  render() {
    const {paletteName} = ColorPalette
    let {scheme, name} = this.props // [{name, use, hex}]
    name = this.filterString(name, paletteName)
    scheme = Array.isArray(scheme) ? scheme.map(entry => this.createEntry(entry)) : []
    const {uses, palette} = this.getPaletteAndUse(scheme, name)

    return <Pre>{[
      `const ${name} = {`,
      `${palette.map(({name, hex}) => `  ${name}: '${hex}',`).join('\n')}`,
      `}`,
      `const uses =  {`,
      `${uses.map(({use, name}) => `  ${use}: ${name},`).join('\n')}`,
      `}`,
    ].join('\n')}</Pre>
  }
}
