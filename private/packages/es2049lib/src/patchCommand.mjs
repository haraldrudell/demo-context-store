/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

/*
args: array of string like ['node', '--version']
regExpValue: RegExp and value pairs like [/IP/g, '1.2.3.4']

return value: array of string: patched command
*/
export function patchCommand(args, ...regExpValue) {
  if (!Array.isArray(args)) throw new Error(`patchCommand: args not array`)
  return args.map((arg, index) => {
    const at = typeof arg
    if (at !== 'string') throw new Error(`patchCommand: args index #${index} not string: ${at} args: ${args.join(' ')}`)
    for (let i = 0; i < regExpValue.length; i += 2) {
      const regExp = regExpValue[i]
      const value = regExpValue[i + 1]
      arg = arg.replace(regExp, value)
    }
    return arg
  })
}
