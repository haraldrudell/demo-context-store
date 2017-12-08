import React from 'react'
import { UIButton, Confirm, Utils } from 'components'
import AppContainerCardView from './views/AppContainerCardView'
import AppContainerModal from './AppContainerModal'
import apis from 'apis/apis'

import css from './AppContainerPage.css'

const fragmentArr = [{ data: [] }]

class AppContainerPage extends React.Component {
  state = { data: {}, showModal: false, modalData: {} }
  appIdFromUrl = Utils.appIdFromUrl()
  acctId = Utils.accountIdFromUrl()
  componentWillMount () {
    this.fetchData()
  }

  fetchData = () => {
    fragmentArr[0].data = [apis.fetchAppContainers, this.acctId]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  onSubmit = (data, isEditing) => {
    Utils.hideModal.bind(this)()
    this.fetchData()
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(apis.getAppContainersEndpoint(this.acctId, this.state.deletingId))
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  downloadFile = appContainer => {
    Utils.downloadFile(apis.getAppContainersEndpoint(this.acctId, appContainer.uuid, true), appContainer.fileName)
  }

  render () {
    const widgetViewParams = {
      data: this.state.data.resource.response,
      onEdit: Utils.showModal.bind(this),
      downloadFile: this.downloadFile,
      onDelete: this.onDelete
    }
    return (
      <section className={css.main}>
        <div className="add-icon">
          <UIButton icon="Add" medium onClick={Utils.showModal.bind(this, null)}>
            Add Application Stack
          </UIButton>
        </div>

        <AppContainerCardView params={widgetViewParams} />
        <AppContainerModal
          data={this.state.modalData}
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
export default AppContainerPage



// WEBPACK FOOTER //
// ../src/containers/AppContainerPage/AppContainerPage.js