/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component, Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import DropDown from './DropDown'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

/*
software and hardware endpoints to retrieve the possible selections so that your
end user can name their new job, select the software & application of the
job/simulations they would like to run and then choose hardware and the
amount of cores they would like to use. This information can then be passed
back to the server to create a new job/simulation.
*/
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
})

/*
sw: label, id, info, applications:[{label, id, image}]
hw: id, label, max
*/
class Form extends Component {
  handleChange = this.handleChange.bind(this)
  submit = this.submit.bind(this)
  static defaultName = 'Noname'

  constructor(props) {
    const {defaultName} = Form
    super()
    const {hw, sw} = props
    const hw0 = hw.valueSeq().first()
    const sw0 = sw.valueSeq().first()
    const softwareId = sw0.get('id')
    const {apps, applicationId} = this.updateApp(softwareId, sw)
    this.state = {
      name: defaultName,
      softwareId,
      hardwareId: hw0.get('id'),
      applicationId,
      cores: 1,
      max: hw0.get('max'),
      apps,
    }
    if (!this.state.applicationId) throw new Error('APPIDConstr')
  }

  submit(e) {
    e.preventDefault()
    const {name, softwareId, applicationId, hardwareId, cores} = this.state
    const {action} = this.props
    action({name, softwareId, applicationId, hardwareId, cores})
  }

  updateMaxCores(hardwareId) {
    const {hw} = this.props
    const thisHw = hw.get(hardwareId)
    const max = thisHw.get('max')
    if (this.state.max !== max) this.setState({max})
    if (this.state.cores > max) this.setState({cores: max})
  }

  updateApp(softwareId, sw, applicationId) {
    const swx = sw.get(softwareId)
    if (!swx) throw new Error('UPDATEAPP')
    const apps = swx.get('applications')
    if (!apps) throw new Error('UPDATEAPPS')
    const appIds = apps.map(app => app.get('id'))
    if (appIds.size === 0) throw new Error('UPDATEAPPIDS')
    if (!appIds.has(applicationId)) applicationId = appIds.get(0)
    return {apps, applicationId}
  }

  handleChange(e) {
    let {name, value} = e.target // value is an id
    const {max} = this.state
    console.log(`handleChange: '${name}' ${typeof value} '${value}'`)
    if (name === 'cores') {
      value = Number(value)
      if (value > max) value = max
    }
    if (name === 'softwareId') {
      const apid0 = this.state.apid0
      const {sw} = this.props
      const {apps, applicationId} = this.updateApp(value, sw)
      this.setState({apps})
      if (applicationId !== apid0) this.setState({applicationId})
    }
    this.setState({[name]: value})
    if (name === 'hardwareId') this.updateMaxCores(value)
  }

  render() {
    const {classes = {}, hw, sw} = this.props
    const {handleChange} = this
    const {defaultName} = Form
    //console.log(sw.toJS())
    console.log('Form.render state:', this.state)
    const swProps = {classes, label: 'Software', name: 'softwareId', defVal: sw.keySeq().first(), handleChange, opts: sw}
    const hwProps = {classes, label: 'Hardware', name: 'hardwareId', defVal: hw.keySeq().first(), handleChange, opts: hw}
    const apProps = {classes, label: 'Application', name: 'applicationId',
      defVal: this.state.applicationId, handleChange,
      opts: this.state.apps}
    return <Fragment>
      <Typography variant='display1' align='center' gutterBottom>
        New Job
      </Typography>
      <form className={classes.root}>
        <TextField label='Name' defaultValue={defaultName} className={classes.textField}
          onChange={handleChange} name={'name'} margin="dense" />
        <DropDown {...swProps} />
        <DropDown {...apProps} />
        <DropDown {...hwProps} />
        <TextField label='Cores' value={this.state.cores} className={classes.textField}
          onChange={handleChange} name='cores' margin="dense" type='number' helperText={`max: ${this.state.max}`} />
        <Button onClick={this.submit} type='submit' variant="contained" color="primary" className={classes.button}>
          Primary
        </Button>
    </form></Fragment>
  }
}

export default withStyles(styles)(Form)
