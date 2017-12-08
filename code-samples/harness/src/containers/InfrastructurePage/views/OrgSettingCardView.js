import React from 'react'
import { Utils } from 'components'
import css from './OrgSettingCardView.css'

export default class OrgSettingCardView extends React.Component {

  render () {
    return (
      <div className={`row wings-card-row ${css.main}`}>
        {Utils.noDataMsg(this.props.params.data)}

        {this.props.params.data.map((item) => {
          const arr = []
          for (const k in item.value) {
            if (k === 'type') {
              continue
            }
            if (k === 'password') {
              item.value[ k ] = '•••'
            }
            arr.push({
              name: k,
              value: item.value[ k ]
            })
          }
          return (
            <div key={item.uuid} className="col-md-12 wings-card-col">
              <div className="box-solid wings-card">
                <div className="box-header __header">
                  <span className="wings-text-link">
                    {item.name}
                  </span>
                </div>
                <div className="box-body">
                  {arr.map((valObj) => {
                    return (
                      <dl className="dl-horizontal wings-dl">
                        <dt>{valObj.name}</dt>
                        <dd>{valObj.value}</dd>
                      </dl>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        }
        )}
      </div>
    )
  }
}





// WEBPACK FOOTER //
// ../src/containers/InfrastructurePage/views/OrgSettingCardView.js