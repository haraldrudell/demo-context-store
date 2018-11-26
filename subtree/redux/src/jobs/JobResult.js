/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import {getSliceData} from './jobsSlice'
import {List} from 'immutable'
import styled from 'styled-components'

const Img = styled.img`
max-width: 100%
`
export default connect(mapStateToProps)(({job, id}) => { // job is immutable Map
  const name = job && job.get('name') // string
  const results = job && job.get('results') // Map
  const imageUrls = (results && results.get('images')) || List()

  return <Fragment>
    <Typography variant='title' align='center' gutterBottom>
      Results: {name} {id}
    </Typography>
    {imageUrls.map((uri, i) => <Img src={uri} alt='resultImage' key={i} />)}
  </Fragment>
})

function mapStateToProps(state, ownProps) {
  const {id} = ownProps
  const {data: oMap} = getSliceData(state)
  return {job: oMap.get(id)} // job immutable Map
}
