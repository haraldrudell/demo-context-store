/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ClassA from './ClassA'
import ClassB from './ClassB'

console.log('PREFLIGHTBEFORE')
export default class Foo {}
console.log('PREFLIGHTAFTER')

console.log('helper', new ClassA('alpha'), new ClassB('beta'))
