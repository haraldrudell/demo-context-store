/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Job from './Job'

// jobs is immutable List
export default ({jobs}) => {
  console.log('jobs:', jobs)
  return <Fragment>
      <Typography variant='display1' align='center' gutterBottom>
        jobs
      </Typography>
      <div style={{display: 'flex'}}>
        {jobs.map((job, i) => <Job job={job} key={i} />)}
      </div>
      <Paper>
        End of job list
      </Paper>
    </Fragment>}
