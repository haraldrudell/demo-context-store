/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {memo} from 'react'
import styled, {keyframes} from 'styled-components'

const pinkTones = keyframes`
  from {
    color: hsl(0, 80%, 50%); // red
  }
  33% {
    color: black;
  }
  66% {
    color: hsl(280, 80%, 50%);
  }
  to {
    color: hsl(360, 80%, 50%);
  }
`
const Margin = styled.div`
max-width: 8.5in;
padding: 0 3em;
> dl {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 1em;
  grid-row-gap: 1em;
}
> dl dt {
  margin: 0; /* TODO remove */
}
& > dl a {
  font-weight: bold;
  text-decoration: none;
  animation: ${pinkTones} 8s linear infinite;
}
> dl dd {
  margin-left: 0;
}
> p {
  margin-top: 4em;
}
`
export default memo(() =>
  <Margin>
    <h1>Harald Rudell’s Online Portfolio</h1>
    <h2>Online Projects</h2>
    <dl>
      <dt><a href="https://hire.surge.sh/">Hire Harald</a></dt>
      <dd>A site serving my resume</dd>
      <dt><a href="https://haraldrudell.github.io/redux/">Redux</a></dt>
      <dd>A React/Redux site with some complex forms</dd>
      <dt><a href="https://haraldrudell.github.io/demo-context-store/">Allstore</a></dt>
      <dd>
        A single-truth store in 94% less code-lines<br />
        featuring both <strong>react@next hooks</strong> and traditional connect <strong>high-order component</strong><br />
        on npm as <a href="https://www.npmjs.com/package/allstore">allstore</a><br />
        on github as <a href="https://github.com/haraldrudell/demo-context-store">demo-context-store</a><br />
        deep link to <a href="https://github.com/haraldrudell/demo-context-store/tree/master/src/allstore">allstore source code</a></dd>
      <dt><a href="https://haraldrudell.github.io/react-fame/">React Fame</a></dt>
      <dd>
        A React app published to npm as <a href="https://www.npmjs.com/package/react-fame">react-fame</a><br />
        designed while demonstrating <a href="https://github.com/haraldrudell/lib-create-react-app">lib-create-react-app</a><br />
        as shown in this <a href="https://youtu.be/KVaOVjiH2SQ">lib-create-react-app video 10 min</a></dd>
      <dt><a href="https://haraldrudell.github.io/animation/">Animation</a></dt>
      <dd>A React application demonstrating css3: custom fonts, gradients and animations</dd>
      <dt><a href="https://haraldrudell.github.io/ssr/">Record Sleeve</a></dt>
      <dd>
        Cover-page for a server-side rendering project for Create React App<br />
        published to npm as <a href="https://www.npmjs.com/package/ssr-create-react-app">ssr-create-react-app</a><br />
        tweeted to <strong>Dan Abramov</strong> after he said “<a href="https://twitter.com/dan_abramov/status/953296173116276736">SSR is hard</a>”<br />
        video: <a href="https://youtu.be/sn9InqfNtSQ">Server-side rendering for create react app, 11 min</a></dd>
    </dl>
    <h2>Video</h2>
    <dl>
      <dt><a href="https://youtu.be/sn9InqfNtSQ">Server-side rendering for create react app, 11 min</a></dt><dd />
      <dt><a href="https://youtu.be/KVaOVjiH2SQ">Publish a Create React App to npm, 10 min</a></dt><dd />
      <dt><a href="https://youtu.be/WaKGjhEaP4U">Theming React 16.6, 3 min</a></dt><dd />
      <dt><a href="https://youtu.be/cVPG2eWHd3Q">React 16.5.2 Material UI, 3 min</a></dt><dd />
    </dl>
    <h2>Npm Packages for Node.js and React</h2>
    <dl>
      <dt><a href="https://www.npmjs.com/~haraldrudell">Package List</a></dt>
      <dd>npm package list: 34+ since 2011</dd>
    </dl>
    <h2>Other Open-Source Projects</h2>
    <dl>
      <dt><a href="https://github.com/haraldrudell/">github Profile</a></dt>
      <dd>haraldrudell 64+ repositories since 2011</dd>
    </dl>
    <p>
      This page was created using unreleased <strong>react@next</strong>,&nbsp;
      <strong>styled-components</strong> and&nbsp;
      <strong>pure css3</strong> features like grid
    </p>
    <h2>© 2018-present Harald Rudell&emsp;<a href="mailto:harald.rudell@gmail.com">harald.rudell@gmail.com</a>&emsp;<a href="http://www.haraldrudell.com">http://www.haraldrudell.com</a></h2>
  </Margin>)
