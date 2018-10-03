/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {PureComponent, Fragment, Children} from 'react'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import '../loadindicator/LoadIndicator.css'
import { connect } from 'react-redux'
import {Map} from 'immutable'
import {storeLoader as swLoader} from './swStore'
import {storeLoader as hwLoader} from './hwStore'

export class OptionsLoader extends PureComponent {
  renderChild(child, props) {
    return React.cloneElement(child, props)
  }

  render() {
    const {children, hw, sw, e} = this.props
    console.log('ListLoader.render hw:', hw, 'sw:', sw, 'e:', e && e.message)
    return (hw === undefined || sw === undefined) && !e
      ? <CircularProgress />
      : e
        ? <div className="ListLoader-error"><div>
            <TextField value={e.message || 'error'} error fullWidth helperText='Data loading failed' />
          </div></div>
        : <Fragment>{Children.map(children, child => this.renderChild(child, {hw, sw}))}</Fragment>
  }

  static getSlice(state, loader) {
    const {sliceName, eSlice, dataSlice} = loader
    const value = state[sliceName] || Map()
    const e = value.get(eSlice)
    const data = value.get(dataSlice)
    return {e, data}
  }

  static mapStateToProps(state) {
    const hw = OptionsLoader.getSlice(state, hwLoader)
    const sw =  OptionsLoader.getSlice(state, swLoader)
    const e = hw.e || sw.e
    return {e, hw: hw.data, sw: sw.data}
  }
}

export default connect(OptionsLoader.mapStateToProps)(OptionsLoader)
