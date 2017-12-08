import React from 'react'
import TimeAgo from 'react-timeago'
import { CompUtils, Utils } from 'components'

import css from './LastActivityHistory.css'

export default class LastActivityHistory extends React.Component {

  render () {
    const activities = this.props.data

    return (
      <section className={css.main}>
        <div className="__header">History</div>

        {activities.map((activity, idx) => {
          if (idx === 0) {
            return null // skip the first item because the grid already has it
          }
          return (
            <div key={activity.uuid}>
              {CompUtils.renderStatusIcon(activity.status)}
              <span className="wings-text-link" onClick={Utils.goToActivity.bind(this, activity.uuid)}>
                {activity.commandType} / {activity.commandName}
              </span>
              <span> - </span>
              <TimeAgo date={activity.createdAt} minPeriod={30}/>
            </div>
          )
        })}
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceInstancePage/views/LastActivityHistory.js