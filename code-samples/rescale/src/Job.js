/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
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

// job is immutable Map
export default ({job}) => {
  console.log(typeof job, job.constructor.name)
  const {name, id, results: {status}} = job.toJSON()
  return <Card><CardContent>
    <Typography variant='title' align='center' gutterBottom>
      {name}
    </Typography>
    {status}<br/>
    id: {id}
  </CardContent></Card>}
