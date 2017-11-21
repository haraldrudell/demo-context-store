/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component} from 'react'

const list = ['a', 'b', 'c']

class Item extends Component {
  click = e => this.props.clicker(this.props.id)
  render = () => <li onClick={this.click}>{this.props.text}</li>
}

export default class List extends Component {
  click = id => console.log('List.click', id)

  render = () =>
    <ul>
      {list.map((v, i) => <Item text={v} clicker={this.click} key={i} id={i} />)}
    </ul>
}
