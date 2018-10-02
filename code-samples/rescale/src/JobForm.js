/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component, Fragment} from 'react'
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

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
})

class JobForm extends Component {
  state = {}
  handleChange = this.handleChange.bind(this)

  handleChange(e) {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  render() {
    const {classes = {}} = this.props
    const {age = 1} = this.state
    return <Fragment>
      &nbsp;
      <Typography variant='display1' align='center' gutterBottom>
        New Job
      </Typography>
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <Select
            value={age}
            onChange={this.handleChange}
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
            >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
    </div></Fragment>
  }
}

export default withStyles(styles)(JobForm)