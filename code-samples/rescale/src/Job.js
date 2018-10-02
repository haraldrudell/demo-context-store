/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {PureComponent} from 'react'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { connect } from 'react-redux'
import {jobs, dataSlice} from './jobsstore'
import {Map, OrderedMap} from 'immutable'
import {setArea} from  './areastore'

/*
name: 'Chair Structural Test',
id: 'rJK69pItf'
software:
  type:
    label: 'Structural Analysis',
    id: 'structural'
  application:
    label: 'Strength Analysis',
    id: 'strength'
hardware:
  type:
    label: 'Intel Xeon E4-1676  @ 2.3 GHz',
    id: 'e4'
  cores: 32,
results
  status: 'finished',
  duration: 16,
  images:
  - '/images/strength2.jpg'
  - '/images/strength1.jpg'
  - '/images/data2.jpg'
*/
class Job extends PureComponent {
  handleJobAction = this.handleJobAction.bind(this)

  handleJobAction() {
    const {dispatch, id} = this.props
    dispatch(setArea(id))
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
      {status}<br/>
      id: {id}
    </CardContent></Card>
  }

  static mapStateToProps(state, ownProps) {
    const {id} = ownProps
    const map = state[jobs.name] || Map()
    const oMap = map.get(dataSlice) || OrderedMap()
    return {job: oMap.get(id)} // job immutable Map
  }
}

export default connect(Job.mapStateToProps)(Job)
