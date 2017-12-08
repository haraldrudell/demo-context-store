import React from 'react'
import { Confirm, Utils } from 'components'
import apis from 'apis/apis'
import TemplateConfigModal from '../ServiceTemplatePage/TemplateConfigModal'

export default class TagPanel extends React.Component {
  state = { showAddConfigModal: false }
  serviceTemplates = []
  selectedNode = null
  templateConfigModalData = null
  selectedServiceTemplate = null
  envIdFromUrl = Utils.envIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()

  componentWillMount () {
    this.selectedNode = this.props.selectedNode
  }

  componentWillReceiveProps (newProps) {
    this.serviceTemplates = newProps.serviceTemplates
    this.selectedNode = newProps.selectedNode
  }

  getEntityType = () => {
    if (this.selectedNode) {
      if (this.selectedNode.tagType !== 'ENVIRONMENT' && this.selectedNode.tagType !== 'HOST') {
        return 'TAG'
      }
      return this.selectedNode.tagType
    }

    return ''
  }

  getConfigs (serviceTemplate) {
    const vals = []
    const configs = {}

    if (!serviceTemplate || !serviceTemplate.configFiles) {
      return vals
    }

    if (this.selectedNode) {
      const arr = serviceTemplate.configFiles.filter(item => item.entityId === this.selectedNode.uuid)
      arr.map(config => (configs[config.relativeFilePath] = config))
    }

    for (const config of serviceTemplate.configFiles) {
      if (!configs[config.relativeFilePath]) {
        configs[config.relativeFilePath] = config
      }
    }

    for (const key of Object.keys(configs)) {
      vals.push(configs[key])
    }
    return vals
  }

  checksum = item => {
    if (item) {
      let _r = item.checksumType ? item.checksumType : ''
      _r += item.checksum ? ':' + item.checksum : ''
      return _r.length > 0 ? _r : null
    }
    return null
  }

  renderOverride = (serviceTemplate, config) => {
    if (this.selectedNode && this.selectedNode.uuid === config.entityId) {
      return (
        <span>
          {this.renderDownloadFile(config.overriddenConfigFile, this.checksum(config.overriddenConfigFile))}
          <button className="btn btn-link" onClick={this.onDeleteOverride.bind(this, serviceTemplate, config)}>
            <i className="icons8-waste" />
          </button>
        </span>
      )
    }

    return (
      <span className="wings-text-link" onClick={this.onSelectOverride.bind(this, serviceTemplate, config)}>
        <i className="icons8-versions" />&nbsp;Click to Override!
      </span>
    )
  }

  renderConfigurations () {
    if (!this.serviceTemplates) {
      return null
    }

    return (
      <div className="__servicesArea">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th className="__hFilePath">File Path</th>
              <th>Override Value</th>
              <th>Computed Value</th>
            </tr>
          </thead>
          {this.serviceTemplates.map((serviceTemplate, stIndex) =>
            <tbody key={stIndex}>
              <tr>
                <td colSpan="3" className="__serviceLabel">
                  {serviceTemplate.name}
                </td>
              </tr>
              {/*  No Configs  */}
              {(!serviceTemplate.configFiles || serviceTemplate.configFiles.length <= 0) &&
                <tr>
                  <td colSpan="3">No Configuration Overrides </td>
                </tr>}

              {/*  Configs  */}
              {this.getConfigs(serviceTemplate).map((item, index) =>
                <tr key={item.uuid}>
                  <td>
                    {item.relativeFilePath || String.fromCharCode(65112)}
                  </td>
                  <td>
                    {this.renderOverride(serviceTemplate, item)}
                  </td>
                  <td>
                    {this.renderDownloadFile(item, this.checksum(item))}{' '}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    )
  }

  downloadFile = (e, item) => {
    e.preventDefault()
    Utils.downloadFile(apis.getConfigDownloadUrl(this.appIdFromUrl, item.uuid), item.fileName)
  }

  onSelectOverride = (serviceTemplate, config) => {
    this.selectedServiceTemplate = serviceTemplate
    this.templateConfigModalData = config
    this.setState({ showAddConfigModal: true })
  }

  onDeleteOverride = (serviceTemplate, config) => {
    this.selectedServiceTemplate = serviceTemplate
    this.setState({ showConfirm: true, deletingId: config.uuid })
  }

  deleteConfig = () => {
    this.setState({ showConfirm: false })
    apis.service
      .destroy(
        apis.getConfigEndpoint(
          this.appIdFromUrl,
          this.envIdFromUrl,
          this.state.deletingId,
          this.selectedNode.uuid,
          this.selectedServiceTemplate.uuid
        )
      )
      .then(() => this.props.fetchData())
      .catch(error => {
        this.props.fetchData()
        throw error
      })
  }

  refreshData = (data, isEdit) => {
    this.props.fetchData()
    this.setState({ showAddConfigModal: false })
  }

  renderDownloadFile (item, title) {
    if (item && item.fileName && item.uuid) {
      return (
        <a href="#" key="download" target="_blank" onClick={e => this.downloadFile(e, item)} title={title}>
          Size: {item.size}&nbsp;<i className="icons8-file" />
        </a>
      )
    }

    return String.fromCharCode(65112)
  }

  renderHosts () {
    if (!this.props.allHosts) {
      return null
    }

    if (this.selectedNode && this.selectedNode.tagType === 'HOST') {
      return null
    }

    let hosts = []
    if (!this.selectedNode || this.selectedNode.tagType === 'ENVIRONMENT') {
      hosts = this.props.allHosts
    } else {
      this.props.allHosts.map(host => {
        if (host.configTag && this.selectedNode.uuid === host.configTag.uuid) {
          hosts.push(host)
        }
      })
    }

    return (
      <div className="__hostsContainer">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th className="__hFilePath">Name</th>
              <th>Connection</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map(host =>
              <tr key={host.uuid}>
                <td>
                  {host.hostName}
                </td>
                <td>
                  {host.host && host.host.hostConnAttr ? host.host.hostConnAttr.name : String.fromCharCode(65112)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  render () {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box-solid wings-card">
            <div className="box-header with-border">
              <span>
                Configuration Override {this.selectedNode ? ': ' + this.selectedNode.name + ' ' : ''}
              </span>
            </div>
            <div className="box-body">
              {/* <Tabs id="tagPanelTabs" defaultActiveKey={1}>
                <Tab eventKey={1} title="Services">
                {this.renderConfigurations()}
                </Tab>
                <Tab eventKey={2} title="Hosts">
                {this.renderHosts()}
                </Tab>
              </Tabs>*/}
              {this.renderConfigurations()}
            </div>
          </div>
        </div>
        <TemplateConfigModal
          data={this.templateConfigModalData}
          show={this.state.showAddConfigModal}
          serviceTemplate={this.selectedServiceTemplate}
          entityId={this.selectedNode ? this.selectedNode.uuid : ''}
          entityType={this.getEntityType()}
          onHide={Utils.hideModal.bind(this, 'showAddConfigModal')}
          onSubmit={this.refreshData.bind(this)}
        />
        <Confirm
          visible={this.state.showConfirm}
          onConfirm={this.deleteConfig}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TagPage/TagPanel.js