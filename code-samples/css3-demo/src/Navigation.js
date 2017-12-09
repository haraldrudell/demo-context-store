/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component, Fragment} from 'react'
import Button from './Button'

export default class Navigation extends Component {
  render() {
    const {tabs, activeTab, setActiveTab} = this.props
    return <Fragment>
      {tabs && tabs.map((text, i) =>
        <Button key={i} text={text} state={text === activeTab} setActiveTab={setActiveTab} />
      )}
      </Fragment>
  }
}
