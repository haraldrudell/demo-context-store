/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {PureComponent} from 'react'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { connect } from 'react-redux'
import {getSliceData} from './jobsSlice'
import {setDataAreaContent} from 'dataarea/AreaSlice'

class Job extends PureComponent {
  handleJobAction = this.handleJobAction.bind(this)

  handleJobAction() {
    const {dispatch, id} = this.props
    dispatch(setDataAreaContent(id))
  }

  render() {
    const {job, id} = this.props // job is immutable Map
    const name = job && job.get('name')
    const results = job && job.get('results')
    const status = results && results.get('status')

    return <Card onClick={this.handleJobAction} ><CardContent>
      <Typography variant='title' align='center' gutterBottom>
        {name}
      </Typography>
      status: {status}<br/>
      id: {id}
    </CardContent></Card>
  }

  static mapStateToProps(state, ownProps) {
    const {id} = ownProps
    const {data: oMap} = getSliceData(state)
    return {job: oMap && oMap.get(id)} // job immutable Map
  }
}

export default connect(Job.mapStateToProps)(Job)
