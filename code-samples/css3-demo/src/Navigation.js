import React, {Component} from 'react'
import Button from './Button'

export default class Navigation extends Component {
  render() {
    const {tabs, activeTab, setActiveTab} = this.props
    return (
      <div>
        {tabs && tabs.map((text, i) =>
          <Button key={i} text={text} state={text === activeTab} setActiveTab={setActiveTab} />
        )}
      </div>)
  }
}
