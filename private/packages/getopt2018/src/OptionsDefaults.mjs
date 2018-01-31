/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Option from './Option'
import OptionsContainer from './OptionsContainer'

export default class OptionsDefaults extends OptionsContainer {
  helpOption = {
    names: ['-help', '-h', '--help'],
    type: this.doUsage.bind(this),
    help: 'display usage',
  }
  static debugOption = {
    names: '-debug',
    property: 'debug',
    help: 'diagnostic output',
  }

  constructor(o) {
    super(o)
    const doAddDefaults = Object(o).defaults !== false
    if (doAddDefaults) {

      //create actions
      const {debug, optionTypes} = this
      const type = optionTypes.getType()
      const defaultActions = [
        new Option(this.helpOption),
        new Option(Object.assign({type}, OptionsDefaults.debugOption)),
      ]
      debug && console.log(`${this.m} OptionsDefaults`, defaultActions)

      // store actions
      const {actions} = this
      actions.push.apply(actions, defaultActions)
      this.addToIndex(defaultActions)
    }
  }
}
