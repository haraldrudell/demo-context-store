/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/utilInspect.mjs
import util from 'util'
import events from 'events'
const e = new events.EventEmitter
//console.log(console)
/*
options <Object>
showHidden boolean default false
depth number or null, default 2
- zero still prints top-level object keys
colors boolean default false
customInspect boolean default false
showProxy boolean default false
maxArrayLength number or null default 100
breakLength number or Infinity default 60
number - yellow
boolean - yellow
string - green
date - magenta
regexp - red
null - bold
undefined - grey
special - cyan (only applied to functions at this time)
name - (no styling)
*/
const results = []
for (let value of [null, 0, 2, 1]) {
  const s = util.inspect(global, {colors: true, depth: value})
  const t = s.replace(/\n/g, '')
  results.push(`${value}: ${s.length - t.length + 1}`)
}
console.log(`lines printed by util.inspect for the global object when depth has value:\n` +
  results.join('\x20'.repeat(3)))
//console.log(util.inspect(process, {colors: true, depth: null}))
//console.log(util.inspect(process, {colors: true, depth: 2}))
console.log()
