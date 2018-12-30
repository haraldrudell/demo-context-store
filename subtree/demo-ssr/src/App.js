/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {memo} from 'react'
import logo from './logo.svg'
import './App.css'

export default memo(() =>
  <>
    <div>never mind</div>
    <div>the bollocks</div>
    <div>
      Here’s Server-Side Rendering for Create React App
      <div>
        <a href="https://hire.surge.sh">Harald Rudell&emsp;<span>←click here</span></a><br />
        <p><a href="mailto:harald.rudell@gmail.com">harald.rudell@gmail.com</a></p>
      </div>
      <div>
        <a href="https://twitter.com/dan_abramov/status/953296173116276736"><img src={logo} alt="logo" /></a>
      </div>
      <span><a href="http://www.tubereplay.com/replay.php?tqr=https%3A%2F%2Fyoutube.com%2F%3Fv%3DR8fLOJswWtk">We love our Queen: God saves</a></span>
    </div>
  </>)
