import React from 'react'
import css from './AppTrendsCardView.css'
import { SparkChart } from 'components'
import { NavDropdown, MenuItem } from 'react-bootstrap'

export default class AppTrendsCardView extends React.Component {
  chartSelectionTypes = {
    ALL: 'All',
    PROD: 'Production',
    NON_PROD: 'Non Production'
  }

  chartSelection = 'ALL'
  deploymentStats = null
  sparkChartActiveElement = 0
  sparkChartSelectedElement = 0

  setChartType (type) {
    this.chartSelection = type
    this.setState({ __update: Date.now() })
  }

  setActive = dataElem => {
    this.sparkChartActiveElement = dataElem.date
    this.setState({ __update: this.sparkChartActiveElement })
  }

  setSelectedActive = dataElem => {
    this.sparkChartSelectedElement = dataElem.date
    this.setState({ __update: this.sparkChartSelectedElement })
  }

  renderSparkCharts () {
    const deploymentStats = this.props.deploymentStats
    if (!deploymentStats) {
      return null
    }

    const _arr = ['totalCount', 'failedCount', 'instancesCount']
    const _textLabels = {
      totalCount: 'Deployments',
      failedCount: 'Failed Deployments',
      instancesCount: 'Instances Deployed'
    }

    return (
      <div className="row">
        {_arr.map((type, index) => {
          const className = index < _arr.length - 1 ? '__rightBorder' : ''
          const sharedProps = {
            chartSelection: this.chartSelection,
            data: deploymentStats[this.chartSelection].daysStats,
            dataField: type,
            setActive: this.setActive,
            setSelectedActive: this.setSelectedActive,
            activeElement: this.sparkChartActiveElement,
            selectedElement: this.sparkChartSelectedElement,
            onDateClick: this.props.onDateClick
          }
          return (
            <div key={index} className={`col-md-4 ${className}`}>
              <SparkChart {...sharedProps} />
              <div className="__chartLabel">
                {_textLabels[type]}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  render () {
    if (!this.props.app) {
      return null
    }

    return (
      <div>
        <div className={`box-solid wings-card ${css.main}`}>
          <div className="box-header">
            <div className="wings-card-header">30 day Trends</div>
            <div className="wings-card-actions">
              <NavDropdown
                title={this.chartSelectionTypes[this.chartSelection]}
                id="deploymentsDropdown"
                className="dropDownHarness"
                pullRight={true}
              >
                {Object.keys(this.chartSelectionTypes).map((k, i) => {
                  return (
                    <MenuItem key={i} onSelect={this.setChartType.bind(this, k)}>
                      {this.chartSelectionTypes[k]}
                    </MenuItem>
                  )
                })}
              </NavDropdown>
            </div>
          </div>
          <div className="box-body wings-card-body">
            {this.renderSparkCharts()}
          </div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AppOverview/views/AppTrendsCardView.js