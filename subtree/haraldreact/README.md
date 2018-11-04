<h1>haraldreact</h1>
<p>© <a href=http://haralrudell.com>Harald Rudell</a> created <strong>haraldreact</strong> in November 2018. ISC License</p>
<p>&emsp;</p>

<p><strong>haraldreact</strong> is a library bundling reusable React design patterns so that apps can be written more quickly</p>
<p>Links:</p>
<ul>
  <li><a href="">npm <strong>haraldreact</strong></a></li>
  <li><a href=https://github.com/haraldrudell/haraldreact>github haraldrudell <strong>haraldreact</strong></a></li>
</ul>
<p>&emsp;</p>

<h2>Usage</h2>
<p>Add the haraldreact npm package:</p>
<blockquote>
yarn  add haraldreact
</blockquote>
<p>Import patterns:</p>
```javascript
import { Grid } from 'haraldreact/apputil'
…
export default class App extends PureComponent {
  …
  render() {
    return <Grid …>
      …
  }
}
```
<p>&emsp;</p>

<h2>Imports</h2>
<p><strong>import { Grid } from 'haraldreact/apputil'</strong><br />
A vertical application grid based on css flexbox wrapping each child in a flex-item element</p>
<p>&emsp;</p>

<h2>Requirements</h2>
<ul>
  <li>React as a devDependency, depending on imports:
    <ul>
      <li>16.6 for <strong>memo</strong> export, ie. pure functional components</li>
      <li>16.3 context api</li>
  </ul></li>
  <li>styled-compoents 4+</li>
  <li>Material-UI 3+</li>
</ul>

<p>&nbsp;</p>

<p>© <a href=http://haralrudell.com>Harald Rudell</a> created <strong>haraldreact</strong> in November 2018. ISC License</p>
