import React from 'react'
import css from './AcctPluginCardViewPage.css'

export default class AcctPluginCardViewPage extends React.Component {
  componentWillMount () {
  }

  render () {
    return (
      <div className={`row wings-card-row ${css.main}`}>
        {this.props.params.data.map((item) =>
          <div key={item.uuid} className="col-md-6 wings-card-col">
            <div className="box-solid wings-card">
              <div className="box-header with-border">
                {item.displayName}
                <div className="wings-card-actions">
                </div>
              </div>
              <div className="box-body wings-card-body">
                <dl className="dl-horizontal wings-dl __dl">
                  <dt>Type</dt>
                  <dd>{item.type}</dd>
                  <dt>Status</dt>
                  <dd>{item.enabled ? 'Enabled' : 'Not Enabled'}</dd>
                  <dt>Category</dt>
                  <dd>{item.pluginCategories.join(', ')}</dd>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctPluginPage/views/AcctPluginCardViewPage.js