import React from 'react'
import css from './ServiceInstanceCardView.css'
import { Utils } from 'components'

export default class ServiceInstanceCardView extends React.Component {
  onNameClick = e => {
    Utils.redirect({ appId: true, envId: true, page: 'hosts' })
  }

  render () {
    return (
      <div className={`row wings-card-row ${css.main}`}>
        {Utils.noDataMsg(this.props.params.data)}

        {this.props.params.data.map(item =>
          <div key={item.uuid} className="col-md-4 wings-card-col">
            <div className="box-solid wings-card">
              <div className="box-header __header">
                <span className="wings-text-link" onClick={this.onNameClick}>
                  {item.host.hostName} : {item.serviceTemplate.name}
                </span>
                <span className="hidden uuid">
                  {item.uuid}
                </span>
              </div>
              <div className="box-body">
                <dl className="dl-horizontal wings-dl">
                  <dt>Host Name </dt>
                  <dd>
                    {item.host ? item.host.hostName : String.fromCharCode(65112)}
                  </dd>
                  <dt>Service</dt>
                  <dd>
                    {item.serviceTemplate ? item.serviceTemplate.name : String.fromCharCode(65112)}
                  </dd>
                  <dt>Recent Release</dt>
                  <dd>
                    {item.release ? item.release.releaseName : String.fromCharCode(65112)}
                  </dd>
                  <dt>Recent Artifact</dt>
                  <dd>
                    {item.artifact ? item.artifact.displayName : String.fromCharCode(65112)}
                  </dd>
                </dl>
              </div>
              <div className="box-footer wings-card-footer">
                <span>
                  {' '}{item.lastDeployedOn > 0 ? Utils.formatDate(item.lastDeployedOn) : 'Not Deployed yet!'}{' '}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceInstancePage/views/ServiceInstanceCardView.js