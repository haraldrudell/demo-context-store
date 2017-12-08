import React from 'react'
import { observer } from 'mobx-react'
import { createPageContainer, PageBreadCrumbs, UIButton, NoDataCard, Widget } from 'components'
import TriggerCardView from './TriggerCardView'
import TriggerModal from './TriggerModal'
import TriggerWebhookModal from './TriggerWebhookModal'

import { TriggerService } from 'services'
import css from './TriggerPage.css'

@observer
class TriggerPage extends React.Component {
  state = {
    triggerModalShow: false,
    triggerModalData: null,
    webhookModalShow: false
  }

  title = this.renderBreadCrumbs()
  pageName = 'Setup Triggers'

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams

    const app = this.props.dataStore.apps.find(app => app.uuid === urlParams.appId)
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: app.name, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Triggers', link: path.toSetupTriggers(urlParams), dropdown: 'application-children' }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  fetchData = async () => {
    const { accountId, appId } = this.props.urlParams
    const { triggers } = await TriggerService.fetchTriggers({ accountId, appId })
    this.setState({ triggers })
  }

  showTriggerModal = item => {
    this.setState({ triggerModalShow: true, triggerModalData: item })
  }

  onSubmit = async data => {
    const { accountId, appId } = this.props.urlParams
    const { response, error } = await TriggerService.addTrigger({ accountId, appId, data })
    console.log('response: ', response)
    if (!error) {
      this.closeModal()
      await this.props.refreshData()
    }
  }

  closeModal = () => {
    this.setState({ triggerModalShow: false })
  }

  closeWebhookModal = () => {
    this.setState({ webhookModalShow: false })
  }

  getWidgetParams = () => {
    const widgetHeaderParams = {
      leftItem: (
        <UIButton icon="Add" medium onClick={() => this.showTriggerModal()}>
          Add Trigger
        </UIButton>
      )
    }
    const widgetParams = {
      data: this.state.triggers, // widget data (array)
      // custom no-data message. (optional)
      noDataMessage: (
        <NoDataCard
          message="There are no Triggers."
          buttonText="Add a Trigger"
          onClick={() => this.showTriggerModal()}
        />
      ),
      onNameClick: item => {},
      onEdit: item => this.showTriggerModal(item),
      onDelete: item => {
        this.props.confirm.showConfirmDelete(async () => {
          const { accountId, appId } = this.props.urlParams
          const { error } = await TriggerService.deleteTrigger({ accountId, appId, id: item.uuid })
          if (!error) {
            await this.props.refreshData()
            this.props.toaster.show({ message: 'Trigger deleted successfully.' })
          }
        })
      },
      onClickWebhook: item => {
        this.setState({ webhookModalShow: true, triggerModalData: item })
      }
    }
    return { widgetHeaderParams, widgetParams }
  }

  render () {
    const { urlParams } = this.props
    const { triggerModalShow, triggerModalData, webhookModalShow } = this.state
    const app = this.props.dataStore.apps.find(app => app.uuid === urlParams.appId)

    const { widgetHeaderParams, widgetParams } = this.getWidgetParams()

    return (
      <main className={css.main}>
        <Widget {...this.props} headerParams={widgetHeaderParams} params={widgetParams} component={TriggerCardView} />

        {triggerModalShow && (
          <TriggerModal
            {...this.props}
            data={triggerModalData}
            services={app.services}
            onHide={this.closeModal}
            onSubmit={this.onSubmit}
          />
        )}

        {webhookModalShow && (
          <TriggerWebhookModal {...this.props} data={triggerModalData} onHide={this.closeWebhookModal} />
        )}
      </main>
    )
  }
}

export default createPageContainer()(TriggerPage)



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerPage.js