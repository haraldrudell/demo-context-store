import React from 'react'
import css from './AppStats.css'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import apis from 'apis/apis'
import Utils from '../Utils/Utils'

export default class AppStats extends React.Component {
  selectionTypes = {
    '7': 'Last 7 days',
    '15': 'Last 15 days',
    '30': 'Last 30 days'
  }

  selection = '30'
  appKeyStatistics = null
  statsType = 'ALL'

  componentWillMount () {
    this.appKeyStatistics = this.props.appKeyStatistics
    this.statsType = this.props.statsType ? this.props.statsType : 'ALL'
  }

  setSelection (type) {
    this.selection = type
    this.fetchDetails()
  }

  fetchDetails = () => {
    apis.service
      .list(apis.getStatisticsEndpoint(this.props.app.uuid, 'app-keystats', `numOfDays=${this.selection}`))
      .then(resp => {
        if (resp.resource) {
          this.appKeyStatistics = resp.resource.statsMap[this.statsType]
          this.setState({ __update: Date.now() })
        }
      })
      .catch(error => {
        throw error
      })
  }

  renderStatisticsForNoData () {
    return (
      <div className={'row __appStats ' + css.main}>
        <div className="__dropDown">
          <NavDropdown title={this.selectionTypes[this.selection]} id="keyStatsDropDown" className="dropDownHarness">
            {Object.keys(this.selectionTypes).map((k, i) => {
              return (
                <MenuItem key={i} onSelect={this.setSelection.bind(this, k)}>
                  {this.selectionTypes[k]}
                </MenuItem>
              )
            })}
          </NavDropdown>
        </div>

        <div className="col-md-4 __rightBorder">
          <div className={css.noData}>0 </div>
          <div className={css.smallText}> Deployments</div>
        </div>
        <div className="col-md-4 __rightBorder">
          <div className={css.noData}> 0 </div>
          <div className={css.smallText}> Instances Deployed</div>
        </div>
        <div className="col-md-4">
          <div className={css.noData}> 0 </div>
          <div className={css.smallText}> Artifacts Deployed</div>
        </div>
      </div>
    )
  }

  render () {
    if (this.props.app === 0) {
      return this.renderStatisticsForNoData()
    }

    return (
      <div className={'row __appStats ' + css.main}>
        <div className="__dropDown">
          <NavDropdown title={this.selectionTypes[this.selection]} id="keyStatsDropDown" className="dropDownHarness">
            {Object.keys(this.selectionTypes).map((k, i) => {
              return (
                <MenuItem key={i} onSelect={this.setSelection.bind(this, k)}>
                  {this.selectionTypes[k]}
                </MenuItem>
              )
            })}
          </NavDropdown>
        </div>
        <div className="col-md-4 __rightBorder">
          <div className={`${css.largeText} __largeText`}>
            {Utils.kFormatter(this.appKeyStatistics.deploymentCount)}{' '}
          </div>
          <div className={css.smallText}> Deployments</div>
        </div>
        <div className="col-md-4 __rightBorder">
          <div className={`${css.largeText} __largeText`}>
            {' '}{Utils.kFormatter(this.appKeyStatistics.instanceCount)}{' '}
          </div>
          <div className={css.smallText}> Instances Deployed</div>
        </div>
        <div className="col-md-4">
          <div className={`${css.largeText} __largeText`}>
            {' '}{Utils.kFormatter(this.appKeyStatistics.artifactCount)}{' '}
          </div>
          <div className={css.smallText}> Artifacts Deployed</div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppStats/AppStats.js