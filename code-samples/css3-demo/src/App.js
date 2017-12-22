/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component, Fragment, createElement} from 'react'
import Background from './Background'
import Position from './Position'
import Theme from './Theme'

import Navigation from './Navigation'
import Intro from './Intro'
import Tweet from './Tweet'
import Form from './Form'
import Form1 from './Form1'
import /*styles from*/ './App.css'

const tabClasses = [Intro, Position, Theme, Tweet, Form, Form1]
const startTab = tabClasses.indexOf(Form1)
const m = 'App'

export default class App extends Component {
  texts = tabClasses.map((fn, index) => fn.label || fn.name || `Tab${index}`)
  constructor(props) {
    super(props)
    const {tab} = Object(props)
    const textIndex = tab >= 0 ? Number(tab) : startTab
    this.state = {
      activeTab: this.texts[textIndex]
    }
  }

  setActiveTab = activeTab => this.setState({activeTab})

  render() {
    const {activeTab} = this.state
    const introIsActive = activeTab === this.texts[0]
    const tabClass = !introIsActive && tabClasses[this.texts.indexOf(activeTab)]
    if (!introIsActive && typeof tabClass !== 'function') throw new Error(`${m}: bad active tab name: ${activeTab}`)
    return <Fragment>
      <Background>
        <Navigation tabs={this.texts} activeTab={activeTab} setActiveTab={this.setActiveTab} />
        {introIsActive && <Intro />}
      </Background>
      {!introIsActive && createElement(tabClass)}
    </Fragment>
  }
}
