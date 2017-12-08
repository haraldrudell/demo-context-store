import React from 'react'
import { DropdownButton, Dropdown, MenuItem } from 'react-bootstrap'
import Calendar from 'rc-calendar/lib/RangeCalendar'
import GregorianCalendar from 'gregorian-calendar'
import enUS from 'gregorian-calendar/lib/locale/en_US'
import { Utils, DeploymentsList } from 'components'
import css from './DeploymentOverviewCardView.css'

const status = { SUCCESS: 'Success', FAILED: 'Failed', INPROGRESS: 'In Progress' }
const gc1 = new GregorianCalendar(enUS)
const gc2 = new GregorianCalendar(enUS)

export default class DeploymentOverviewCardView extends React.Component {
  state = {}
  filter = { status: {}, fromDate: null, toDate: null, environments: {} }
  envCount = {}
  environments = null
  executions = null
  cLow = null
  cHigh = null
  initialized = false

  componentWillMount () {
    if (!this.initialized) {
      this.initFilter(this.props)
    }
  }

  componentWillReceiveProps (newProps) {
    if (!this.initialized) {
      this.initFilter(newProps)
    }

    if (newProps.environments && newProps.executions) {
      this.updateEnvCount(newProps.environments, newProps.executions)
      this.initExecutions(newProps.executions)
    }
  }

  // Helpers
  updateEnvCount (environments, executions) {
    if (environments) {
      environments.map(env => {
        this.envCount[env.uuid] = 0
      })
    }

    if (executions) {
      executions.map(d => {
        this.envCount[d.envId] = this.envCount[d.envId] + 1
      })
    }
  }

  initFilter (props) {
    if (props.environments) {
      this.environments = props.environments
      // Environments
      props.environments.map(env => {
        this.filter.environments[env.uuid] = true
        this.envCount[env.uuid] = 0
      })

      // Status
      Object.keys(status).map(st => {
        this.filter.status[st] = true
      })

      // All Done
      this.initialized = true
    }
  }

  initExecutions (executions) {
    this.executions = executions

    if (this.executions.length <= 0) {
      return
    }

    // Date Filter
    if (!this.filter.fromDate) {
      this.filter.fromDate = this.executions[this.executions.length - 1].startTs
      this.filter.toDate = Date.now()
    }

    this.setState({ __update: Date.now() })
  }

  getCalendarTime () {
    gc1.setTime(this.filter.fromDate)
    gc2.setTime(this.filter.toDate)
    return [gc1, gc2]
  }

  // Action Handlers
  handleChange (e, entity) {
    if (e.target.checked) {
      entity[e.target.value] = true
    } else if (Object.keys(entity).length > 1) {
      // Prevent uncheck all options
      delete entity[e.target.value]
    }
    this.setState({ __update: Date.now() })
    this.props.filterExecutions(this.filter)
  }

  onSelectCalendar (value) {
    value[0].setHourOfDay(0)
    value[0].setMinutes(0)
    value[1].setHourOfDay(23)
    value[1].setMinutes(59)
    this.filter.fromDate = value[0].getTime()
    this.filter.toDate = value[1].getTime()
    this.props.filterExecutions(this.filter)
  }

  onRowClick = exec => {
    Utils.redirect({ appId: exec.appId, envId: exec.envId, executionId: exec.uuid, page: 'detail' })
  }

  // Renders
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

  renderStatus () {
    return (
      <DropdownButton id="__status" bsStyle="link" title="Status" key="Status" pullRight>
        {Object.keys(status).map(st => this.renderCheckbox(st, status[st], this.filter.status))}
      </DropdownButton>
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

  renderDate () {
    return (
      <DropdownButton id="__Date" bsStyle="link" title="Date" key="Date" pullRight>
        <div>
          <Calendar defaultSelectedValue={this.getCalendarTime()} onSelect={e => this.onSelectCalendar(e)} />
        </div>
      </DropdownButton>
    )
  }

  render () {
    return (
      <div className={'row ' + css.main} style={{ padding: '0px 7px' }}>
        <div className="col-md-12">
          <div className="box-solid wings-card">
            <div className="box-header with-border">
              <span>Recent Deployments</span>
              <div className="wings-card-actions">
                <Dropdown id="_deploymentCardOverviewMenu" pullRight className="wings-threedots">
                  <i className="fa fa-ellipsis-v" bsRole="toggle" />
                  <Dropdown.Menu bsRole="menu">
                    {this.renderStatus()}
                    <MenuItem divider />
                    {this.renderDate()}
                    <MenuItem divider />
                    {this.renderEnv()}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="box-body wings-card-body">
              <DeploymentsList
                {...this.props}
                dataStore={this.props.dataStore}
                executions={this.executions}
                showApp={false}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AppOverview/views/DeploymentOverviewCardView.js