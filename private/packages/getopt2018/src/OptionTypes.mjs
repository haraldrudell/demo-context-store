/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class OptionTypes {
  defaultType = undefined
  types = {}

  addTypes(types, defaultType) {
    Object.assign(this.types, types)
    if (defaultType) this.defaultType = defaultType
  }

  getType(value) {
    const {types, defaultType} = this
    const valueFn = value === undefined
      ? types[defaultType]
      : typeof value === 'function' ? value : types[value]
    const tv = typeof valueFn
    if (tv !== 'function') {
      console.log(defaultType, types)
      throw new Error(`${this.m} action type not function: ${tv} input: ${value}`)
    }
    return valueFn
  }
}
