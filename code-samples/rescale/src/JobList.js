/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment, PureComponent} from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Job from './Job'

export default class JobList extends PureComponent {
  render () {
    const {jobs} = this.props // jobs is immutable OrderedMap
    console.log('JobList:', jobs)
    return <Fragment>
        <Typography variant='display1' align='center' gutterBottom>
          jobs
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
