/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {PureComponent, Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import DropDown from './DropDown'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'

const FlexForm = styled.form`
&& {
  display: flex
  flex-wrap: wrap
  align-items: flex-start
  > * {
    margin-left: 20px
    margin-bottom: 20px
  }
  > button {
    margin-top: 20px
  }
}
`
export default class Form extends PureComponent {
  handleChange = this.handleChange.bind(this)
  submit = this.submit.bind(this)
  static defaultName = 'Noname'

  constructor(props) {
    super(props)
    const {defaultName: name} = Form
    const {hw, sw} = props

    // get hw and cores
    const hw0 = hw.valueSeq().first() // the first hardware
    const hardwareId = hw0.get('id')
    const max = hw0.get('max') // max cores on this hw
    const cores = 1

    // get sw and application
    const sw0 = sw.valueSeq().first()
    const softwareId = sw0.get('id')
    const {apps, applicationId} = this.updateApp(softwareId, sw)

    this.state = {name, softwareId, hardwareId, applicationId, cores, max, apps}
  }

  submit(e) {
    e.preventDefault()
    const {name, softwareId, applicationId, hardwareId, cores} = this.state
    const {action} = this.props
    action({name, softwareId, applicationId, hardwareId, cores})
  }

  updateMaxCores(hardwareId) {
    // find max for this hardware
    const {hw} = this.props
    const thisHw = hw.get(hardwareId)
    const max = thisHw.get('max')

    // ensure state is compliant
    const {max: smax, cores} = this.state
    if (smax !== max) this.setState({max})
    if (cores > max) this.setState({cores: max})
  }

  updateApp(softwareId, sw, applicationId) {
    // get allowed appIds
    const thisSw = sw.get(softwareId)
    const apps = thisSw.get('applications')
    const appIds = apps.map(app => app.get('id'))

    // return apps and a valid appId
    if (!appIds.has(applicationId)) applicationId = appIds.get(0)
    return {apps, applicationId}
  }

  handleChange(e) {
    let {name, value} = e.target // value is an id
    const {max} = this.state
    console.log(`handleChange: '${name}' ${typeof value} '${value}'`)
    if (name === 'cores') { // check cores against max
      value = Number(value)
      if (value > max) value = max
    } else if (name === 'softwareId') {
      const apid0 = this.state.apid0

      // determine what apps are available with this sw
      const {sw} = this.props
      const {apps, applicationId} = this.updateApp(value, sw)
      this.setState({apps})

      // if change in appId, uopdate state
      if (applicationId !== apid0) this.setState({applicationId})
    }
    this.setState({[name]: value})

    // update cores if there was a change in hardware
    if (name === 'hardwareId') this.updateMaxCores(value)
  }

  render() {
    const {hw, sw} = this.props
    const {handleChange} = this
    const {defaultName} = Form
    //console.log(sw.toJS())
    console.log('Form.render state:', this.state)
    const swProps = {label: 'Software', name: 'softwareId', defVal: sw.keySeq().first(), handleChange, opts: sw}
    const hwProps = {label: 'Hardware', name: 'hardwareId', defVal: hw.keySeq().first(), handleChange, opts: hw}
    const apProps = {label: 'Application', name: 'applicationId',
      defVal: this.state.applicationId, handleChange,
      opts: this.state.apps}

    return <Fragment>
      <Typography variant='display1' align='center' gutterBottom>
        New Job
      </Typography>
      <FlexForm>
        <TextField label='Name' name={'name'} defaultValue={defaultName} onChange={handleChange} />
        <DropDown {...swProps} />
        <DropDown {...apProps} />
        <DropDown {...hwProps} />
        <TextField label='Cores' name='cores' value={this.state.cores}
          onChange={handleChange} type='number' helperText={`max: ${this.state.max}`} />
        <Button onClick={this.submit} type='submit' variant="contained" color="primary">
          Create
        </Button>
    </FlexForm></Fragment>
  }
}
