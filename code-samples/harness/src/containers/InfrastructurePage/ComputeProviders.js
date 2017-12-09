import React from 'react'
import { Utils } from 'components'
import css from './InfrastructurePage.css'
import apis from 'apis/apis'

const fragmentArr = [
  { infrastructures: [] }
  // will be set later
]

export default class ComputeProviders extends React.Component {
  state = { infrastructures: [] }

  componentWillMount () {
    this.fetchData()
    this.props.onPageWillMount(<h3 className="wings-page-header">Infrastructure</h3>, 'Infrastructure')
  }

  fetchData = () => {
    console.log(fragmentArr)
    fragmentArr[0].infrastructures = [ apis.fetchInfrastructures, 'overview=true']
    if (__CLIENT__ && !this.props.environments) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  renderRules (infrastructureMappingRules) {
    return (
      <div>
        <div className="row __headingRow">
          <div className="col-md-12">
            <span className="light pull-left">Rules</span>
            <span className="light pull-right">Automatically synch up hosts</span>
          </div>
        </div>
        <div className="row __listRow">

        </div>
      </div>
    )
  }

  renderHosts (hostUsage) {
    const __appsLength = Array.isArray(hostUsage.applicationHosts) ? hostUsage.applicationHosts.length : 0
    let appHostIndex = 0
    return (
      <div>
        <div className="row __headingRow">
          <div className="col-md-12">
            <span className="light pull-left">Hosts Usage</span>
            <span className="pull-right">
              <span><span className="light">Total Hosts: </span>{hostUsage.totalCount}</span>
              <span className="light">,&nbsp;</span>
              <span><span className="light">Unmapped Hosts: </span>{hostUsage.unmappedHostCount}</span>
            </span>
          </div>
        </div>

        {[...Array(Math.ceil(__appsLength / 4))].map((r, rowIndex) =>
          <div className="row __listRow">
            {[...Array(4)].map((c, colIndex) => {

              if (appHostIndex < __appsLength) {
                const obj = hostUsage.applicationHosts[appHostIndex++]
                return (
                  <div className="col-md-3 __appName">
                    <i className="icons8-server" />
                    <span>{obj.appName} : {obj.count}</span>
                  </div>
                )
              }

              return null
            })}
          </div>
        )}
      </div>
    )
  }

  render () {
    const data = Utils.getJsonValue(this, 'state.infrastructures.resource.response') || []
    console.log('infrastructures', data)

    return (
      <section className={css.main}>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-link wings-add-new">
                <div className="wings-add-new-icon"><i className="icons8-plus-filled"></i></div>Add Cloud Provider
              </button>
            </div>
            {data.map((item) =>
              <div className="col-md-12" key={item.uuid}>
                <div className="box-solid wings-card">
                  <div className="box-header with-border">
                    <div className="wings-card-header">
                      {item.name}
                    </div>
                  </div>
                  <div className="box-body __marginBottom20">
                    {/* this.renderRules(item.infrastructureMappingRules) */}
                    {this.renderHosts(item.hostUsage)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </section>
    )
  }

}



// WEBPACK FOOTER //
// ../src/containers/InfrastructurePage/ComputeProviders.js