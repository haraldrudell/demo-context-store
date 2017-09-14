/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
class Prepender {
  static shebang = '#!/usr/bin/env node'
  static m = 'prepender babel plugin:'

  constructor(babel) {
    return {visitor: {Program: this.prependerProgram}}
  }

  prependerProgram = (nodePath, pluginPass) => {
    nodePath.hub.file.shebang = this.isType(pluginPass.opts.shebang || Prepender.shebang, 'shebang should be string')

    const text = pluginPass.opts.text
    if (text !== undefined) {
      nodePath.addComment('leading', '\n' + (Array.isArray(text)
        ? text.reduce((r, t, i) => r += this.isType(t, `text:${i} should be string`) + '\n', '')
        : this.isType(text, 'text should be string') + '\n'))
    }
  }

  isType(value, message, type = 'string') {
    const tt = typeof value
    if (tt !== type) throw new Error(`${Prepender.m} ${message}, type is: ${tt}`)
    return value
  }
}

export default babel => new Prepender(babel)
