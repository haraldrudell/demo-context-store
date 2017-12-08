import React from 'react'
import TimeAgo from 'react-timeago'
import Utils from '../Utils/Utils'

const UITimeAgo = props => (
  <TimeAgo date={props.value} title={Utils.formatDate(props.value)} minPeriod={30} data-value={props.value} />
)

export default UITimeAgo



// WEBPACK FOOTER //
// ../src/components/TimeAgo/UITimeAgo.js