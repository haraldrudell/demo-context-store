/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {PureComponent} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import {getSliceData as swData} from './swSlice'
import {getSliceData as hwData} from './hwSlice'
import {ErrorText} from 'apputil'
import {createJob} from 'jobs'
import Form from './Form'

class JobForm extends PureComponent  {
  action = o => this.props.dispatch(createJob(o))

  render() {
    const {action, props: {hw, sw, e}} = this
    const formProps = {hw, sw, action}
    console.log('ListLoader.render hw:', hw, 'sw:', sw, 'e:', e && e.message)
    return (hw === undefined || sw === undefined) && !e
      ? <CircularProgress />
      : e
        ? <ErrorText e={e} text='Options loading failed' />
        : <Form {...formProps} />
  }

  static mapStateToProps(state) {
    const hw = hwData(state)
    const sw =  swData(state)
    const e = hw.e || sw.e
    return {e, hw: hw.data, sw: sw.data}
  }
}

export default connect(JobForm.mapStateToProps)(JobForm)
