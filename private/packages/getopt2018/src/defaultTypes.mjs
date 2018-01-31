/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import path from 'path'

export const defaultType = boolean.name
export const types = {
  boolean,
  string,
  filename,
}

function boolean({arg, i: {argv, index, options, parser}, action}) {
  const {property} = action
  if (property) options[property] = true
}

function string({arg, i: {argv, index, options, parser}, action}) {
  const {property} = action
  if (property) options[property] = arg
}

async function filename({arg, i: {argv, index, options, parser}, action}) {
  const {property} = action
  if (property) {
    if (arg === undefined) {
      if (action.isHasValueAlways) return `filename type: filename cannot be empty`
      arg = ''
    }
    options[property] = arg ? path.resolve(arg) : arg
  }
}
