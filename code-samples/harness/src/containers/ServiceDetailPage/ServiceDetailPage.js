import React from 'react'
import { Menu, MenuItem, Popover, Position } from '@blueprintjs/core'
import {
  OverviewCard,
  Confirm,
  Utils,
  ServiceTourModal,
  PageBreadCrumbs,
  ConfirmDelete,
  ArtifactHistoryTable,
  createPageContainer,
  ArtifactSources,
  UIButton
} from 'components'

import CloneServiceModal from '../ServicePage/CloneServiceModal.js'
import ArtifactSourceModal from './ArtifactSourceModal'
import ConfigPage from '../ConfigPage/ConfigPage'
import ServiceDeploymentTypes from './ServiceDeploymentTypes'
import apis from 'apis/apis'

import ServiceModal from '../ServicePage/ServiceModal'
import ArtifactStreamModal from '../ArtifactStreamPage/ArtifactStreamModal'
import { TourStage, ServiceTourSteps } from 'utils'
import ServiceTourEndModal from '../../components/WingsTour/ServiceTourEndModal'
import css from './ServiceDetailPage.css'

const fragmentArr = [
  { data: [] },
  { artifactStream: [] }, // will be set later
  { serviceContainerTasks: [] },
  { serviceContainerTaskStencils: [] }
]
// ---------------------------------------- //
/* eslint-disable max-len */

class ServiceDetailPage extends React.Component {
  // TODO: propTypes
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    data: {},
    showModal: false,
    modalData: {},
    showTourModal: false,
    showArtifactStreamModal: false,
    artifactStreamData: null,
    showArtifactConfirm: false,
    artifactData: null,
    serviceDetailCls: '__hide',
    appStackCls: '__hide',
    serviceTourStep: 0,
    showServiceEndTour: false,
    sourceTypes: [],
    artifactSourceModalActive: false,
    artifactSourceSelected: null,
    artifactType: '',
    cloneModalActive: false
  }
  tourSteps = {}
  title = this.renderBreadCrumbs()
  pageName = 'Setup Services'

  componentWillMount () {
    this.getappIdFromUrl()

    // const title = this.renderTitleBreadCrumbs(appName)
    Utils.loadCatalogsToState(this)
    if (this.appIdFromUrl && this.idFromUrl) {
      this.fetchData()
    }
    // this.props.onPageWillMount(<h3>{this.renderTitleBreadCrumbs()}</h3>, 'Setup Service Details')
  }

  getappIdFromUrl = () => {
    if (this.props.urlParams) {
      const { appId, serviceId } = this.props.urlParams
      this.appIdFromUrl = appId
      this.idFromUrl = serviceId
    }
  }

  componentDidMount () {
    /* if (this.props.hasOwnProperty ('renderEndTour')) {
      window.setTimeout( () => {
        this.fillTourSteps()
      }, 1000)
    }*/
  }

  fillTourSteps () {
    ServiceTourSteps.endTour = this.props.renderEndTour
    // ServiceTourSteps.setEndTourHandler(this.props.renderEndTour)
    this.tourSteps.step3 = ServiceTourSteps.step3('.__artifact-add-button')
    this.tourSteps.nonDockerstep4 = ServiceTourSteps.step4('.__artifact-add-button', () => {
      this.props.goToStep(this.tourSteps.nonDockerStep5, 'nonDockerStep5', this.getServiceStageNumber('nonDockerStep5'))
    })
    this.tourSteps.nonDockerStep5 = ServiceTourSteps.step5ForNonDocker('.__commandSection', () => {
      this.props.goToStep(this.tourSteps.nonDockerStep6, 'nonDockerStep6', this.getServiceStageNumber('nonDockerStep6'))
    })
    this.tourSteps.nonDockerStep6 = ServiceTourSteps.step6('.config-var-add', () => {
      this.props.goToStep(this.tourSteps.nonDockerStep7, 'nonDockerStep7', this.getServiceStageNumber('nonDockerStep7'))
    })
    this.tourSteps.nonDockerStep7 = ServiceTourSteps.step7('.config-file-add', () => {
      this.endTour()
    })
    this.tourSteps.dockerstep4 = ServiceTourSteps.step4('.__artifact-add-button', () => {
      this.props.goToStep(this.tourSteps.dockerStep5, 'dockerStep5', this.getServiceStageNumber('dockerStep5'))
    })
    this.tourSteps.dockerStep5 = ServiceTourSteps.step5ForDocker('.__service-specifications', () => {
      this.props.goToStep(this.tourSteps.dockerStep6, 'dockerStep6', this.getServiceStageNumber('dockerStep6'))
    })
    this.tourSteps.dockerStep6 = ServiceTourSteps.step6('.config-var-add', this.endTour)
  }

  nextStepToConfigVar = () => {
    return this.isDocker() ? this.endTour : this.tourSteps.nonDockerStep7
  }

  nextStepToConfigFiles = () => {
    return this.endTour
  }

  endTour = () => {
    this.props.onTourPause()
    this.setState({ showServiceEndTour: true })
    this.props.setServiceTourStage('step8', 8)
    /* this.props.onTourStop()
      this.props.setServiceTourStage(0, 0)*/
    //
  }

  showBugMuncher = () => {}

  goToStep (step) {
    this.props.goToStep(step)
  }

  fetchData = (onArtifactSubmit = false, callback) => {
    fragmentArr[0].data = [apis.fetchService, this.appIdFromUrl, this.idFromUrl]
    fragmentArr[1].artifactStream = [apis.fetchServiceArtifactStreamData, this.appIdFromUrl, this.idFromUrl]

    fragmentArr[2].serviceContainerTasks = [apis.fetchServiceContainerTasks, this.appIdFromUrl, this.idFromUrl]

    fragmentArr[3].serviceContainerTaskStencils = [
      apis.fetchServiceContainerTaskStencils,
      this.appIdFromUrl,
      this.idFromUrl
    ]

    // after routing back to this component, manually fetch data:
    if ((__CLIENT__ && !this.props.data) || onArtifactSubmit) {
      const serviceId = this.idFromUrl
      apis.fetchBuildSourceTypes(this.appIdFromUrl, serviceId).then(r => {
        this.setArtifactStreamType(r.resource)
      })

      Utils.fetchFragmentsToState(fragmentArr, this, null, () => {
        const artifactId = sessionStorage.getItem('artifactId')
        if (this.props.isTourOn) {
          this.afterFetch(onArtifactSubmit)
        }
        if (artifactId !== null) {
          this.filterArtifactData(sessionStorage['artifactId'])
        }
        if (callback) {
          callback()
        }
      })
    } else {
      this.setState(this.props)
    }
  }

  // Step1- > select Application
  // step2 -> add service
  // Step3 -> add artifact source
  // step4 --> add more artifact ArtifactSources
  // step5 -> docker-> add/review specifications
  // step5-> non docker-> add/review commands
  // step6 -> configuration variables
  // step7- > configuration files

  afterFetch = onArtifactSubmit => {
    this.tourSteps.step3 = ServiceTourSteps.step3('.__artifact-add-button')
    this.tourSteps.nonDockerstep4 = ServiceTourSteps.step4('.__artifact-add-button', () => {
      this.props.goToStep(this.tourSteps.nonDockerStep5, 'nonDockerStep5', this.getServiceStageNumber('nonDockerStep5'))
    })
    const isDocker = this.isDocker()
    const prevStep = this.getServiceStageNumber(this.props.serviceTourStage)
    // alert(isDocker)
    const appStackCls = isDocker ? '__hide' : ''
    this.setState({ serviceDetailCls: css.main, appStackCls })
    if (prevStep !== 2 && prevStep) {
      this.props.goToStep(this.tourSteps[this.props.serviceTourStage], this.props.serviceTourStage, prevStep)
      this.props.setResume(false)
    }
    if (this.isServiceTourStageOn(TourStage.SERVICE, onArtifactSubmit)) {
      sessionStorage.setItem('tourServiceId', this.idFromUrl)
      if (!sessionStorage.getItem('tourAppId')) {
        sessionStorage.setItem('tourAppId', this.appIdFromUrl)
      }

      this.props.goToStep(this.tourSteps.step3, 'step3', this.getServiceStageNumber('step3'))
      this.props.setCurrentStepStatus('inprogress')
    }
    if (onArtifactSubmit && this.state.serviceDetailCls !== '__hide') {
      if (isDocker) {
        this.props.goToStep(this.tourSteps.dockerstep4, 'dockerstep4', this.getServiceStageNumber('dockerstep4'))
      } else {
        this.props.goToStep(
          this.tourSteps.nonDockerstep4,
          'nonDockerstep4',
          this.getServiceStageNumber('nonDockerstep4')
        )
      }
      this.props.setCurrentStepStatus('inprogress')
    }
    //  this.addStepsForDocker(isDocker)
  }

  setArtifactStreamType (resource) {
    if (!resource) {
      return
    }

    this.setState({ sourceTypes: Object.keys(resource) })
  }

  getServiceStageNumber = stepname => {
    if (stepname) {
      return ServiceTourSteps.Stage[stepname]
    }
    return
  }

  isServiceTourStageOn (stageName, onArtifactSubmit) {
    const prevStep = this.getServiceStageNumber(this.props.serviceTourStage)
    if (this.props.isTourStageOn(stageName) && this.state.serviceDetailCls !== '__hide' && !onArtifactSubmit) {
      if (prevStep === 2 || !prevStep) {
        return true
      }
    }
    return false
  }

  startTour = () => {
    this.props.goToStep(this.tourSteps.step1)
  }

  filterArtifactData (artifactId) {
    const artifactStreamArr = Utils.getJsonValue(this, 'state.artifactStream.resource.response')
    const data = artifactStreamArr.find(item => item.uuid === artifactId)
    this.onEditArtifactSource(data)
    sessionStorage.removeItem('artifactId')
  }

  onSubmit = (data, isEditing) => {
    this.fetchData()
    Utils.hideModal.bind(this)()
    /* if (isEditing) {
      apis.service
        .replace(apis.getServiceEndpoint(this.appIdFromUrl, data.uuid), {
          body: {
            appContainer: {
              uuid: data.appContainerUuid
            },
            ...Utils.getJsonFields(data, 'name, description, artifactType')
          }
        })
        .then(() => this.fetchData())
        .catch(error => {
          throw error
        })
    } else {
      delete data['uuid']
      const body = Utils.getJsonFields(data, 'name, description, artifactType')
      if (data.appContainerUuid) {
        body.appContainer = {
          uuid: data.appContainerUuid
        }
      }
      apis.service
        .create(apis.getServiceEndpoint(this.appIdFromUrl), { body })
        .then(() => this.fetchData())
        .catch(error => {
          throw error
        })
    }
    Utils.hideModal.bind(this)()*/
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteArtifact = data => {
    this.setState({ showArtifactConfirm: true, artifactData: data })
  }

  onDeleteArtifactConfirm = () => {
    this.setState({ showArtifactConfirm: false })
    apis.service
      .destroy(apis.getArtifactStreamsEndPoint(this.appIdFromUrl, this.state.artifactData.uuid), {
        body: JSON.stringify(this.state.artifactData)
      })
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
  }

  redirectToSetupServices = () => {
    const accountId = Utils.accountIdFromUrl()
    const page = 'application-details/setup-services'
    const queryParamObj = {}
    queryParamObj.appId = [this.appIdFromUrl]
    const url = Utils.buildUrl(accountId, queryParamObj, page)
    Utils.redirectToUrl(url)
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(apis.getServiceEndpoint(this.appIdFromUrl, this.state.deletingId))
      .then(this.redirectToSetupServices())
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onTourSubmit = () => {
    this.setState({ showTourModal: false })
    this.props.setTourStage(TourStage.ENVIRONMENT)
    Utils.redirect({ appId: this.appIdFromUrl, page: 'setup' })
  }

  onTourCancel = () => {
    this.setState({ showTourModal: false })
    this.props.onTourPause()
  }

  onArtifactStreamAddEdit = data => {
    /* if (this.props.isTourOn) {
      this.props.onTourPause()dsfds
    }*/
    // this.setState({ showArtifactStreamModal: true, artifactStreamData: data })
    this.onEditArtifactSource(data)
  }

  onSelectArtifactSourceType = async option => {
    // const appId = this.props.urlParams.appId
    // const serviceId = this.props.urlParams.serviceId

    // apis.fetchPlugins().then(r => console.log('plugins',r) || this.setState({ plugins: r }))
    // apis.fetchInstalledSettingSchema(accountId).then(r =>  console.log('servers',r) || this.setState({ pluginSchema: r }))
    // apis.fetchArtifactStreamStencils(appId, serviceId).then(r => {
    //   console.log('schemas',r);
    //   this.setState({ showArtifactSourceModal: true, stencils: r.resource })
    // })
    const artifactType = option.type
    const artifactTitle = option.displayValue
    this.setState({
      artifactSourceModalActive: true,
      artifactType,
      artifactTitle
    })
  }

  onEditArtifactSource = data => {
    const catalogs = this.state.catalogs
    let displayValue
    if (catalogs && data) {
      displayValue = Utils.getCatalogDisplayText(
        catalogs,
        'ARTIFACT_STREAM_TYPE',
        data.artifactStreamType,
        'name',
        'value'
      )
    }

    this.setState({
      artifactSourceModalActive: true,
      showArtifactStreamModal: false,
      artifactType: data && data.artifactStreamType,
      artifactTitle: displayValue,
      artifactSourceSelected: data
    })
  }

  onCloseArtifactSource = () => {
    this.setState({
      artifactSourceModalActive: false,
      artifactSourceSelected: null
    })
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const appName = this.props.appName
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Services', link: path.toSetupServices(urlParams), dropdown: 'application-children' },
      { label: this.props.serviceName }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  isDocker = () => {
    const service = Utils.getJsonValue(this, 'state.data.resource') || {}
    return service.artifactType ? service.artifactType === 'DOCKER' : false
  }

  isDockerImageType = () => {
    return this.state.sourceTypes.includes('DOCKER')
  }

  isAWSLambdaImageType = () => {
    return this.state.sourceTypes.includes('Amazon_S3')
  }

  submitForArtifactStreams = () => {
    this.fetchData(true)
    Utils.hideModal.call(this, 'showArtifactStreamModal')
    this.onCloseArtifactSource()
  }

  getReviewStep = () => {
    const isDocker = this.isDocker()
    if (isDocker) {
      return this.tourSteps.dockerStep5
    } else {
      return this.tourSteps.nonDockerStep5
    }
  }

  getReviewStepNumber = () => {
    const isDocker = this.isDocker()
    return isDocker ? this.getServiceStageNumber('dockerStep5') : this.getServiceStageNumber('nonDockerStep5')
  }

  getReviewStepName = () => {
    const isDocker = this.isDocker()
    return isDocker ? 'dockerStep5' : 'nonDockerStep5'
  }

  renderOverviewCard = ({ service, sourceTypes }) => {
    const kvPairs = []
    const artifactTypeName = Utils.getCatalogDisplayText(this.state.catalogs, 'ARTIFACT_TYPE', service.artifactType)
    const artifactStreamArr = Utils.getJsonValue(this, 'state.artifactStream.resource.response')

    kvPairs.push({
      key: 'Name',
      value: service.name + (service.artifactType ? ` (${artifactTypeName})` : '')
    })
    if (service.description) {
      kvPairs.push({
        key: 'Description',
        value: service.description
      })
    }
    if (!this.isDocker() && service.appContainer) {
      kvPairs.push({
        key: 'Application Stack',
        value: service.appContainer.name || '',
        className: this.state.appStackCls
      })
    }

    const getArtifactSource = ({ service, sourceTypes }) => {
      const artifactStreamArr = Utils.getJsonValue(this.state, 'artifactStream.resource.response')
      const params = {
        onArtifactStreamAddEdit: this.onEditArtifactSource,
        redirectToServiceDetail: this.redirectToServiceDetail,
        onDeleteArtifact: this.onDeleteArtifact
      }
      const translatedTypes = this.translateSourceType()

      return {
        key: 'Artifact Source*',
        value: (
          <artifact-container>
            <ArtifactSources
              artifactStreams={artifactStreamArr}
              isDetailPage={true}
              params={params}
              appStackCls={this.state.appStackCls}
              hideAddButton={true}
            />

            {translatedTypes && (
              <Popover
                key="select-source-type"
                transitionDuration={0}
                popoverClassName="pt-minimal harness-dropdown"
                portalClassName={css['popover-dropdown-menu']}
                content={
                  <Menu>
                    {translatedTypes.map((name, index) => (
                      <MenuItem
                        key={index}
                        className={`artifact-source-${name.displayValue.replace(/\s/g, '')}`}
                        text={name.displayValue}
                        onClick={_ => this.onSelectArtifactSourceType(name)}
                      />
                    ))}
                  </Menu>
                }
                position={Position.BOTTOM_LEFT}
              >
                <UIButton type="button" icon="PlusWhite" accent>
                  Add Artifact Source
                </UIButton>
              </Popover>
            )}

            <Popover
              position={Position.LEFT_TOP}
              useSmartArrowPositioning={true}
              className={css.historyTableTarget}
              content={<ArtifactHistoryTable {...this.props} />}
            >
              <UIButton>
                <i className="icons8-transaction-list icon" /> Artifact History
              </UIButton>
            </Popover>
          </artifact-container>
        )
      }
    }
    kvPairs.push(getArtifactSource({ service, sourceTypes }))

    const overviewCardProps = {
      header: {
        title: 'Service Overview',
        actionIconFunctions: {
          edit: Utils.showModal.bind(this, service),
          clone: data => {
            this.setState({ cloneModalActive: true, cloneData: service })
          }
        }
      },
      kvPairs
    }
    return <OverviewCard {...overviewCardProps} />
  }

  translateSourceType = () => {
    const sourceTypes = this.state.sourceTypes
    const catalogs = this.state.catalogs

    if (sourceTypes && catalogs) {
      const translatedSourceTypes = sourceTypes.map(sourceType => {
        const displayValue = Utils.getCatalogDisplayText(catalogs, 'ARTIFACT_STREAM_TYPE', sourceType, 'name', 'value')
        return { type: sourceType, displayValue: displayValue }
      })

      return translatedSourceTypes
    }
    return
  }

  render () {
    const service = Utils.getJsonValue(this, 'state.data.resource') || {}
    const serviceContainerTasks = Utils.getJsonValue(this, 'state.serviceContainerTasks.resource.response') || []
    const serviceContainerTaskStencils = Utils.getJsonValue(this, 'state.serviceContainerTaskStencils.resource') || []

    const tourMethods = {
      setCurrentStepStatus: this.props.setCurrentStepStatus,
      isTourOn: this.props.isTourOn,
      onTourPause: this.props.onTourPause,
      goToStep: this.props.goToStep,
      renderEndTour: this.props.renderEndTour,
      addSteps: this.props.addSteps,
      onTourStart: this.props.onTourStart,
      onTourStop: this.props.onTourStop
    }

    const serviceDeploymentTourSteps = {
      serviceTourStep5: this.getReviewStep(),
      tourStepName: this.getReviewStepName(),
      stepNumber: this.getReviewStepNumber()
    }

    const configTourMethods = {
      nextStepToConfigVar: this.nextStepToConfigVar(),
      nextStepToConfigFiles: this.endTour,
      isDocker: this.isDocker()
    }

    const sourceTypes = this.state.sourceTypes
    const isDockerImageBased = this.isDockerImageType()
    const isAWSLambdaImageBased = this.isAWSLambdaImageType()

    if (!isDockerImageBased && service.artifactType !== 'RPM') {
      // Only support Artifactory for RPM and Docker and hide otherwise TODO: Integrate once backend supports
      // const index = sourceTypes.indexOf('ARTIFACTORY')
      // if (~index) {
      //   sourceTypes.splice(index, 1)
      // }
    }
    const { appId, serviceId, accountId } = this.props.urlParams

    return (
      <section className={css.main}>
        {this.renderOverviewCard({ service, sourceTypes })}
        <ServiceDeploymentTypes
          {...this.props}
          data={this.state.artifactStream && this.state.artifactStream.resource.response}
          serviceContainerTasks={serviceContainerTasks}
          serviceContainerTaskStencils={serviceContainerTaskStencils}
          serviceData={service}
          fetchService={this.fetchData}
          {...tourMethods}
          {...serviceDeploymentTourSteps}
          appIdFromUrl={this.appIdFromUrl}
          serviceId={this.idFromUrl}
        />
        <ConfigPage
          data={service.configFiles}
          serviceData={service}
          fetchData={this.fetchData.bind(this)}
          catalogs={this.state.catalogs}
          addConfigFileSteps={this.addConfigFileSteps}
          onTourStart={this.props.onTourStart}
          onTourPause={this.props.onTourPause}
          goToStep={this.props.goToStep}
          onTourStop={this.props.onTourStop}
          {...tourMethods}
          {...configTourMethods}
          appIdFromUrl={this.appIdFromUrl}
          serviceId={this.idFromUrl}
          {...this.props}
        />
        <ServiceModal
          data={this.state.modalData}
          appContainers={this.state.appContainers}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onSubmit}
          appId={this.appIdFromUrl}
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
        <ServiceTourModal show={this.state.showTourModal} onHide={this.onTourCancel} onSubmit={this.onTourSubmit} />
        {this.state.artifactSourceModalActive && (
          <ArtifactSourceModal
            onHide={this.onCloseArtifactSource}
            appId={appId}
            serviceId={serviceId}
            accountId={accountId}
            imageBasedSource={isDockerImageBased || isAWSLambdaImageBased}
            serviceArtifactType={service.artifactType}
            artifactType={this.state.artifactType}
            artifactTitle={this.state.artifactTitle}
            artifactSourceSelected={this.state.artifactSourceSelected}
            onSubmit={() => this.submitForArtifactStreams()}
          />
        )}

        <ArtifactStreamModal
          data={this.state.artifactStreamData}
          appServices={[service]}
          show={this.state.showArtifactStreamModal}
          onHide={() => {
            if (this.props.isTourOn) {
              this.props.setCurrentStepStatus('paused')
            }
            Utils.hideModal.call(this, 'showArtifactStreamModal')
          }}
          appIdFromUrl={this.appIdFromUrl}
          serviceId={this.idFromUrl}
          onSubmit={() => this.submitForArtifactStreams()}
          {...tourMethods}
          pluginCategory={this.state.catalogs && this.state.catalogs.PLUGIN_CATEGORY}
        />

        <ConfirmDelete
          visible={this.state.showArtifactConfirm}
          onConfirm={this.onDeleteArtifactConfirm}
          onClose={Utils.hideModal.bind(this, 'showArtifactConfirm')}
        >
          <button style={{ display: 'none' }} />
        </ConfirmDelete>
        <ServiceTourEndModal
          show={this.state.showServiceEndTour}
          onHide={() => {
            this.setState({ showServiceEndTour: false })
          }}
          endTour={this.props.endServiceTour}
          removeSessionVariables={this.props.removeSessionVariables}
        />
        {this.state.cloneModalActive && (
          <CloneServiceModal
            onHide={_ => {
              this.fetchData({})
              this.setState({ cloneModalActive: false })
            }}
            cloneData={this.state.cloneData}
            dataStore={this.props.dataStore}
            type="Service"
          />
        )}
      </section>
    )
  }
}
/* eslint-enable max-len */
export default createPageContainer()(ServiceDetailPage)



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/ServiceDetailPage.js