/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const P = styled.p`
  padding-left: 1em
  text-indent: -1em
`

export default ({title = 'Error:', e}) => {
  const lines = String((e && e.stack) || e).split('\n')
  const firstLine = lines.shift() || ''
  return <Fragment>
    <Typography variant='title' gutterBottom>
      {title}
    </Typography>
    <P>{firstLine}{!!lines.length && lines.map((line, i) => <Fragment key={i} >
      <br/>{line}
    </Fragment>)}</P>
  </Fragment>}
