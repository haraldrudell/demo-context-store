import React from 'react'
import { Confirm, ManageVersionsModal, Utils, ChangeHistoryModal } from 'components'
import ConfigTableView from './views/ConfigTableView'
import ConfigModal from './ConfigModal'
import ConfigVarsModal from './ConfigVarsModal'
import apis from 'apis/apis'
import css from './ConfigPage.css'
import ConfigTourSteps from './ConfigTourSteps.js'

const fragmentArr = [
  { serviceVariables: [] } // will be set later
]

class ConfigPage extends React.Component {
  // TODO: propTypes
  state = {
    data: {},
    showModal: false,
    modalData: {},
    showVersionsModal: false,
    selectedConfig: null,
    versionModalData: null,
    showHistory: false,
    historyModalData: null,
    showVarsModal: false,
    varsModalData: null,
    deletingType: null
  }
  configTourSteps = {}
  static contextTypes = Utils.getDefaultContextTypes()
  /* appIdFromUrl = Utils.appIdFromUrl()
  idFromUrl = Utils.getIdFromUrl()*/

  componentWillMount () {
    const { accountId, appId, serviceId } = this.props.urlParams
    this.accountId = accountId
    this.appIdFromUrl = appId
    this.idFromUrl = serviceId

    this.fetchData()
    Utils.loadChildContextToState(this, 'app')
  }
  componentDidMount () {
    this.configTourSteps.moreConfigVars = ConfigTourSteps.moreConfigVariables(
      '.config-var-add',
      () => {
        if (this.props.isDocker) {
          this.props.nextStepToConfigVar()
        } else {
          this.props.goToStep(this.props.nextStepToConfigVar, 'nonDockerStep7', 7)
        }
      },
      this.props.renderEndTour
    )
    this.configTourSteps.moreConfigFiles = ConfigTourSteps.moreConfigFiles(
      '.config-file-add',
      () => {
        this.props.nextStepToConfigFiles()
      },
      this.props.renderEndTour
    )
  }
  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  fetchData = () => {
    fragmentArr[0].serviceVariables = [apis.fetchServiceVariables, this.appIdFromUrl, this.idFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.serviceVariables) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  onSubmit = () => {
    this.props.fetchData()
    if (this.props.isTourOn) {
      const stepName = this.props.isDocker ? 'dockerStep6' : 'nonDockerStep7'
      const stepNumber = this.props.isDocker ? 6 : 7
      this.afterSubmitOnTour(this.configTourSteps.moreConfigFiles, stepName, stepNumber)
    }
    Utils.hideModal.bind(this)()
  }

  onSubmitVarsModal = (formData, isEdit) => {
    const data = Utils.clone(formData)
    if (isEdit) {
      apis.service
        .replace(apis.getServiceVariablesEndpoint(this.appIdFromUrl, this.idFromUrl, data.uuid), {
          body: JSON.stringify(data)
        })
        .then(() => {
          this.fetchData()
          Utils.hideModal.call(this, 'showVarsModal')
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
          throw error
        })
    } else {
      delete data.uuid
      data.entityId = this.idFromUrl
      data.entityType = 'SERVICE'
      apis.service
        .create(apis.getServiceVariablesEndpoint(this.appIdFromUrl, this.idFromUrl), { body: JSON.stringify(data) })
        .then(() => {
          const stepName = this.props.isDocker ? 'dockerStep6' : 'nonDockerStep6'
          this.fetchData()
          this.afterSubmitOnTour(this.configTourSteps.moreConfigVars, stepName, 6)
          Utils.hideModal.call(this, 'showVarsModal')
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
          throw error
        })
    }
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid, deletingType: 'configFile' })
  }

  afterSubmitOnTour = (configTourStep, stepName, stepNumber) => {
    if (this.props.isTourOn) {
      this.props.goToStep(configTourStep, stepName, stepNumber)
    }
  }

  onDeleteConfirmed = () => {
    if (this.state.deletingType === 'configFile') {
      apis.service
        .destroy(apis.getConfigEndpoint(this.appIdFromUrl, this.idFromUrl, this.state.deletingId))
        .then(() => this.props.fetchData())
        .catch(error => {
          throw error
        })
    } else if (this.state.deletingType === 'configVar') {
      apis.service
        .destroy(apis.getServiceVariablesEndpoint(this.appIdFromUrl, this.idFromUrl, this.state.deletingId))
        .then(() => this.fetchData())
        .catch(error => {
          throw error
        })
    }

    this.setState({ showConfirm: false, deletingId: '', deletingType: '' })
  }

  onVersionActionClick = version => {
    const config = this.state.selectedConfig
    Utils.downloadFile(apis.getConfigDownloadUrl(this.appIdFromUrl, config.uuid, version), config.fileName)
  }

  onManageVersion = config => {
    apis.fetchEntityVersions('CONFIG', config.uuid).then(res => {
      this.setState({
        showVersionsModal: true,
        selectedConfig: config,
        versionModalData: res.resource.response,
        versionModalTitle: `Config: ${config.fileName}`
      })
    })
  }

  onManageVersionSubmit = data => {
    const formData = new FormData()
    formData.append('defaultVersion', data.defaultVersion)
    formData.append('envIdVersionMapString', JSON.stringify(data.envIdVersionMap))
    formData.append('relativeFilePath', data.relativeFilePath)

    const handleResp = resp => {
      if (resp.ok) {
        this.onSubmit()
      } else {
        resp.json().then(content => {
          console.log(content)
          this.setState({ __update: Date.now() })
        })
      }
    }

    apis.service
      .fetch(apis.getConfigEndpoint(this.appIdFromUrl, this.idFromUrl, data.uuid), {
        method: 'PUT',
        body: formData
      })
      .then(handleResp)

    this.setState({ showVersionsModal: false, selectedConfig: null, versionModalData: null })
  }

  onHistoryClick = () => {
    apis.fetchEntityVersions('CONFIG', null, this.idFromUrl).then(res => {
      const versions = res.resource.response
      const historyModalData = { versions }
      this.setState({ showHistory: true, historyModalData })
    })
  }

  onAddConfigVarClick = () => {
    this.pauseTour()
    this.setState({ showVarsModal: true, varsModalData: null })
  }

  onEditConfigVarClick = configVar => {
    this.setState({ showVarsModal: true, varsModalData: configVar })
  }

  onDeleteConfigVarClick = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid, deletingType: 'configVar' })
  }
  onAddConfigFile = () => {
    this.pauseTour()
    Utils.showModal.call(this)
  }
  pauseTour = () => {
    if (this.props.isTourOn) {
      this.props.onTourPause()
    }
  }
  pauseCurrentTourStep = () => {
    if (this.props.isTourOn) {
      this.props.setCurrentStepStatus('paused')
    }
  }
  render () {
    const configFiles = this.props.data || []
    const configVars = Utils.getJsonValue(this, 'state.serviceVariables.resource.response') || []
    const environments = Utils.findAppEnvs(this) || []
    const catalogs = this.props.catalogs
    const config = {
      appId: this.appIdFromUrl,
      entityId: this.idFromUrl,
      entityType: 'SERVICE'
    }

    return (
      <section className={css.main}>
        <ConfigTableView
          configFiles={configFiles}
          configVars={configVars}
          serviceData={this.props.serviceData}
          onAdd={this.onAddConfigFile}
          onEdit={Utils.showModal.bind(this)}
          onDelete={this.onDelete.bind(this)}
          onManageVersion={this.onManageVersion.bind(this)}
          onHistoryClick={this.onHistoryClick.bind(this)}
          onAddConfigVarClick={this.onAddConfigVarClick}
          onEditConfigVarClick={this.onEditConfigVarClick}
          onDeleteConfigVarClick={this.onDeleteConfigVarClick}
        />

        <ConfigModal
          ConfigData={this.state.modalData}
          environments={environments}
          config={config}
          show={this.state.showModal}
          onHide={() => {
            this.pauseCurrentTourStep()
            Utils.hideModal.call(this)
          }}
          onSubmit={this.onSubmit}
          onTourStop={this.props.onTourStop}
          appIdFromUrl={this.props.appIdFromUrl}
          idFromUrl={this.idFromUrl}
          {...this.props}
        />
        {catalogs && (
          <ConfigVarsModal
            ConfigData={this.state.varsModalData}
            config={config}
            show={this.state.showVarsModal}
            onHide={() => {
              this.pauseCurrentTourStep()
              Utils.hideModal.call(this, 'showVarsModal')
            }}
            onSubmit={this.onSubmitVarsModal}
            serviceVariableTypes={catalogs && catalogs.SERVICE_VARIABLE_TYPE}
            addConfigFileSteps={this.props.addConfigFileSteps}
            onAddConfigVarClick={this.onAddConfigVarClick}
            {...this.props}
          />
        )}
        <ManageVersionsModal
          show={this.state.showManageVersions}
          showVersion={true}
          environments={environments}
          modalTitle={this.state.manageVersionModalTitle}
          onHide={Utils.hideModal.bind(this, 'showManageVersions')}
        />
        <ManageVersionsModal
          show={this.state.showVersionsModal}
          data={Utils.getJsonValue(this, 'state.selectedConfig')}
          showVersion={true}
          environments={environments}
          modalTitle={this.state.versionModalTitle}
          actionIcon="icons8-installing-updates-2"
          onAction={this.onVersionActionClick}
          versions={Utils.getJsonValue(this, 'state.versionModalData') || []}
          onSubmit={this.onManageVersionSubmit}
          onHide={Utils.hideModal.bind(this, 'showVersionsModal')}
        />
        <ChangeHistoryModal
          modalTitle="View History (Config)"
          data={this.state.historyModalData}
          show={this.state.showHistory}
          onHide={Utils.hideModal.bind(this, 'showHistory')}
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

export default Utils.createTransmitContainer(ConfigPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/ConfigPage/ConfigPage.js