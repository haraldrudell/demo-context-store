# AllStore

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)

&emsp;

**Single-truth store in 94% less code-lines**

Demonstration Project: [Demo-Context-Store](https://github.com/haraldrudell/demo-context-store)

[Source code link](https://github.com/haraldrudell/demo-context-store/tree/master/src/allstore)

[npm package link](https://www.npmjs.com/package/allstore)

### Features

* Single-truth store as plain object
* useAllstore React 16.7 hook or traditional connect high-order component
* Defaults to pure components, support for traditional components

### Design
* Store manipulation via ECMAScript module imports
* No name-collision via import aliasing and configurable store-slice names
* Use of React 16.3 context and internal subscription mechanic

&emsp;

Published using **[Lib Create React App](https://www.npmjs.com/package/lib-create-react-app)** that allows React components to be publicly published as npm packages

[click for **Video presentation**, 10 min](https://youtu.be/KVaOVjiH2SQ)

&emsp;

### Usage

* **yarn add allstore**
<blockQuote>
import { Store } from 'allstore'<br/>
export default () =>
  &lt;Store store={{value: 1}}>
    …
  &lt;/Store></blockQuote>
&emsp;

<blockQuote>
import { store, Store } from 'allstore'<br/>
Object.assign(store, {value: 1})<br/>
export default () =>
  &lt;Store>
    …
  &lt;/Store></blockQuote>
&emsp;

<blockQuote>
import { OrderedMap, Map } from 'immutable'<br/>
import { store, useAllstore } from 'allstore'<br/>
let sliceName1 = 'records' // modifiable to avoid collisions setSlicename(s)<br/>
const setRecords = list => store[sliceName1] = OrderedMap(list.map(o => [o.id, Map(o)]))<br/>
const recordsSelector = (state, {id}) => ({record: state[sliceName1].get(id)})<br/>
const getRecord = r => (r && r.toJS()) || {}<br/>
setRecords([{id: 1, record: 'One'}, {id: 2, record: 'Two'}])<br/>
function DisplayRecord({id}) {<br/>
&emsp;const {record: map} = useAllstore(recordsSelector, {id})<br/>
&emsp;const {record} = getRecord(map)<br/>
&emsp;return &lt;div>id: {id} record: {record || ''}&lt;/div><br/>
}</blockQuote>

### API Reference
import { store, Store, useAllstore, connect, notify, getState, subscribe, storeContext, StoreProvider, StoreConsumer } from 'allstore'

* **Store**: component that makes the store context available, see Usage
* const {storeProps…} = **useAllstore(mapStateToProps, {props…}, [pure: false])**: React 16.7 hook, see Usage
props to Component
* **connect(mapStateToProps, options)(Component)**: provides store properties as
  * **mapStateToProps(Object state, Object props) Object**: defines what props the wrapped component needs based on the store state and its other props
  * **options: {displayName: string, pure: boolean: default true}**
* **store**: plain store object
* **notify()** all components evaluate the new store state for redraw
* **subscribe()** subscription for store changes, typically only used by connect or useAllstore
* **getState()** gets the store plain object to allow for modifications

&emsp;

* **storeContext** for a class that wants to access the store context, used by connect
* **StoreProvider StoreConsumer** for custom rendering of the React 16.3 context


&emsp;

## link: [Hire Harald Rudell](https://hire.surge.sh/)

## link: [Sponsor Harald Rudell](https://www.gofundme.com/san-francisco-revenge-crime-victim/)

&emsp;

**[Lib Create React App](https://www.npmjs.com/package/lib-create-react-app)** creates shareable libraries from projects bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
