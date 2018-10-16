/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import {instance} from './JobsSlice'
import {Map, OrderedMap, List} from 'immutable'
import {makeUrl} from 'api/api'

const Img = ({uri}) => <img alt='resultImage' src={makeUrl(uri)} />

export default connect(mapStateToProps)(({job, id}) => { // job is immutable Map
  const name = job && job.get('name') // string
  const results = job && job.get('results') // Map
  const imageUrls = (results && results.get('images')) || List()
  return <Fragment>
    <Typography variant='title' align='center' gutterBottom>
      Results: {name} {id}
    </Typography>
    {imageUrls.map((uri, i) => <Img uri={uri} key={i} />)}
  </Fragment>
})

function mapStateToProps(state, ownProps) {
  const {sliceName, dataSlice} = instance
  // get the immutable job
  const {id} = ownProps
  const map = state[sliceName] || Map()
  const oMap = map.get(dataSlice) || OrderedMap()
  return {job: oMap.get(id)} // job immutable Map
}
