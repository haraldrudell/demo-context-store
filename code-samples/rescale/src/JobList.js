/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Job from './Job'

export default ({jobs}) => <Fragment>
      <Typography variant='display1' align='center' gutterBottom>
        jobs
      </Typography>
      <div style={{display: 'flex'}}>
        {jobs.map((job, i) => <Job {...job} key={i} />)}
      </div>
      <Paper>
        End of job list
      </Paper>
    </Fragment>
