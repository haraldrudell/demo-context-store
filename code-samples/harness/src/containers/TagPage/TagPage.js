import React from 'react'
import { Confirm, Utils, BreadCrumbs } from 'components'
import apis from 'apis/apis'
import css from './TagPage.css'
import TagTree from './TagTree'
import TagPanel from './TagPanel'

const fragmentArr = [
  { data: [] }, // will be set later
  { allHosts: [] },
  { env: [] },
  { serviceTemplates: [] }
]
// ---------------------------------------- //

class TagPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  state = { data: {}, showModal: false, modalData: {} }
  dataLoaded = {}
  idFromUrl = Utils.getIdFromUrl()
  envIdFromUrl = Utils.envIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()
  selectedNode = null

  componentWillMount () {
    this.fetchData()
  }

  fetchData = () => {
    const queryParams = this.props.location.query
    fragmentArr[0].data = [apis.fetchTagsData, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[1].allHosts = [apis.fetchAllHosts, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[2].env = [apis.fetchEnv, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[3].serviceTemplates = [
      apis.fetchServiceTemplates,
      this.appIdFromUrl,
      this.envIdFromUrl,
      queryParams.serviceTemplate
    ]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, this.postData)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  postData = (key, data) => {
    this.dataLoaded[key] = true
    if (key === 'serviceTemplates') {
      this.updateServiceTemplateConfigsFromService(data)
    }

    if (key === 'data' && !this.selectedNode) {
      if (!this.selectedNode && Array.isArray(data.resource.response) && data.resource.response.length > 0) {
        this.selectedNode = data.resource.response[0]
        this.setState({ __update: Date.now() })
      }
    }
  }

  updateServiceTemplateConfigsFromService (data) {
    const __update = serviceTemplate => {
      if (!serviceTemplate.configFiles) {
        serviceTemplate.configFiles = []
      }

      apis.service
        .list(apis.getConfigEndpoint(this.appIdFromUrl, serviceTemplate.serviceId, null, 'SERVICE'))
        .then(r => {
          if (r.resource.response && r.resource.response.length > 0) {
            r.resource.response.map(serviceConfig => {
              const templateConfig = serviceTemplate.configFiles.find(
                item => item.relativeFilePath === serviceConfig.relativeFilePath
              )

              if (!templateConfig) {
                serviceTemplate.configFiles.push(serviceConfig)
              }
            })
            this.setState({ __update: Date.now() })
          }
        })
    }

    if (Array.isArray(data.resource.response)) {
      // if response is all serviceTemplates for Env
      data.resource.response.map(serviceTemplate => __update(serviceTemplate))
    } else if (data.resource.uuid) {
      // if response is a serviceTemplates from query params
      __update(data.resource)
    }
  }

  nodeRequest = (node, data, isEditing) => {
    if (isEditing) {
      apis.service
        .fetch(`tags/${node.uuid}?appId=${node.appId}&envId=${node.envId}`, {
          method: 'PUT',
          body: data
        })
        .then(() => this.fetchData())
        .catch(error => {
          throw error
        })
    } else {
      delete data.uuid
      apis.service
        .fetch(`tags?appId=${node.appId}&envId=${node.envId}&parentTagId=${node.uuid}`, {
          method: 'POST',
          body: data
        })
        .then(() => this.fetchData())
        .catch(error => {
          throw error
        })
    }
  }

  onDelete = node => {
    this.setState({ showConfirm: true, deletingId: node.uuid })
  }

  onDeleteConfirmed = () => {
    apis.service
      .fetch(`tags/${this.state.deletingId}?appId=${this.appIdFromUrl}&envId=${this.envIdFromUrl}`, {
        method: 'DELETE'
      })
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onSubmitHosts = (node, mappedHosts) => {
    const hostUuidsArr = mappedHosts.map(h => h.uuid)
    apis.service
      .fetch(`tags/${node.uuid}/tag-hosts?appId=${this.appIdFromUrl}&envId=${this.envIdFromUrl}`, {
        method: 'POST',
        body: { uuids: hostUuidsArr }
      })
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
  }

  onSelectElement = node => {
    this.selectedNode = node
    this.setState({ __update: Date.now() })
  }

  renderTagTree (data, allHosts) {
    return (
      <TagTree
        data={data}
        selectedNode={this.selectedNode}
        allHosts={allHosts}
        onSelectElement={this.onSelectElement}
        nodeRequest={this.nodeRequest}
        removeNode={this.onDelete}
        onSubmitHosts={this.onSubmitHosts}
      />
    )
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const envName = this.state.env && this.state.env.resource ? this.state.env.resource.name : 'Environment'
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: 'Environments', link: path.toApplicationEnvironmentsPage(urlParams) },
      { label: envName, link: path.toEnvironmentDetailsPage(urlParams) },
      { label: 'Topology' }
    ]
    return <BreadCrumbs data={bData} />
  }

  render () {
    const data = Utils.getJsonValue(this, 'state.data.resource.response')
    const allHosts = Utils.getJsonValue(this, 'state.allHosts.resource.response') || []
    const serviceTemplates = Utils.getJsonValue(this, 'state.serviceTemplates.resource.response') || [
      Utils.getJsonValue(this, 'state.serviceTemplates.resource') || {}
    ]
    return (
      <section className={css.main}>
        <div />
        <section className="content-header">
          {this.renderBreadCrumbs()}
        </section>
        <section>
          <section className="content">
            <div className="row">
              <div className={css.tagTree + ' col-md-6'}>
                {this.renderTagTree(data, allHosts)}
              </div>
              <div className={css.tagPanel + ' col-md-6'}>
                <TagPanel
                  selectedNode={this.selectedNode}
                  serviceTemplates={serviceTemplates}
                  allHosts={allHosts}
                  onAddConfig={this.onAddConfig}
                  fetchData={this.fetchData}
                />
              </div>
            </div>
          </section>
        </section>
        <Confirm
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </section>
    )
  }
}

export default Utils.createTransmitContainer(TagPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/TagPage/TagPage.js