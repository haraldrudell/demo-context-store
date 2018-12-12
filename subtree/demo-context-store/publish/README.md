# AllStore

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)

&emsp;

**Single-truth store in 94% less code-lines**

Demonstration Project: [Demo-Context-Store](https://github.com/haraldrudell/demo-context-store)

[Source code link](https://github.com/haraldrudell/demo-context-store/tree/master/src/allstore)

[npm package link](https://www.npmjs.com/package/allstore)

&emsp;

Published using **[Lib Create React App](https://www.npmjs.com/package/lib-create-react-app)** that allows React components to be publicly published as npm packages

[click for **Video presentation**, 10 min](https://youtu.be/KVaOVjiH2SQ)

&emsp;

### Usage

* **yarn add allstore**
<blockQuote>
import { Store, PlainStore, connect } from 'allstore'

const store = new PlainStore()
Object.assign(store.getState(), {value: 1})

export default () =>
  &lt;Store store={store}>
    …
  &lt;/Store></blockQuote>

### API Reference
import { Store, getStore, connect, storeContext, StoreProvider, StoreConsumer } from 'allstore'

* **Store**: component that makes the store context available, see Usage
* **getStore()** the store instance (after rendering Store)
  * **.getState()** gets the store plain object to allow for modifications
  * **.notify()** all components evaluate the new store state for redraw
  * **.subscribe()** rxjs Subject subscription for store changes, typically only used by connect
* **connect(mapStateToProps, options)(Component)**: provides store properties as props to Component
  * **mapStateToProps(Object state, Object props) Object**: defines what props the wrapped component needs based on the store state and its other props
  * **options: {displayName: string, pure: boolean: default true}**

&emsp;

* **storeContext** for a class that wants to access the store context, used by connect
* **StoreProvider StoreConsumer** for custom rendering of the React 16.3 context


&emsp;

## link: [Hire Harald Rudell](https://hire.surge.sh/)

## link: [Sponsor Harald Rudell](https://www.gofundme.com/san-francisco-revenge-crime-victim/)

&emsp;

**[Lib Create React App](https://www.npmjs.com/package/lib-create-react-app)** creates shareable libraries from projects bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
