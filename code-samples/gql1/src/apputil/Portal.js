/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { PureComponent} from 'react'
import { createPortal } from 'react-dom'
import { getDomElement } from './getDomElement'

export default class Portal extends PureComponent {
  static id = 'portal'

  constructor(props) {
    super(props)
    const {id} = props
    this.domElement = getDomElement(id || Portal.id, 'rendering React portal')
    }

  render() {
    const {domElement, props: {children}} = this

    return createPortal(children, domElement) // createPortal returns an plain object that is different from a component
  }
}
