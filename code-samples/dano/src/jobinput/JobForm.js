/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component} from 'react'
import OptionsLoader from 'jobinput/OptionsLoader'
import Form from './Form'
import {instance as swSlice} from './SwSlice'
import {instance as hwSlice} from './HwSlice'

export default class JobForm extends Component  {
  render() {
    return <OptionsLoader><Form /></OptionsLoader>
  }

  static preloadJobInput() {
    console.log('jobinput.preloadJobInput')
    swSlice.load()
    hwSlice.load()
  }
}

export const preloadJobInput = JobForm.preloadJobInput
