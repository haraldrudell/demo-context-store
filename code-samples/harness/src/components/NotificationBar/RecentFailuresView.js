import React from 'react'
import { Dropdown } from 'react-bootstrap'
import AppStorage from '../AppStorage/AppStorage'
import Utils from '../Utils/Utils'
import moment from 'moment'
import css from './RecentFailuresView.css'

export default class RecentFailuresView extends React.Component {
  state = {}
  filter = { environments: {} }
  envCount = {}
  initialized = false
  environments = []

  componentWillMount () {
    if (!this.initialized) {
      this.initFilter(this.props)
    }

    if (this.props.environments && this.props.activities) {
      this.environments = this.props.environments
      this.updateEnvCount(this.props)
      this.initActivities(this.props)
    }
  }

  componentWillReceiveProps (newProps) {
    if (!this.initialized) {
      this.initFilter(newProps)
    }
    if (newProps.environments && newProps.activities) {
      this.environments = newProps.environments
      this.updateEnvCount(newProps)
      this.initActivities(newProps)
    }
  }

  initFilter (newProps) {
    if (newProps.environments) {
      // Environments
      newProps.environments.map(env => {
        this.filter.environments[env.uuid] = true
      })
      // All Done
      this.initialized = true
    }
  }

  initActivities (newProps) {
    this.activities = newProps.activities
    this.setState({ __update: Date.now() })
  }

  formatDate (timeObj, format = 'MM/DD/YYYY') {
    return timeObj ? moment.unix(timeObj / 1000).format(format) : ''
  }

  organize (activities) {
    const obj = {}
    for (const i in activities) {
      const dt = this.formatDate(activities[i].createdAt)
      if (obj[dt]) {
        obj[dt].push(activities[i])
      } else {
        obj[dt] = [activities[i]]
      }
    }
    return obj
  }

  updateEnvCount (newProps) {
    if (newProps.environments) {
      newProps.environments.map(env => {
        this.envCount[env.uuid] = 0
      })
    }
    if (newProps.activities) {
      newProps.activities.map(activity => {
        this.envCount[activity.environmentId]++
      })
    }
    this.setState({ __update: Date.now() })
  }

  onCloseRightMenu = e => {
    this.props.filterActivities(this.filter)
  }

  onClick = a => {
    AppStorage.set('env', a.environmentId)
    Utils.redirect({ appId: a.appId, envId: a.environmentId, page: 'activities?details=' + a.uuid })
  }

  handleChange (e, entity) {
    if (e.target.checked) {
      entity[e.target.value] = true
    } else if (Object.keys(entity).length > 1) {
      // Prevent uncheck all options
      delete entity[e.target.value]
    }
    this.setState({ __update: Date.now() })
    this.props.filterActivities(this.filter)
  }

  renderCheckbox (value, label, entity, count = null) {
    const checked = entity[value] ? true : false
    return (
      <div key={value} className={'checkbox ' + label.replace(/ /g, '')}>
        <label>
          <input
            type="checkbox"
            name={value}
            value={value}
            checked={checked}
            onChange={e => this.handleChange(e, entity)}
          />
          {label}
        </label>
        {checked && typeof count === 'number'
          ? <span className="__count pull-right light">
            {count}
          </span>
          : ''}
      </div>
    )
  }

  renderEnv () {
    if (this.environments) {
      return (
        <div>
          {this.environments.map(env =>
            this.renderCheckbox(env.uuid, env.name, this.filter.environments, this.envCount[env.uuid])
          )}
        </div>
      )
    }
    return null
  }

  render () {
    const obj = this.organize(this.activities)
    let actionMenus = null
    if (this.environments && this.environments.length > 0) {
      actionMenus = (
        <div className="wings-card-actions">
          <Dropdown
            id="recentFailuresMenu"
            pullRight
            className="wings-threedots __menu"
            onClose={e => this.onCloseRightMenu(e)}
          >
            <i className="fa fa-ellipsis-v" bsRole="toggle" />
            <Dropdown.Menu bsRole="menu">
              {this.renderEnv()}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )
    }

    return (
      <div className={'row __recentFailures ' + css.main}>
        <div className="col-md-12">
          <div className="box-solid wings-card">
            <div className="box-header with-border">
              {actionMenus}
            </div>
            <div className="box-body">
              <div className={'__recentFailuresContent ' + css.infinte}>
                {Object.keys(obj).map((key, i) => {
                  return (
                    <div key={key}>
                      {obj[key].map(item => {
                        // const _env = this.environments.find((env) => env.uuid === item.environmentId)
                        let itemStr = `${item.applicationName}: ${item.serviceName}: ${item.commandName}`
                        // don't render app name when under an app:
                        if (window.location.href.indexOf('/app') > 0) {
                          itemStr = `${item.serviceName}: ${item.commandName}`
                        }
                        return (
                          <div key={item.uuid} className="row __menuContent">
                            <span className="col-md-1 col-xs-1">
                              <i className="icons8-high-priority" />
                            </span>
                            <span
                              className="col-md-10 col-xs-10 wings-text-link"
                              onClick={this.onClick.bind(this, item)}
                            >
                              {itemStr} failed on {item.hostName} {item.environmentName}
                            </span>
                            <span className="__date">
                              {key}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/NotificationBar/RecentFailuresView.js