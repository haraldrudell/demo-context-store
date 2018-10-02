/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment, PureComponent} from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Job from './Job'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

export default class JobList extends PureComponent {
  addJobHandler = this.addJobHandler.bind(this)

  addJobHandler(e) {
    const {action} = this.props
    e.preventDefault()
    action()
  }

  render () {
    const {jobs, classes = {}} = this.props // jobs is immutable OrderedMap
    console.log('JobList:', jobs)
    return <Fragment>
        <Typography variant='display1' align='center' gutterBottom>
          jobs
          &nbsp;
          <Button onClick={this.addJobHandler} variant="fab" color="primary" aria-label="Add" className={classes.button}>
            <AddIcon />
          </Button>
        </Typography>
        <div style={{display: 'flex'}}>
          {jobs.keySeq().map(id => <Job id={id} action={this.jobAction} key={id} />)}
        </div>
        &nbsp;
        <Paper>
          End of job list
        </Paper>
      </Fragment>
  }
}
