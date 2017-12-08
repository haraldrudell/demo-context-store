import React from 'react'
import ReactDOM from 'react-dom'
import Utils from '../Utils/Utils'
import AppStorage from '../AppStorage/AppStorage'
import { Overlay, Popover } from 'react-bootstrap'
import TaskNotificationTemplates from '../TaskNotification/TaskNotificationTemplates'
import RecentFailuresView from './RecentFailuresView'
import apis from 'apis/apis'
import css from './NotificationBar.css'

const ALL_FILTER = 'search[0][field]=actionable&search[0][op]=EQ&search[0][value]=false'
const ACTIONABLE_FILTER = 'search[0][field]=actionable&search[0][op]=EQ&search[0][value]=true'
const fragmentArr = [
  { allNotifs: [] },
  { actionableNotifs: [] },
  { activities: [] }, // recent failures
  { counters: [] }
]

class NotificationBar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    overlayShow: false,
    overlayTarget: null,
    overlayClass: css.notificationPopover,
    selectedType: '' // ALL | ACTIONABLE | FAILED
  }

  isClicked = false

  fetchData = () => {
    const optionalAppId = this.props.appId
    const acctId = AppStorage.get('acctId')
    fragmentArr[0].allNotifs = [ apis.fetchTaskNotifications, optionalAppId, acctId, ALL_FILTER ]
    fragmentArr[1].actionableNotifs = [ apis.fetchTaskNotifications, optionalAppId, acctId, ACTIONABLE_FILTER ]
    fragmentArr[2].activities = [ apis.fetchRecentFailures, optionalAppId ]
    fragmentArr[3].counters = [ apis.fetchNotificationCounters, optionalAppId ]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.apps) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
    this.fetchData()
  }

  componentDidMount () {
    window.addEventListener('click', this.closePopover)
    this.setState({ overlayTarget: ReactDOM.findDOMNode(this.refs.pending) })
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.closePopover)
  }

  closePopover = (ev) => {
    const el = Utils.findParentByChild(ev.target, '.__type')
    if (!el) {
      this.setState({ overlayShow: false })
    }
  }

  onHide = () => {
    console.log('onhide', this.isClicked)
    !this.isClicked && this.setState({ overlayShow: false })
  }

  onClick = (ev) => {
    const el = Utils.findParentByChild(ev.nativeEvent.target, '.__type')
    const iconEl = el.querySelector('i')
    const selectedType = el.dataset.type
    this.isClicked = true

    this.setState({ overlayShow: true, overlayTarget: iconEl, selectedType })

    setTimeout(() => {
      this.isClicked = false
    }, 1000)

    // setTimeout(() => {
    //   // only set Fx class for the 2nd show
    //   this.setState({ overlayClass: 'notificationPopoverFx' })
    // }, 0)
  }

  filterActivities (filter) {
    let _url = apis.getActivitiesEndpoint(this.appIdFromUrl, null, 'status=FAILED')
    const _environments = Object.keys(filter.environments)
    if (_environments.length > 0 ) {
      _url += '&environmentId=' + _environments.join('&environmentId=')
    }
    apis.service.list(_url).then((resp) => this.setState( { activities: resp } )).catch(error => { throw error })
  }

  renderPopover = () => {
    const allNotifs = Utils.getJsonValue(this, 'state.allNotifs.resource.response') || []
    const actionableNotifs = Utils.getJsonValue(this, 'state.actionableNotifs.resource.response') || []
    const recentFailures = Utils.getJsonValue(this, 'state.activities.resource.response') || []
    const counters = Utils.getJsonValue(this, 'state.counters.resource') || {}

    let itemList = []
    let headerEl
    let counterText
    switch (this.state.selectedType) {
      case 'ALL': itemList = allNotifs
        headerEl = <span>All Notifications</span>
        counterText = <span className="__counter"> ({counters.completedNotificationsCount} in the last hour)</span>
        break
      case 'ACTIONABLE': itemList = actionableNotifs
        headerEl = <span>Pending Actions</span>
        counterText = <span className="__counter"> ({counters.pendingNotificationsCount})</span>
        break
      case 'FAILED':
        headerEl = <span>Recent Failures</span>
        counterText = <span className="__counter"> ({counters.failureCount} in the last hour)</span>
        return (
          <div>
            <header className="__header">{headerEl}{counterText}</header>
            <RecentFailuresView activities={recentFailures}
              filterActivities={this.filterActivities.bind(this)}
              environments={[]} />
          </div>
        )
    }

    return (
      <div>
        <header className="__header">{headerEl}{counterText}</header>
        <ul className="__list">
          {itemList.map((item, i) => {
            return (
              <li key={item.uuid} className={item.notificationType + ' __menuContent '}>
                {TaskNotificationTemplates.get(item, this.fetchData)}
                { (i < (itemList.length - 1) ? <div className="divider" /> : '')}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }


  renderCountersForNoData (fullWidthCss) {
    return (
      <div ref="main" className={`${css.main} ${this.props.className} ${fullWidthCss}`}>

        <span ref="pending" className="__type __noData" data-type="ACTIONABLE">
          <i className="icons8-data-pending" />
          <span>0</span>
          {(this.props.fullWidth === true ? <span className="__text"> Pending</span> : null)}
        </span>
        <span className="__type __noData" data-type="FAILED" >
          <i className="icons8-high-priority-filled" />
          <span>0</span>
          {(this.props.fullWidth === true ? <span>
            <span className="__text"> Failure</span>
            <span className="__lastHour">in the last hour</span>
          </span> : null)}
        </span>
        <span className="__type __noData" data-type="ALL" >
          <i className="icons8-appointment-reminders-filled" />
          <span>0</span>
          {(this.props.fullWidth === true ? <span>
            <span className="__text"> All</span>
            <span className="__lastHour">in the last hour</span>
          </span> : null)}
        </span>
      </div>)
  }
  checkIfAllZeros (counters) {
    if (counters.pendingNotificationsCount === 0 &&
          counters.failureCount === 0 &&
          counters.completedNotificationsCount === 0 ) {
      return true
    }
    return false
  }

  render () {
    const counters = Utils.getJsonValue(this, 'state.counters.resource') || {}

    let fullWidthCss = ''
    if (this.props.fullWidth === true) {
      fullWidthCss = css.fullWidth
    }

    const pendingText = (counters.pendingNotificationsCount !== 1 ? 'Pending Actions' : 'Pending Action')
    const failureText = (counters.failureCount !== 1 ? 'Failures' : 'Failure')
    const allText = (counters.completedNotificationsCount !== 1 ? 'Notifications' : 'Notification')

    if ( this.props.appId !== 0 ) {

      return (
        <div ref="main" className={`${css.main} ${this.props.className} ${fullWidthCss}`}>

          <span ref="pending" className="__type __pending" data-type="ACTIONABLE" onClick={this.onClick}>
            <i className="icons8-data-pending" />
            <span>{counters.pendingNotificationsCount}</span>
            {(this.props.fullWidth === true ? <span className="__text"> {pendingText}</span> : null)}
          </span>
          <span className="__type __failed" data-type="FAILED" onClick={this.onClick}>
            <i className="icons8-high-priority-filled" />
            <span>{counters.failureCount}</span>
            {(this.props.fullWidth === true ? <span>
              <span className="__text"> {failureText}</span>
              <span className="__lastHour">in the last hour</span>
            </span> : null)}
          </span>
          <span className="__type __notifications" data-type="ALL" onClick={this.onClick}>
            <i className="icons8-appointment-reminders-filled" />
            <span>{counters.completedNotificationsCount}</span>
            {(this.props.fullWidth === true ? <span>
              <span className="__text"> {allText}</span>
              <span className="__lastHour">in the last hour</span>
            </span> : null)}
          </span>

          <Overlay
            rootClose={true}
            onHide={this.onHide.bind(this)}
            show={this.state.overlayShow}
            target={() => this.state.overlayTarget}
            placement="bottom"
          >
            <Popover id="nodePopover" ref="nodePopover" className={this.state.overlayClass}>

              {this.renderPopover()}

            </Popover>
          </Overlay>
        </div>
      )
    } else {
      return this.renderCountersForNoData()
    }
  }
}

export default Utils.createTransmitContainer(NotificationBar, [])



// WEBPACK FOOTER //
// ../src/components/NotificationBar/NotificationBar.js