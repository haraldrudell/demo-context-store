import React from 'react'
import Utils from '../Utils/Utils'
import TimeAgo from 'react-timeago'
import css from './NewDataSinceLastTime.css'
import apis from 'apis/apis'

const fragmentArr = [
  { userStats: [ apis.fetchStatistics, 'user-stats' ] }
]

class NewDataSinceLastTime extends React.Component {

  componentWillMount () {
    this.fetchData()
  }

  fetchData = () => {
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  render () {
    const userStats = Utils.getJsonValue(this, 'state.userStats.resource') || {}
    const timeAgo = (userStats.lastFetchedOn ? <TimeAgo date={userStats.lastFetchedOn} minPeriod={30}/> : null)

    const deploymentsCountEl = (userStats.deploymentCount === 0 ? null : (
      <span>{userStats.deploymentCount} Deployments</span>
    ))
    const releaseCountEl = (userStats.releaseCount === 0 ? null : (
      <span>{userStats.releaseCount} Releases</span>
    ))

    let sinceLastLoginEl
    if (userStats.deploymentCount === 0 && userStats.releaseCount === 0) {
      sinceLastLoginEl = <span className="__text">No new deployment or release since last login ({timeAgo})</span>
    } else {
      sinceLastLoginEl = <span className="__text">since last login ({timeAgo})</span>
    }

    return (
      <div className={css.main}>
        {deploymentsCountEl}
        {releaseCountEl}
        {sinceLastLoginEl}
      </div>
    )
  }
}

export default Utils.createTransmitContainer(NewDataSinceLastTime, fragmentArr)



// WEBPACK FOOTER //
// ../src/components/NewDataSinceLastTime/NewDataSinceLastTime.js