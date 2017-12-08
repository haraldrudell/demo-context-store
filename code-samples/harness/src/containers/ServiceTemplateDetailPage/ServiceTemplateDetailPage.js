import React from 'react'
import { Link } from 'react-router'
import { Widget, Utils } from 'components'
import HostMappingList from './views/HostMappingList'
import TagMappingList from './views/TagMappingList'
import HostMappingModal from './HostMappingModal'
import TagMappingModal from './TagMappingModal'
import apis from 'apis/apis'

import css from './ServiceTemplateDetailPage.css'

const getEndpoint = serviceTemplateId => {
  return `service-templates/${serviceTemplateId}?appId=${Utils.appIdFromUrl()}&envId=${Utils.envIdFromUrl()}`
}
const fetchInitialData = id => {
  return apis.service.list(getEndpoint(id)).catch(error => {
    throw error
  })
}
const fetchEnvData = (appId, envId) => {
  return apis.service.fetch('environments/' + envId + '?appId=' + appId, { method: 'GET' }).catch(error => {
    throw error
  })
}
const fetchAllHosts = (appId, envId) => {
  return apis.service.list(`hosts?appId=${appId}&envId=${envId}`).catch(error => {
    throw error
  })
}
const fetchAllTree = (appId, envId) => {
  return apis.service.list(`tags/flatten-tree?appId=${appId}&envId=${envId}`).catch(error => {
    throw error
  })
}
const fetchAllTags = (appId, envId) => {
  return apis.service.list(`tags?appId=${appId}&envId=${envId}`).catch(error => {
    throw error
  })
}
const fragmentArr = [
  { data: [] }, // will be set later
  { envData: [] },
  { allHosts: [] },
  { allTags: [] },
  { allTree: [] }
]
// ---------------------------------------- //

class ServiceTemplateDetailPage extends React.Component {
  // TODO: propTypes
  state = { data: {}, showModal: false, showTagModal: false, modalData: {} }
  idFromUrl = Utils.getIdFromUrl()
  envIdFromUrl = Utils.envIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()

  componentWillMount () {
    this.fetchData()
  }

  fetchData = () => {
    fragmentArr[0].data = [fetchInitialData, this.idFromUrl]
    fragmentArr[1].envData = [fetchEnvData, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[2].allHosts = [fetchAllHosts, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[3].allTags = [fetchAllTags, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[4].allTree = [fetchAllTree, this.appIdFromUrl, this.envIdFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  onSubmitHosts = mappedHosts => {
    const uuid = Utils.getIdFromUrl()
    const appId = Utils.appIdFromUrl()
    const envId = Utils.envIdFromUrl()
    const hostUuidsArr = mappedHosts.map(h => h.uuid)
    apis.service
      .fetch(`service-templates/${uuid}/map-hosts?appId=${appId}&envId=${envId}`, {
        method: 'PUT',
        body: hostUuidsArr
      })
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
    Utils.hideModal.bind(this)()
  }

  onSubmitTags = mappedTags => {
    const uuid = Utils.getIdFromUrl()
    const appId = Utils.appIdFromUrl()
    const envId = Utils.envIdFromUrl()
    const tagUuidsArr = mappedTags.map(h => h.uuid)
    apis.service
      .fetch(`service-templates/${uuid}/map-tags?appId=${appId}&envId=${envId}`, {
        method: 'PUT',
        body: tagUuidsArr
      })
      .then(() => this.fetchData())
      .catch(error => {
        this.fetchData()
        throw error
      })
    Utils.hideModal.bind(this)()
  }

  showTagModal = modalData => {
    this.setState({ showTagModal: true, modalData })
  }

  hideTagModal = () => {
    this.setState({ showTagModal: false })
  }

  render () {
    const allHosts = Utils.getJsonValue(this, 'state.allHosts.resource.response')
    const serviceTemplate = Utils.getJsonValue(this, 'state.data.resource') || {}
    const env = Utils.getJsonValue(this, 'state.envData.resource') || {}

    const widgetViewParams = {
      data: this.state.data.resource,
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete
    }

    return (
      <section className={css.main}>
        <section className="content-header">
          <h5>
            <Link to={`/app/${this.appIdFromUrl}/environments`}>
              <span>Environments</span>
            </Link>
            &nbsp;&#8250;&nbsp;
            <Link to={`/app/${this.appIdFromUrl}/env/${this.envIdFromUrl}/detail`}>
              <span>
                {env.name}
              </span>
            </Link>{' '}
            &#8250; {serviceTemplate.name}
          </h5>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div>
                <button className="btn btn-link" onClick={Utils.showModal.bind(this, null)}>
                  <i className="icons8-plus-math" /> Map Hosts
                </button>
              </div>
              <Widget
                title="Mapped Hosts"
                views={[
                  {
                    name: '',
                    icon: 'fa-th-list',
                    component: HostMappingList,
                    params: widgetViewParams
                  }
                ]}
              />

              <div>
                <button className="btn btn-link" onClick={this.showTagModal.bind(this, null)}>
                  <i className="icons8-plus-math" /> Map Tags
                </button>
              </div>
              <Widget
                title="Mapped Tags"
                views={[
                  {
                    name: '',
                    icon: 'fa-th-list',
                    component: TagMappingList,
                    params: widgetViewParams
                  }
                ]}
              />
            </div>
          </div>
        </section>

        <HostMappingModal
          data={this.state.modalData}
          allHosts={allHosts}
          selectedHosts={serviceTemplate.hosts}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onSubmitHosts}
        />
        <TagMappingModal
          data={this.state.modalData}
          allHosts={Utils.getJsonValue(this, 'state.allTags.resource.response')}
          allTree={Utils.getJsonValue(this, 'state.allTree.resource')}
          show={this.state.showTagModal}
          onHide={this.hideTagModal.bind(this)}
          onSubmit={this.onSubmitTags}
        />
      </section>
    )
  }
}

export default Utils.createTransmitContainer(ServiceTemplateDetailPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplateDetailPage/ServiceTemplateDetailPage.js