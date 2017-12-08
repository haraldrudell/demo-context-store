import React from 'react'
import css from './AppSummaryCardView.css'
import AppCardFooter from '../../ApplicationPage/views/AppCardFooter'
import { AppStats } from 'components'

export default class AppSummaryCardView extends React.Component {
  render () {
    if (!this.props.app) {
      return null
    }

    return (
      <div>
        <div className={`box-solid wings-card ${css.main}`}>
          <div className="box-body __body __thickBackground wings-card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="__heading">Production</div>
                <div>
                  <AppStats
                    app={this.props.app}
                    appKeyStatistics={this.props.app.appKeyStatistics.statsMap.PROD}
                    statsType={'PROD'}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="__heading">Non-Production</div>
                <div>
                  <AppStats
                    app={this.props.app}
                    appKeyStatistics={this.props.app.appKeyStatistics.statsMap.NON_PROD}
                    statsType={'NON_PROD'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="box-footer wings-card-footer __footer">
            <AppCardFooter app={this.props.app} params={this.props.params} />
          </div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AppOverview/views/AppSummaryCardView.js