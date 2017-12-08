import React from 'react'
import { Confirm, Widget, Utils, BreadCrumbs } from 'components'
import HostListView from './views/HostListView'
import HostModal from './HostModal'

import apis from 'apis/apis'
import css from './HostPage.css'

const getEndpoint = (envId, id) => {
  const endpoint = 'hosts' + (id ? '/' + id : '')
  return envId ? `${endpoint}?appId=${Utils.appIdFromUrl()}&envId=${envId}` : endpoint
}
const fetchInitialData = id => {
  return apis.service.list(getEndpoint(id)).catch(error => {
    throw error
  })
}
const fetchEnv = (envId, appId) => {
  return apis.service.list('environments/' + envId + '?appId=' + appId).catch(error => {
    throw error
  })
}
const fetchConnAttrs = appId => {
  return apis.service.list(`catalogs?appId=${appId}&catalogType=CONNECTION_ATTRIBUTES`).catch(error => {
    throw error
  })
}

const fetchServiceTemplates = (appId, envId) => {
  return apis.service.list(`service-templates?appId=${appId}&envId=${envId}`).catch(error => {
    throw error
  })
}

const fetchTags = (appId, envId) => {
  return apis.service.list(`tags/leaf-tags?appId=${appId}&envId=${envId}`).catch(error => {
    throw error
  })
}

const fragmentArr = [
  { data: [] }, // will be set later
  { env: [] },
  { connAttrs: [] },
  { tags: [] },
  { serviceTemplates: [] }
]
// ---------------------------------------- //

class HostPage extends React.Component {
  // TODO: propTypes
  state = { data: {}, showModal: false, modalData: {} }
  envIdFromUrl = Utils.envIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()

  componentWillMount () {
    this.fetchData()
  }

  fetchData = () => {
    fragmentArr[0].data = [fetchInitialData, this.envIdFromUrl]
    fragmentArr[1].env = [fetchEnv, this.envIdFromUrl, this.appIdFromUrl]
    fragmentArr[2].connAttrs = [fetchConnAttrs, this.appIdFromUrl]
    fragmentArr[3].tags = [fetchTags, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[4].serviceTemplates = [fetchServiceTemplates, this.appIdFromUrl, this.envIdFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  onSubmit = (formData, isEditing) => {
    if (isEditing) {
      const body = JSON.stringify({
        ...Utils.getJsonFields(formData, 'hostName, hostConnAttr, bastionConnAttr, configTag, serviceTemplates')
      })
      apis.service
        .replace([getEndpoint(this.envIdFromUrl, formData.uuid), ''], { body })
        .then(() => this.fetchData())
        .catch(error => {
          this.fetchData()
          throw error
        })
    } else {
      const body = JSON.stringify({
        ...Utils.getJsonFields(formData, 'hostNames, hostConnAttr, bastionConnAttr, configTag, serviceTemplates')
      })
      apis.service.create([getEndpoint(this.envIdFromUrl)], { body }).then(() => this.fetchData()).catch(error => {
        this.fetchData()
        throw error
      })
    }
    Utils.hideModal.bind(this)()
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(getEndpoint(this.envIdFromUrl, this.state.deletingId))
      .then(() => this.fetchData())
      .catch(error => {
        this.fetchData()
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  manageTagsClick = () => {
    Utils.redirect({ appId: true, envId: true, page: 'tags' })
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams

    const envName = this.state.env && this.state.env.resource ? this.state.env.resource.name : 'Environment'
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: 'Environments', link: path.toApplicationEnvironmentsPage(urlParams) },
      { label: envName, link: path.toEnvironmentDetailsPage(urlParams) },
      { label: 'Hosts' }
    ]
    return <BreadCrumbs data={bData} />
  }

  render () {
    const widgetViewParams = {
      data: this.state.data.resource.response,
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete
    }
    const connAttrs = Utils.getJsonValue(this, 'state.connAttrs.resource.CONNECTION_ATTRIBUTES') || []
    const tags = Utils.getJsonValue(this, 'state.tags.resource.response') || []
    const serviceTemplates = Utils.getJsonValue(this, 'state.serviceTemplates.resource.response') || []

    return (
      <section className={css.main}>
        <section className="content-header">
          {this.renderBreadCrumbs()}
        </section>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div>
                <button className="btn btn-link" onClick={Utils.showModal.bind(this, null)}>
                  <i className="icons8-plus-math" /> Add Host
                </button>
                <button className="btn btn-link" onClick={this.manageTagsClick} style={{ marginLeft: 10 }}>
                  <i className="fa fa-tags" /> Manage Tags
                </button>
              </div>
              <Widget
                title="Host List"
                views={[
                  {
                    name: '',
                    icon: 'fa-th-list',
                    component: HostListView,
                    params: widgetViewParams
                  }
                ]}
              />
            </div>
          </div>
        </section>

        <HostModal
          data={this.state.modalData}
          connAttrs={connAttrs}
          configTag={tags}
          serviceTemplates={serviceTemplates}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onSubmit}
        />
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

export default Utils.createTransmitContainer(HostPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/HostPage/HostPage.js