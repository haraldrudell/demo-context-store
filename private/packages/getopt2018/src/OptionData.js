/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export class OptionData {
  static parameters = {isHelp: 1, mustHaveArg: 2}
  static parameterLookup = Object.keys(OptionData.parameters)
    .reduce((accumulate, parameterName) => {
      const parameterValue = OptionData.parameters[parameterName]
      accumulate[parameterValue] = parameterName
      return accumulate
    }, {})

  constructor({optionData, m, optionName}) { // [od.mustHaveArg, 'name, paraneter yaml file'],
    if (!Array.isArray(optionData)) throw new Error(`${m} option ${optionName}: argument must be list`)
    this.name = optionName
    const rev = OptionData.parameterLookup
    const lastIndex = optionData.length - 1
    for (let [index, value] of optionData.entries()) {
      if (index === lastIndex && typeof value === 'string') {
        this.help = value
        break
      }
      const parameterName = rev[value]
      if (!parameterName) throw new Error(`${m} option ${optionName} unknown parameter at index: ${index}: ${value}`)
      this[parameterName] = true
    }
  }
}

export const od = OptionData.parameters
