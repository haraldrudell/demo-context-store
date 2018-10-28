/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import immutable, { OrderedMap, List } from 'immutable'
import Func from './Func'
import BenchMarker from './BenchMarker'
import {Code, CodeValue} from './code'

const AppContainer = styled.div`
  margin: 0
  padding: 20px
  li {
    margin-top: 6pt
    margin-bottom: 6pt
  }
`
const Export = styled.div`
color: green
}
`
const Hanging = styled.p`
  margin-left: 1em;
  text-indent: -1em;
`
export default class App extends Component {
  static delay = 100 // ms
  // eslint-disable-next-line no-self-compare
  factorySame = new Func({t: 'OrderedMap() === OrderedMap()', f: () => OrderedMap() === OrderedMap()})
  newOrderedMap = new Func({t: `OrderedMap([[2, 'two'], [1, 'one']])`, f: () => OrderedMap([[2, 'two'], [1, 'one']])})
  keyType = new Func({t: `OrderedMap().set(2, 'two').set('2', 'one')`, f: () => OrderedMap().set(2, 'two').set('2', 'one')})
  keySame = new Func({t: `OrderedMap().set(2, 'two').set(2, 'one')`, f: () => OrderedMap().set(2, 'two').set(2, 'one')})
  size = new Func({t: `OrderedMap().set(2, 'two').set(1, 'one').size`, f: () => OrderedMap().set(2, 'two').set(1, 'one').size})
  valueSeq = new Func({t: `OrderedMap().set(2, 'two').set(1, 'one').valueSeq()`, f: () => OrderedMap().set(2, 'two').set(1, 'one').valueSeq()})
  keySeq = new Func({t: `OrderedMap().set(2, 'two').set(1, 'one').keySeq()`, f: () => OrderedMap().set(2, 'two').set(1, 'one').keySeq()})
  entrySeq = new Func({t: `OrderedMap().set(2, 'two').set(1, 'one').entrySeq()`, f: () => OrderedMap().set(2, 'two').set(1, 'one').entrySeq()})
  sequence = new Func({t: `OrderedMap().set(2, 'two').set(3, 'three').set(1, 'one').valueSeq().skip(2).take(1)`, f: () => OrderedMap().set(2, 'two').set(3, 'three').set(1, 'one').valueSeq().skip(2).take(1)})
  sort = new Func({t: `OrderedMap().set(2, {id: 2}).set(1, {id: 1}).sort((a, b) => a.id < b.id ? -1 : a.id === b.id ? 0 : 1)`,
    f: () => OrderedMap().set(2, {id: 2}).set(1, {id: 1}).sort((a, b) => a.id < b.id ? -1 : a.id === b.id ? 0 : 1)})
  sortByKey = new Func({t: `OrderedMap().set(2, 'two').set(1, 'one').sortBy((value, key) => key)`,
    f: () => OrderedMap().set(2, 'two').set(1, 'one').sortBy((value, key) => key)})
  indexForKey = new Func({t: `OrderedMap().set(2, 'two').set(1, 'one').keySeq().findIndex(k => k === 1)`,
    f: () => OrderedMap().set(2, 'two').set(1, 'one').keySeq().findIndex(k => k === 1)})
  iterationsText = '1e6'
  iterations = Number(this.iterationsText)
  benchmarks = [{
    name: 'Array construction',
    f: {t: `let a = []; for (let i = 0; i < ${this.iterationsText}; i++) a.push([i, i]); OrderedMap(a)`, f: () => { let a = []; for (let i = 0; i < this.iterations; i++) a.push([i, i]); OrderedMap(a)}},
  },{
    name: 'OrderedMap Construction',
    f: {t: `let o = OrderedMap(); for (let i = 0; i < ${this.iterationsText}; i++) o = o.set(i, i)`, f: () => { let o = OrderedMap(); for (let i = 0; i < this.iterations; i++) o = o.set(i, i)}},
  },{
    name: 'List Construction',
    f: {t: `let a = List(); for (let i = 0; i < ${this.iterationsText}; i++) a = a.push(List().push(i).push(i)); OrderedMap(a)`, f: () => { let a = List(); for (let i = 0; i < this.iterations; i++) a = a.push(List().push(i).push(i)); OrderedMap(a)}},
  }]
  state = {}

  calculateAction = e => {
    const {hadCaclulate} = this
    const {delay} = App
    if (hadCaclulate) return
    this.hadCaclulate = true

    this.setState({enteredCalculate: true})
    setTimeout(() => this.calculate(), delay) // delay to allow render before calulcate
  }

  async calculate() {
    const {benchmarks} = this
    console.log(`App.calculate`)

    const t0 = Date.now()
    const calculations = benchmarks.map(({name, f}) => ({name, f: new Func(f)}))
    const duration = (Date.now() - t0) / 1e3
    console.log(`App.calculate duration: ${duration.toFixed(3)} s`)

    const constructions = new BenchMarker(calculations)
    this.setState({constructions})
  }

  render() {
    console.log('App.render')
    const {constructions, enteredCalculate} = this.state
    const exportsList = Object.keys(Object(immutable))
    const speedNames = constructions && constructions.getSpeedNames()

    return <AppContainer>
      <h1>Immutable</h1>
      <Hanging>
        Version: 3.8.2 of October 4, 2017<br />
        <a href="https://facebook.github.io/immutable-js/">Website</a><br />
        <a href="https://facebook.github.io/immutable-js/docs">Documentation</a><br />
        <a href="https://github.com/facebook/immutable-js">repository</a>
      </Hanging>
      <Hanging>Immutable exports: {exportsList.length}<br />
        {exportsList.join(', ')}</Hanging>
      <h2>Data Structures</h2>
      <p>Construction of empty data structures return a singleton instance: <CodeValue f={this.factorySame}/></p>
      <h3>Maps</h3>
      <Export as='h4'>OrderedMap</Export>
      <h5>OrderedMap Data Access</h5>
      <ul>
        <li>OrderedMap provides both O(1) access by id and sequential access to entries, ie. keys and/or values</li>
        <li>OrderedMap preserves the order in which values were added</li>
        <li>The key, value and entry sequences for an OrderedMap are identical</li>
        <li>OrderedMap can be re-sorted providing a different sequence from the same set of values</li>
        <li>OrderedMap.sort() is stable</li>
      </ul>
      <h5>OrderedMap Construction</h5>
      <ul>
        <li>Construction is by the factory function OrderedMap()</li>
        <li>The argument can be empty, object or an iterable of key-value-pair arrays
          <ul>
            <li>ECMAScript objects do not guarantee key order</li>
            <li>ECMAScript built-in iterables are String, Array, TypedArray, Map and Set</li>
          </ul>
        </li>
        <li>Virtually all OrderedMap construction is from an array of key-value-pair arrays:<br />
          <CodeValue f={this.newOrderedMap} />
        </li>
        <li>Fastest construction strategy: { !constructions
          ? !enteredCalculate
            ? <button onClick={this.calculateAction}>Calculate</button>
            : 'calculating…'
          : <Fragment>
            {speedNames[0]}<br />
            <Code f={constructions.getSpeedFunctionByIndex(0)} />
            {speedNames.length > 1 &&
            <ul>{speedNames.map((name, i) => i > 0 &&
              <li key={i}>
                {name}: {constructions.getNormalizedSpeedByIndex(i).toFixed(3)}<br />
                <Code f={constructions.getSpeedFunctionByIndex(i)} />
              </li>)}
            </ul>}
          </Fragment>}
        </li>
        <li>OrderedMap key type is important:<br />
          <CodeValue f={this.keyType}/><br />
          <CodeValue f={this.keySame}/>
        </li>
        <li>Iterations based on Seq<br />
          <CodeValue f={this.size}/><br />
          <CodeValue f={this.valueSeq}/><br />
          <CodeValue f={this.keySeq}/><br />
          <CodeValue f={this.entrySeq}/>
        </li>
        <li>Sequence algorithms<br />
          <CodeValue f={this.sequence}/>
        </li>
        <li>Sorting by value or key<br />
          <CodeValue f={this.sort}/><br />
          <CodeValue f={this.sortByKey}/>
        </li>
        <li>Index for key<br />
          <CodeValue f={this.indexForKey}/>
        </li>
      </ul>
      <Export as='h4'>Map</Export>
      <h3>Lists</h3>
      <Export as='h4'>List</Export>
      <Export as='h4'>Stack</Export>
      <h3>Sets</h3>
      <Export as='h4'>OrderedSet</Export>
      <Export as='h4'>Set</Export>
      <h3>Other Data Structures</h3>
      <Export as='h4'>Record</Export>
      <Export as='h4'>Collection</Export>
        <p>Keyed or indexed determined by factory function argument</p>
      <h2>Other</h2>
      <Export as='h3'>Iterable</Export>
      <Export as='h3'>Seq</Export>
        <p>Seq as opposed to an iterator supports .map() .flatmap() and similar</p>
        <p>Seq as opposed to slice is lazy</p>
      <Export as='h3'>Range</Export>
      <Export as='h3'>Repeat</Export>
      <Export as='h3'>is</Export>
      <Export as='h3'>fromJS</Export>
    </AppContainer>
  }
}
