/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { Component, Fragment } from 'react'
import {getSliceData, loadJobs} from './jobsSlice'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import {ErrorText} from 'apputil'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import styled from 'styled-components'
import Job from './Job'
import Grid from '@material-ui/core/Grid'
import {showDataAreaForm} from 'dataarea'

const ButtonFixed = styled(Button)`
&& {
  margin-left: 28px
  width: 56px
}
`
const TypographyPad = styled(Typography)`
padding-left: 84px
`
class Jobs extends Component {
  addJobHandler = this.addJobHandler.bind(this)

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(loadJobs())
  }

  addJobHandler(e) {
    const {dispatch} = this.props
    e.preventDefault()
    dispatch(showDataAreaForm)
  }

  render() {
    const {jobs, e} = this.props
    console.log('Jobs.render jobs:', jobs, 'e:', e && e.message)
    return <Fragment>
      <TypographyPad variant='display1' gutterBottom align='center'>
        jobs
        <ButtonFixed onClick={this.addJobHandler} variant="fab" color="primary" aria-label="Add">
          <AddIcon />
        </ButtonFixed>
      </TypographyPad>

      <Grid container justify='center'>
      {jobs === undefined
        ? <Grid item>
          {!e
            ? <CircularProgress />
            : <ErrorText e={e} text='Data loading failed' />}
          </Grid>
        : jobs.keySeq().map(id => <Grid item key={id}><Job id={id} /></Grid>)}
      </Grid>
    </Fragment>
  }

  static mapStateToProps(state) {
    const {e, data} = getSliceData(state)
    return {e, jobs: data}
  }
}

export default connect(Jobs.mapStateToProps)(Jobs)
