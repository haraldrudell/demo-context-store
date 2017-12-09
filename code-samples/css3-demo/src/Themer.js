/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Themer {
  constructor(themes) {
    console.log('new Themer')
    this.classList = this.getBody().classList // DOMTokenList
    this.themes = themes
  }

  getBody() {
    const doc = typeof document !== 'undefined' && document
    const body = doc && doc.body
    if (!body) throw new Error('Theme: document not defined')
    return body // HTMLBodyElement
  }

  getActiveTheme() {
    let result = 0
    const {themes, classList} = this
    themes.some((cssClass, index) => {
      const isPresent = classList.contains(cssClass)
      if (isPresent) result = index
      return isPresent
    })
    let classes = []
    for (let i = 0; i < classList.length; i++) classes.push(classList.item(i))
    classes = `${classList.length}[${classes.join(', ')}]`
    return result
  }

  setTheme(number) {
    console.log('setTheme', number)
    const {themes, classList} = this
    const newToken = themes[number]
    if (newToken) {
      const oldToken = themes[this.getActiveTheme()]
      classList.replace(oldToken, newToken)
    }
  }
}
