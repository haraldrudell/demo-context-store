import React from 'react'
import { Utils } from 'components'
import css from './InfrastructureMappingCardView.css'

export default class InfrastructureMappingCardView extends React.Component {
  state = { noInfraCls: 'hide', sortedInfraMappings: null, spinnerClass: '' }

  componentDidMount () {
    // console.log(this.props.loadingStatus)
  }

  componentWillReceiveProps (newProps) {
    // console.log(newProps.loadingStatus)
    if (newProps.params.data !== null) {
      const sortedData = this.filterServicesByInfraMapping(newProps.params.data)
      this.setState({ sortedInfraMappings: sortedData })
    }
  }

  getComputeProviderName = computeProviderSettingId => {
    return this.props.objComputeProviders[computeProviderSettingId]
      ? this.props.objComputeProviders[computeProviderSettingId].name
      : null
  }

  getInfraMappings (serviceTemplate) {
    if (this.props.infrastructures && serviceTemplate) {
      return this.props.infrastructures.filter(inf => inf.serviceTemplateId === serviceTemplate.uuid)
    }

    return null
  }

  getDetails = infraMapping => {
    if (!infraMapping) {
      return ''
    }

    let _text = ''
    switch (infraMapping.computeProviderType) {
      case 'AWS':
        if (infraMapping.deploymentType === 'ECS') {
          _text += 'Cluster Name:' + infraMapping.clusterName
        }

        break
      case 'GCP':
        if (infraMapping.deploymentType === 'KUBERNETES') {
          _text += 'Cluster Name:' + infraMapping.clusterName
        }

        break
      case 'PHYSICAL_DATA_CENTER':
        _text = this.hostNames(infraMapping.hostNames)
        break
      default:
        return ''
    }
    return _text
  }

  hostNames (hosts) {
    if (!hosts) {
      return ''
    }

    const maxHosts = 5,
      names = []
    const length = Math.min(maxHosts, hosts.length)
    for (let i = 0; i < length; i++) {
      names.push(hosts[i])
    }
    if (maxHosts < hosts.length) {
      names.push(' and ' + (hosts.length - maxHosts) + ' more')
    }
    return names.join(', ')
  }

  renderInfraMappings (serviceTemplate) {
    const mappings = this.getInfraMappings(serviceTemplate)
    if (Array.isArray(mappings) && mappings.length > 0) {
      return (
        <div>
          {mappings.map((item, index) =>
            <div key={item.uuid} className="__infraMappingDetails">
              <div className="content" data-name={item.name}>
                <div>
                  <span className="infra-header">
                    {item.name}
                  </span>
                  <div className="wings-card-actions">
                    <span className="item-actions">
                      <i
                        className="icons8-pencil-tip"
                        onClick={this.props.params.onEditInfra.bind(this, serviceTemplate, item)}
                      />
                    </span>
                    <span>
                      <i className="icons8-waste" onClick={this.props.params.onDeleteInfra.bind(this, item.uuid)} />
                    </span>
                  </div>
                </div>
                <div className="infra-details">
                  {this.getDetails(item)}
                </div>
              </div>

              {index < mappings.length - 1 && <div className="__border" />}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="__orange">
        <i className="icons8-error-filled" />&nbsp;Setup Required
      </div>
    )
  }

  filterServicesByInfraMapping = data => {
    const filteredData = Object.keys(data).reduce((result, key, index) => {
      const infraMappings = this.getInfraMappings(data[key])
      if (infraMappings.length > 0) {
        result.push(data[key])
      }
      return result
    }, [])
    return this.sortData(filteredData, 'name')
  }

  sortData = (data, key) => {
    return data.sort(function (item1, item2) {
      if (item1[key] < item2[key]) {
        return -1
      } else if (item1[key] > item2[key]) {
        return 1
      }
      return 0
    })
  }

  redirectToServiceDetail (appId, serviceId) {
    Utils.redirect({ appId: appId, serviceId: serviceId, page: 'detail' })
  }

  renderNoData = () => {
    return (
      <main className={`no-data-box ${this.props.noInfraCls}`}>
        No Service Infrastructure.
        <span className="wings-text-link cta-button" onClick={this.props.params.onAddInfra}>
          Add Service Infrastructure
        </span>
      </main>
    )
  }

  render () {
    let filteredData
    if (this.props.params.data) {
      filteredData = this.filterServicesByInfraMapping(this.props.params.data)
      // spinnerClass = 'hide'
    }

    return (
      <div className={`${css.main} box-solid wings-card`}>
        <div className="box-header">
          <div className="wings-card-header">
            <div>Service Infrastructure</div>
            <a
              className={'wings-text-link __config-button'}
              onClick={() => this.props.params.onAddInfra()}
              data-name="add-service-infrastructure-button"
            >
              <i className="icons8-plus-math" /> Add Service Infrastructure
            </a>
          </div>
        </div>
        <div className="box-body wings-card-body">
          {filteredData.map((item, index) =>
            <div key={index} className="infra-list">
              <div className="row __details" key={item.uuid}>
                <div className="col-md-2 __serviceNameDiv">
                  <div
                    className="service-name"
                    onClick={() => {
                      // this.redirectToServiceDetail(item.appId, item.serviceId)
                    }}
                  >
                    {item.name}
                  </div>
                  <span className="__artifactType">
                    ({Utils.getCatalogDisplayText(this.props.catalogs, 'ARTIFACT_TYPE', item.serviceArtifactType)})
                  </span>
                </div>
                {/* Detatils */}
                <div className="col-md-10 inframappings">
                  {this.renderInfraMappings(item)}
                </div>
              </div>
              {index < filteredData.length - 1 && <div className="row __border" />}
            </div>
          )}
          {filteredData.length === 0 && this.renderNoData()}
          {this.props.loadingStatus !== 2 && <span className={'wings-spinner'} />}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/views/InfrastructureMappingCardView.js