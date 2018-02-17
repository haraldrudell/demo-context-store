/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackCreator from './StackCreator'

export default class StackManager extends StackCreator {
  constructor(o) {
    super(Object.assign({name: 'StackManager'}, o))
  }
}
