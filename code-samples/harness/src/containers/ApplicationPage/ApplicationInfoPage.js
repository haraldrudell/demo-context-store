import React from 'react'
import { Utils } from 'components'
import apis from 'apis/apis'
import ApplicationModal from './ApplicationModal'
import css from './ApplicationPage.css'

export default class ApplicationInfoPage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = { showModal: false, modalData: {} }
  appIdFromUrl = Utils.appIdFromUrl()

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  updateData = () => {
    location.reload(true)
  }

  onSubmit = (data, isEditing) => {
    if (isEditing) {
      apis.service
        .replace(['apps', data.uuid], {
          body: Utils.getJsonFields(data, 'name, description')
        })
        .then(() => this.updateData())
        .catch(error => {
          throw error
        })
    } else {
      delete data['uuid']
      apis.service
        .create(['apps'], {
          body: Utils.getJsonFields(data, 'name, description')
        })
        .then(() => this.updateData())
        .catch(error => {
          throw error
        })
    }
    Utils.hideModal.bind(this)()
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.service.destroy(['apps', this.state.deletingId]).then(() => this.updateData()).catch(error => {
      throw error
    })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onNameClick = app => {
    Utils.redirect({ appId: app.uuid, page: 'overview' })
  }

  render () {
    const selectedApp = Utils.findApp(this)

    if (!selectedApp || !selectedApp.name) {
      return <div />
    }

    return (
      <section className={css.home}>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="box-solid wings-card">
                <div className="box-header">
                  <div className="wings-card-header">
                    <div>
                      {selectedApp.name}
                    </div>
                    <span className="light">
                      {selectedApp.description}
                    </span>
                  </div>
                  <div className="wings-card-actions">
                    <span>
                      <i
                        className="icons8-pencil-tip"
                        title="Open Edit Modal"
                        onClick={Utils.showModal.bind(this, selectedApp)}
                      />
                    </span>
                  </div>
                </div>
                <div className="box-body">
                  <div className="col-md-12">
                    <dl className="dl-horizontal wings-dl __dl">
                      <dt>Modified</dt>
                      <dd>
                        {Utils.formatDate(selectedApp.lastUpdatedAt) +
                          (selectedApp.lastUpdatedBy ? ' by ' + selectedApp.lastUpdatedBy.name : '')}
                      </dd>
                      <dt>Created</dt>
                      <dd>
                        {Utils.formatDate(selectedApp.createdAt) +
                          (selectedApp.createdBy ? ' by ' + selectedApp.createdBy.name : '')}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ApplicationModal
          data={this.state.modalData}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onSubmit}
        />
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ApplicationPage/ApplicationInfoPage.js