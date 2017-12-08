import React from 'react'
import { ConfirmDelete, Utils, AppStorage, Widget, BreadCrumbs, WingsButtons } from 'components'
import AcctSettingCardViewPage from './views/AcctSettingCardViewPage'
import apis from 'apis/apis'
import css from './AcctSettingPage.css'
import AcctSettingModal from './AcctSettingModal'

const fragmentArr = [
  { data: [] },
  { pluginSchema: [] } // will be set later
]
// ---------------------------------------- //

class AcctSettingPage extends React.Component {
  // TODO: propTypes
  state = { data: {}, showModal: false, modalData: {} }
  acctId = AppStorage.get('acctId')

  componentWillMount () {
    this.fetchData()
    this.props.onPageWillMount(<h3>Account</h3>)
  }

  componentWillReceiveProps (newProps) {}

  fetchData = () => {
    fragmentArr[0].data = [apis.fetchOrgSettings, false, this.acctId, false]
    fragmentArr[1].pluginSchema = [apis.fetchInstalledSettingSchema, this.acctId]
    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  onSubmit = () => {
    this.fetchData()
    Utils.hideModal.bind(this)()
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(apis.getSettingsEndpoint(this.appId, this.acctId, this.state.deletingId, true))
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onAddClick = () => {
    this.setState({ showModal: true, modalData: null })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  WidgetHeader = props => {
    return (
      <span>
        <WingsButtons.Add text="Add Setting" onClick={this.onAddClick.bind(this)} />
      </span>
    )
  }

  renderBreadCrumbs () {
    const bData = [{ label: 'Account', link: '/account' }, { label: 'Default Settings' }]
    return <BreadCrumbs data={bData} withBorder={true} />
  }

  editSettings = data => {
    this.setState({ showModal: true, modalData: data })
  }

  render () {
    const jsonSchema = Utils.getJsonValue(this, 'state.pluginSchema.resource.HOST_CONNECTION_ATTRIBUTES.jsonSchema')
    const uiSchema = Utils.getJsonValue(this, 'state.pluginSchema.resource.HOST_CONNECTION_ATTRIBUTES.uiSchema')
    const data = Utils.getJsonValue(this, 'state.data.resource.response')
    const accessTypes = Utils.getJsonValue(
      this,
      'state.pluginSchema.resource.HOST_CONNECTION_ATTRIBUTES.jsonSchema.properties.accessType.enum'
    )
    /* commenting out this part as it is not needed for now
          replacing it with add setting button*/
    const widgetViewParams = {
      data: data,
      onEdit: this.editSettings,
      onDelete: this.onDelete,
      jsonSchema: jsonSchema,
      accessTypes: accessTypes
    }

    return (
      <section className={css.main}>
        <section className="content-header">
          {this.renderBreadCrumbs()}
        </section>

        <section className="content">
          <div className="row">
            <div className="col-xs-3" />
          </div>
          <Widget
            title=""
            headerComponent={this.WidgetHeader}
            views={[
              {
                name: '',
                component: AcctSettingCardViewPage,
                params: widgetViewParams
              }
            ]}
          />
        </section>
        <AcctSettingModal
          show={this.state.showModal}
          onHide={this.closeModal}
          jsonSchema={jsonSchema}
          uiSchema={uiSchema}
          data={this.state.modalData}
          onSubmit={this.onSubmit}
          accessType={accessTypes}
        />
        <ConfirmDelete
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
        />
      </section>
    )
  }
}

export default Utils.createTransmitContainer(AcctSettingPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/AcctSettingPage/AcctSettingPage.js