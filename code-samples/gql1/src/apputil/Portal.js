/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {createPortal} from 'react-dom'
import {getDomElement} from './getDomElement'

// createPortal returns an plain object that is different from a component
const domElement = getDomElement('portal', 'rendering React portal')
export default ({children}) => createPortal(children, domElement)
