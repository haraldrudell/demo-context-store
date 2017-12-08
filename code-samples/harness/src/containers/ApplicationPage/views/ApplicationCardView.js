import React from 'react'
import reactUpdate from 'react-addons-update'
import { AppStats, BubbleChart } from 'components'
import AppCardActions from './AppCardActions'
import AppCardFooter from './AppCardFooter'
import css from './ApplicationCardView.css'

const PG_SZ = 3

export default class ApplicationCardView extends React.Component {
  state = { filteredData: [], noDataCls: '__hide' }

  componentWillMount () {
    this.setState({ filteredData: this.props.params.data, noDataCls: this.props.noDataCls })
  }

  componentWillReceiveProps (newProps) {
    this.setState({ filteredData: newProps.params.data, noDataCls: newProps.noDataCls })
    if (newProps.params.searchText && newProps.params.searchText.length > 0) {
      this.onSearchChanged(null, newProps.params.searchText)
    }
  }

  onSearchChanged = (ev, searchText) => {
    const filteredData = this.props.params.data.filter(
      item => item.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
    )
    this.setState({ filteredData })
  }

  getExecutions = app => {
    if (app.recentExecutions) {
      if (!app.currentShowing) {
        app.currentShowing = app.recentExecutions.length - 1
      }
      const begin = app.currentShowing >= PG_SZ ? app.currentShowing - PG_SZ : 0
      return app.recentExecutions.slice(begin, app.currentShowing)
    }
    return app.recentExecutions
  }

  onArrowClick = (app, index, isLeft, e) => {
    e.preventDefault()
    if (isLeft) {
      app.currentShowing = app.currentShowing >= PG_SZ ? app.currentShowing - PG_SZ : 0
      app.hasRight = true
      app.hasLeft = app.currentShowing - PG_SZ > 0
    } else {
      const reLength = app.recentExecutions.length
      app.currentShowing = app.currentShowing < reLength - PG_SZ ? app.currentShowing + PG_SZ : reLength
      app.hasLeft = true
      app.hasRight = reLength - app.currentShowing >= PG_SZ
    }
    const data = []
    data[index] = { $set: app }
    this.setState({ filteredData: reactUpdate(this.state.filteredData, data) })
  }
  renderDescription = description => {
    if (description) {
      return (
        <span className="__appDescription">
          {' '}({description})
        </span>
      )
    }
  }

  renderAppData () {
    if ((!this.state.filteredData || this.state.filteredData.length === 0) && this.props.noDataCls !== '__hide') {
      return this.renderAppsForNoData()
    }

    {
      return this.state.filteredData.map((item, index) => {
        return (
          <div key={item.uuid} data-name={item.name} className="col-md-12 wings-card-col wings-card-col-app">
            <div className="box-solid wings-card">
              <div className="box-header">
                <div className="wings-card-header">
                  <div
                    className="wings-text-link __name"
                    data-name="application-name-link"
                    onClick={this.props.params.onNameClick.bind(this, item.uuid)}
                  >
                    {item.name}
                  </div>
                  {this.renderDescription(item.description)}
                  {/* Hiding notification bar for prelaunch <NotificationBar appId={item.uuid}
                  className="__notificationBar" />*/}
                </div>
                <div className="wings-card-actions">
                  <AppCardActions app={item} params={this.props.params} />
                </div>
              </div>
              <div className="box-body __body __thickBackground wings-card-body">
                <div className="row">
                  <div className="col-md-6">
                    <AppStats app={item} appKeyStatistics={item.appKeyStatistics.statsMap.ALL} />
                  </div>
                  <div className="col-md-6 __deploymentBubbles">
                    <div className="__tasksBody">
                      <span>
                        {' '}Latest Deployments <span className="light">(Last 30 days)</span>
                      </span>
                    </div>
                    <BubbleChart
                      environments={item.environments}
                      executions={this.getExecutions(item)}
                      hasLeft={item.hasLeft}
                      hasRight={item.hasRight}
                      onLeftArrowClick={this.onArrowClick.bind(this, item, index, true)}
                      onRightArrowClick={this.onArrowClick.bind(this, item, index, false)}
                      noDataCls={this.props.noDataCls}
                    />
                  </div>
                </div>
              </div>
              <div className="box-footer wings-card-footer __footer">
                <AppCardFooter app={item} />
              </div>
            </div>
          </div>
        )
      })
    }
  }

  renderAppsForNoData () {
    return (
      <div key={1} data-name="None" className={`col-md-12 wings-card-col ${this.state.noDataCls}`}>
        <div className="box-solid wings-card">
          <div className="box-header">
            <div className="wings-card-header">
              <div className="wings-text-link __none">None</div>
              {/* hiding notifications for now  <NotificationBar appId={0} className="__notificationBar" />*/}
            </div>
            <div className="wings-card-actions">
              <AppCardActions />
            </div>
          </div>
          <div className="box-body __body __thickBackground wings-card-body">
            <div className="row">
              <div className="col-md-6">
                <AppStats app={0} />
              </div>
              <div className="col-md-6">
                <div className="__tasksBody">
                  <span>
                    {' '}Latest Deployments <span className="light">(Last 30 days)</span>
                  </span>
                </div>
                <BubbleChart
                  environments="0"
                  executions="-1"
                  hasLeft={true}
                  hasRight={false}
                  noDataCls={this.props.noDataCls}
                />
              </div>
            </div>
          </div>
          <div className="box-footer wings-card-footer __footer">
            <AppCardFooter />
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className={css.main + ' row'}>
        {this.renderAppData()}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ApplicationPage/views/ApplicationCardView.js