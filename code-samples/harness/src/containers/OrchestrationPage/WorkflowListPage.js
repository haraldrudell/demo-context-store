import React from 'react'
import { observer } from 'mobx-react'
import { NoDataCard, UIButton, Confirm, Widget, Utils, PageBreadCrumbs } from 'components'
import NotificationSystem from 'react-notification-system'
import scriptLoader from 'react-async-script-loader'

import WorkflowCardView from './views/WorkflowCardView'
import OrchestrationModal from './OrchestrationModal'
import NewWorkflowModal from './NewWorkflowModal'
import ExecutionModal from '../ExecutionModal/ExecutionModal'
import { ChangeHistoryModal, ManageVersionsModal, AppStorage, createPageContainer } from 'components'
import CloneWorkflowModal from './CloneWorkflowModal'
import apis from 'apis/apis'
import css from './WorkflowListPage.css'

const fragmentArr = [
  { data: [] } // will be set later
]
// ---------------------------------------- //

@observer
class WorkflowListPage extends React.Component {
  // TODO: propTypes
  static contextTypes = Utils.getDefaultContextTypes()
  title = this.renderBreadCrumbs()
  pageName = 'Setup Workflows'
  isTemplate = false
  state = {
    data: {},
    showModal: false,
    showExecModal: false,
    showHistory: false,
    showWorkflowModal: false,
    workflowModalData: null,
    historyModalData: null,
    modalData: {},
    filteredData: [],
    jsplumbLoaded: false,
    showVersionsModal: false,
    selectedWorkflow: null,
    versionModalData: null,
    cloneModalActive: false,
    cloneData: {}
  }

  fetchData = (refresh = false) => {
    const { appId } = this.props

    if (appId) {
      fragmentArr[0].data = [apis.fetchWorkflows, appId]

      // after routing back to this component, manually fetch data:
      if (!this.props.data || refresh) {
        Utils.fetchFragmentsToState(fragmentArr, this)
      } else {
        this.setState(this.props)
      }
    }
  }

  componentWillMount () {
    // this.props.onPageWillMount(<h3>Deployment Workflows</h3>, 'Setup-Workflows')
    Utils.loadChildContextToState(this, 'app')
    Utils.loadCatalogsToState(this)
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      this.setState({ jsplumbLoaded: true })
    }
  }

  onSubmit = (data, isEditing) => {
    // TODO: DEPRECATED !!!
    if (isEditing) {
      apis.service
        .replace(apis.getOrchestrationEndpoint(this.props.appId, data.uuid), {
          body: JSON.stringify(data)
        })
        .then(() => this.fetchData())
        .catch(error => {
          this.fetchData()
          throw error
        })
    } else {
      const key = 'Workflow::' + data.name
      AppStorage.set(key, JSON.stringify(data))
      Utils.redirect({
        appId: this.props.appId,
        workflowId: data.name,
        page: 'editor'
      })

      //   apis.service.create(apis.getOrchestrationEndpoint(this.appIdFromUrl), {
      //     body: JSON.stringify(data)
      //   })
      //     .then((res) => {
      //       this.onNameClick(res.resource)
      //       this.fetchData()
      //     })
      //     .catch(error => { this.fetchData(); throw error })
    }
    Utils.hideModal.bind(this)()
  }

  onNewWorkflowSubmit = (data, isEditing) => {
    if (isEditing) {
      const updateData = {
        name: data.name,
        description: data.description,
        uuid: data.uuid,
        envId: data.envId,
        serviceId: data.serviceId,
        infraMappingId: data.infraMappingId
      }
      // this change should be for all workflows
      if (data.templateExpressions) {
        updateData.templateExpressions = data.templateExpressions
      }
      updateData.templatized = data.templatized

      // update 'basic information' only ('basic')
      apis.service
        .replace(apis.getWorkflowEndpoint(this.props.appId, data.uuid, 'basic'), {
          body: JSON.stringify(updateData)
        })
        .then(() => {
          this.fetchData()
          this.setState({ showWorkflowModal: false, workflowModalData: {} })
        })
        .catch(error => {
          // this.fetchData()
          throw error
        })
    } else {
      delete data['uuid']
      apis.service
        .create(apis.getWorkflowEndpoint(this.props.appId), {
          body: JSON.stringify(data)
        })
        .then(res => {
          this.setState({ showWorkflowModal: false, workflowModalData: {} })
          this.onNameClick(res.resource)
        })
        .catch(error => {
          // this.fetchData()
          throw error
        })
    }
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(apis.getWorkflowEndpoint(this.props.appId, this.state.deletingId))
      .then(this.fetchData)
      .catch(error => {
        this.fetchData() // TODO: why fetching if the fetch() in then() failed???
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onNameClick = workflow => {
    // Utils.redirect({ appId: true, workflowId: orchestration.uuid, page: 'canary-questions' })
    this.gotoWorkflowDetails(workflow)
  }

  gotoWorkflowDetails = (workflow, queryStr = '') => {
    const { accountId, appId } = this.props.urlParams
    const workflowType = Utils.getJsonValue(workflow, 'orchestrationWorkflow.orchestrationWorkflowType') || ''

    if (workflowType === 'BASIC' || workflowType === 'BUILD') {
      const phases = workflow.orchestrationWorkflow.workflowPhases
      if (phases && phases.length > 0) {
        const defaultPhaseId = phases[0].uuid
        this.props.router.push(
          this.props.path.toSetupWorkflowPhaseDetails({
            accountId,
            appId,
            workflowId: workflow.uuid,
            phaseId: defaultPhaseId
          }) + queryStr
        )
      }
    } else {
      this.props.router.push(
        this.props.path.toSetupWorkflowDetails({
          accountId,
          appId,
          workflowId: workflow.uuid
        }) + queryStr
      )
    }
  }

  onVersionActionClick = version => {
    this.gotoWorkflowDetails(this.state.selectedWorkflow, `?version=${version}`)
  }

  onManageVersion = workflow => {
    apis.fetchEntityVersions('WORKFLOW', workflow.uuid).then(res => {
      this.setState({
        showVersionsModal: true,
        selectedWorkflow: workflow,
        versionModalData: res.resource.response,
        versionModalTitle: `Workflow: ${workflow.name}`
      })
    })
  }

  onManageVersionSubmit = formData => {
    delete formData.graph
    // this.onSubmit(formData, true)
    apis.service
      .replace(apis.getWorkflowEndpoint(this.props.appId, formData.uuid), {
        body: JSON.stringify(formData)
      })
      .then(() => this.fetchData())
      .catch(error => {
        this.fetchData()
        throw error
      })
    this.setState({
      showVersionsModal: false,
      selectedWorkflow: null,
      versionModalData: null
    })
  }

  showExecModal = data => {
    const modalData = data || {}
    modalData.refreshWorkflowExecModal = true
    this.setState({ showExecModal: true, modalData })
  }

  hideExecModal = () => {
    this.setState({ showExecModal: false })
  }

  onExecModalSubmit = formData => {
    // TODO: temp code, use 'executionCredential' section like
    let credentialObj = null
    if (formData.sshUser) {
      credentialObj = {
        executionCredential: {
          executionType: 'SSH',
          sshUser: formData.sshUser,
          sshPassword: formData.sshPassword
        }
      }
    }
    const body = {
      workflowType: 'ORCHESTRATION',
      orchestrationId: formData.orchestrationWorkflow,
      artifacts: formData.artifacts,
      ...credentialObj
    }
    apis.service
      .fetch(`executions?appId=${this.props.appId}&envId=${formData.environment}`, {
        method: 'POST',
        body
      })
      .then(res => {
        this.hideExecModal()
        // Utils.addNotification(this.refs.notif, 'success', 'Workflow executed!')
        Utils.redirect({
          appId: this.props.appId,
          envId: res.resource.envId,
          executionId: res.resource.uuid,
          page: 'detail'
        })
      })
  }

  widgetHeader = props => {
    return (
      <div>
        <UIButton icon="Add" medium onClick={this.onNewWorkflow}>
          Add Workflow
        </UIButton>
      </div>
    )
  }

  onHistoryClick = () => {
    apis.fetchEntityVersions('WORKFLOW').then(res => {
      const versions = res.resource.response
      const historyModalData = { versions }
      this.setState({ showHistory: true, historyModalData })
    })
  }

  renderBreadCrumbs () {
    const { path, urlParams } = this.props
    const accountId = Utils.accountIdFromUrl()
    const appName = this.props.hasOwnProperty('appName') && this.props.appName ? this.props.appName : 'New application'
    const bData = [
      { label: 'Setup', link: `/account/${accountId}/setup` },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Workflows', link: path.toSetupWorkflow(urlParams), dropdown: 'application-children' }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  onNewWorkflow = () => {
    this.setState({ showWorkflowModal: true, workflowModalData: {} })
  }

  onEditWorkflow = item => {
    this.setState({ showWorkflowModal: true, workflowModalData: item })
    this.fetchData()
  }

  hideWorkflowModal = () => {
    this.fetchData(true)
    this.setState({ cloneModalActive: false })
  }

  render () {
    const app = Utils.findByUuid(this.props.dataStore.apps, this.props.appId) || {}
    const environments = app.environments || []
    const appServices = app.services || []
    const workflows = Utils.getJsonValue(this, 'state.data.resource.response') || []
    const widgetViewParams = {
      noDataMessage: (
        <NoDataCard message="There are no Workflows." buttonText="Add Workflow" onClick={this.onNewWorkflow} />
      ),
      catalogs: this.state.catalogs,
      jsplumbLoaded: this.state.jsplumbLoaded,
      data: workflows,
      environments: this.state.app ? this.state.app.environments : [],
      onNameClick: this.onNameClick,
      // onExecClick: this.showExecModal.bind(this),
      onHistoryClick: this.onHistoryClick,
      onEdit: this.onEditWorkflow,
      onClone: data => {
        this.setState({ cloneModalActive: true, cloneData: data })
      },

      onDelete: this.onDelete,
      onManageVersion: this.onManageVersion
    }
    const headerParams = {
      leftItem: this.widgetHeader(),
      showSearch: false
    }
    if (this.state.data) {
      return (
        <section className={css.main}>
          {/* <section className="content-header">
          {this.renderBreadCrumbs()}
        </section>*/}
          <section className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <Widget
                  {...this.props}
                  title=""
                  headerParams={headerParams}
                  views={[
                    {
                      component: WorkflowCardView,
                      params: widgetViewParams
                    }
                  ]}
                />
                <OrchestrationModal
                  data={this.state.modalData}
                  services={appServices}
                  environments={environments}
                  show={this.state.showModal}
                  onHide={Utils.hideModal.bind(this)}
                  onSubmit={this.onSubmit}
                />
                <NewWorkflowModal
                  appId={this.props.appId}
                  data={this.state.workflowModalData}
                  environments={environments}
                  services={appServices}
                  show={this.state.showWorkflowModal}
                  onHide={Utils.hideModal.bind(this, 'showWorkflowModal')}
                  onSubmit={this.onNewWorkflowSubmit}
                  catalogs={this.state.catalogs}
                />
                <ExecutionModal
                  data={this.state.modalData}
                  fetchArtifacts={apis.fetchArtifacts}
                  fetchOrchestrations={apis.fetchOrchestrations}
                  orchestrations={workflows}
                  show={this.state.showExecModal}
                  onHide={this.hideExecModal.bind(this)}
                  onSubmit={this.onExecModalSubmit}
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
                <ChangeHistoryModal
                  modalTitle="View History (Workflow)"
                  data={this.state.historyModalData}
                  show={this.state.showHistory}
                  onHide={Utils.hideModal.bind(this, 'showHistory')}
                />
                <ManageVersionsModal
                  show={this.state.showVersionsModal}
                  data={Utils.getJsonValue(this, 'state.selectedWorkflow')}
                  showTargetEnv={false}
                  showVersion={true}
                  environments={environments}
                  modalTitle={this.state.versionModalTitle}
                  actionIcon="icons8-view-details"
                  onAction={this.onVersionActionClick}
                  versions={Utils.getJsonValue(this, 'state.versionModalData') || []}
                  onSubmit={this.onManageVersionSubmit}
                  onHide={Utils.hideModal.bind(this, 'showVersionsModal')}
                />
                <NotificationSystem ref="notif" />
                {this.state.cloneModalActive && (
                  <CloneWorkflowModal
                    onHide={_ => this.hideWorkflowModal()}
                    cloneData={this.state.cloneData}
                    dataStore={this.props.dataStore}
                    type="Workflow"
                  />
                )}
              </div>
            </div>
          </section>
        </section>
      )
    }
  }
}

const WrappedPage = createPageContainer()(WorkflowListPage)
const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(WrappedPage)
export default Utils.createTransmitContainer(PageWithScripts, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/WorkflowListPage.js