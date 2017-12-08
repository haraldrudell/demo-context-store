import React from 'react'
import { ConfirmDelete, Utils, AppStorage } from 'components'
import SettingsListCards from './SettingsListCards'
import AcctConnectorModal from '../AcctConnectorPage/AcctConnectorModal'
import apis from 'apis/apis'
import css from './SettingsList.css'
import { BlockingSpinner } from '../../components/Spinner/Spinner'

const fragmentArr = [{ data: [] }, { pluginSchema: [] }, { plugins: [] }]

export default class SettingsList extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = { showSpinner: true, data: {}, categories: null, showModal: false, modalData: {}, categoryType: '' }

  //   Fix this
  acctId = AppStorage.get('acctId')
  pluginCategoryLookup = {}
  dataLoaded = {}

  componentWillMount = () => this.fetchData()

  fetchData = () => {
    this.setState({ showSpinner: true })
    fragmentArr[0].data = [apis.fetchOrgConnectors, null, this.acctId]
    fragmentArr[1].pluginSchema = [apis.fetchInstalledSettingSchema, this.acctId]
    fragmentArr[2].plugins = [apis.fetchPlugins]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, this.postFetchData)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
    Utils.loadCatalogsToState(this)
  }

  postFetchData = (k, d) => {
    this.dataLoaded[k] = true
    if (this.dataLoaded['plugins'] && this.dataLoaded['data']) {
      this.categorize()
      this.setState({ showSpinner: false })
    }
  }

  categorize () {
    const data = Utils.getJsonValue(this, 'state.data.resource.response')
    const categories = {}
    this.state.plugins.resource.map(plugin => {
      const objs = data.filter(item => plugin.type === item.value.type)
      plugin.pluginCategories.forEach(cat => {
        let arr = categories[cat] || []
        if (objs.length > 0) {
          arr = arr.concat(objs)
        }
        categories[cat] = arr
      })
    })
    this.setState({ categories })
  }

  onSubmit = () => {
    this.fetchData()
    Utils.hideModal.bind(this)()
  }

  onDelete = uuid => this.setState({ showConfirm: true, deletingId: uuid })

  onAdd = type => this.setState({ showModal: true, modalData: null, categoryType: type })

  onDeleteConfirmed = () => {
    apis.service
      .destroy(apis.getSettingsEndpoint('', this.acctId, this.state.deletingId, true))
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  render () {
    const { recordType } = this.props
    this.acctId = this.props.urlParams.accountId

    const placeHolderData = {
      Artifact: [],
      CloudProvider: [],
      LoadBalancer: [],
      Collaboration: [],
      Verification: []
    }

    const pluginSchema = Utils.getJsonValue(this, 'state.pluginSchema.resource')
    const plugins = Utils.getJsonValue(this, 'state.plugins.resource')
    const data = Utils.getJsonValue(this, 'state.categories') || placeHolderData

    const widgetViewParams = {
      data,
      plugins: plugins,
      onAdd: this.onAdd,
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete,
      recordType
    }

    return (
      <section className={css.main}>
        {this.state.showSpinner && <BlockingSpinner />}
        <SettingsListCards params={widgetViewParams} />
        {this.state.showModal && (
          <AcctConnectorModal
            categoryType={this.state.categoryType}
            plugins={plugins}
            schema={pluginSchema}
            data={this.state.modalData}
            show={this.state.showModal}
            onHide={Utils.hideModal.bind(this)}
            onSubmit={this.onSubmit}
            pluginCategory={this.state.catalogs && this.state.catalogs.PLUGIN_CATEGORY}
            catalogs={this.state.catalogs}
          />
        )}
        <ConfirmDelete
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </ConfirmDelete>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SettingsList/SettingsList.js