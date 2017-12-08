import React from 'react'
import './LoginSkin.css'

const LoginSkin = props => (
  <login-container>
    <header>
      <p>
        <img src="/img/harness-logo.png" title="Harness"/>
      </p>
    </header>
    <main>
      <page-content>
        {props.children}
        <img src="/img/login/login-slogan.png" title="Move fast and don't break things."/>
      </page-content>
    </main>
    <footer></footer>
  </login-container>
)

export default LoginSkin


// WEBPACK FOOTER //
// ../src/containers/LoginSkin/LoginSkin.js