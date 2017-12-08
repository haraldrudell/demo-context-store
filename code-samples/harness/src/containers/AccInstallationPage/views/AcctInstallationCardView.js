import React from 'react'
import TimeAgo from 'react-timeago'
import { Utils, Pills } from 'components'
import css from './AcctInstallationCardView.css'

export default class AcctInstallationCardView extends React.Component {
  renderNoDataMessage = () => {
    return (
      <main className="no-data-box">
        There are no delegates installed.
        <a target="_blank" href={this.props.params.downloadLink} className="__pluginsLink wings-text-link cta-button">
          Download Delegate zip
        </a>
      </main>
    )
  }

  render () {
    const delegates = Utils.getJsonValue(this, 'props.delegates') || []

    return (
      <div className={css.main}>
        {delegates.length === 0 && this.renderNoDataMessage()}

        {delegates.map((delegate, index) => {
          const includeScopes = Utils.getJsonValue(delegate, 'includeScopes') || []
          const excludeScopes = Utils.getJsonValue(delegate, 'excludeScopes') || []
          const hasScope = includeScopes.length > 0 || excludeScopes.length > 0

          const connectionStatus = delegate.connected === true ? 'Connected' : 'Disconnected'
          let statusIconEl = null
          if (delegate.connected) {
            statusIconEl = <i className="icons8-ok-filled __status_ENABLED __status_Connected" />
          } else {
            statusIconEl = <i className="icons8-error-filled __status_ENABLED __status_Disconnected" />
          }
          return (
            <div className="row wings-card-row" key={index} data-name="delegate">
              <div className="col-md-12 wings-card-col">
                <div className="box-solid wings-card">
                  <div className="box-header with-border">
                    <div className="wings-card-header">
                      <div>Delegate</div>
                    </div>
                  </div>

                  <dl className="dl-horizontal wings-dl __dl">
                    <div>
                      <dt>Hostname</dt>
                      <dd>{delegate.hostName}</dd>
                    </div>
                    <div>
                      <dt>IP</dt>
                      <dd>{delegate.ip}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        {delegate.status}
                        {statusIconEl} {connectionStatus}
                      </dd>
                    </div>
                    <div>
                      <dt>Last heartbeat</dt>
                      <dd>
                        <TimeAgo date={delegate.lastHeartBeat} minPeriod={30} /> -{' '}
                        {Utils.formatDate(delegate.lastHeartBeat)}
                      </dd>
                    </div>
                    <div>
                      <dt>Version</dt>
                      <dd>{delegate.version}</dd>
                    </div>
                    <div>
                      <dt>Scope Included</dt>
                      <dd>
                        <Pills
                          data={delegate.includeScopes}
                          data-name="included-scope-list"
                          onEdit={scope => this.props.onEditScope(delegate, hasScope, scope, 'INCLUDE')}
                          onAdd={() => this.props.onAddScope(delegate, hasScope, 'INCLUDE')}
                          onDelete={async scope => await this.props.onDeleteScope(delegate, scope, 'INCLUDE')}
                        />
                      </dd>
                    </div>
                    <div>
                      <dt>Scope Excluded</dt>
                      <dd>
                        <Pills
                          data-name="excluded-scope-list"
                          data={delegate.excludeScopes}
                          onEdit={scope => this.props.onEditScope(delegate, hasScope, scope, 'EXCLUDE')}
                          onAdd={() => this.props.onAddScope(delegate, hasScope, 'EXCLUDE')}
                          onDelete={async scope => await this.props.onDeleteScope(delegate, scope, 'EXCLUDE')}
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AccInstallationPage/views/AcctInstallationCardView.js