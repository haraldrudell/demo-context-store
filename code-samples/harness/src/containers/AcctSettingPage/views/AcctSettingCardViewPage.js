import React from 'react'
import css from './AcctSettingCardViewPage.css'

export default class AcctSettingCardViewPage extends React.Component {
  componentWillMount () {
  }

  render () {
    return (
      <div className={`row wings-card-row ${css.main}`}>
        {this.props.params.data.map((item) =>
          <div key={item.uuid} className="col-md-12 wings-card-col">
            <div className="box-solid wings-card">
              <div className="box-header">
                <div className="wings-card-header">
                  <div>{item.name}</div>
                </div>
                <div className="wings-card-actions">
                  <span>
                    <i className="icons8-pencil-tip" onClick={() => this.props.params.onEdit(item)}></i>
                  </span>
                  <span>
                    <i className="icons8-waste" onClick={this.props.params.onDelete.bind(this, item.uuid)}></i>
                  </span>
                </div>
              </div>
              <div className="box-body wings-card-body">
                <dl className="dl-horizontal wings-dl __dl">
                  {Object.keys(item.value).map(key => {
                    if (key.indexOf('pass') < 0 && key.indexOf('secret') < 0 && key.indexOf('key') < 0) {
                      return (
                        <div>
                          <dt>{key}</dt>
                          <dd>{item.value[key]}</dd>
                        </div>
                      )
                    }
                    return null
                  })
                  }
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
// ../src/containers/AcctSettingPage/views/AcctSettingCardViewPage.js