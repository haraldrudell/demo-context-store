import React from 'react'
import apis from 'apis/apis'
import { AppStorage, Utils, ArtifactSources } from 'components'
import css from './ArtifactStreamCardView.css'
import ArtifactSourceModal from '../../ServiceDetailPage/ArtifactSourceModal.js'

export default class ArtifactStreamCardView extends React.Component {
  state = {
    noDataCls: 'hide',
    artifactStreamData: false,
    showArtifactStreamModal: false,
    service: {}
  }
  settingsConfig = {}
  acctId = AppStorage.get('acctId')
  services = {}

  getSettingsUrl = settingId => {
    if (this.settingsConfig.hasOwnProperty(settingId)) {
      return this.settingsConfig[settingId]
    }

    this.settingsConfig[settingId] = 'inprogress'
    const url = apis.getSettingsEndpoint(null, this.acctId, settingId)
    apis.service
      .list(url)
      .then(res => {
        if (res.resource && res.resource.value) {
          this.settingsConfig[settingId] = res.resource.value.jenkinsUrl
        } else {
          this.settingsConfig[settingId] = ''
        }
        this.setState({ __update: Date.now() })
      })
      .catch(error => {
        throw error
      })
  }

  renderAction (action) {
    const _arr = ['Trigger', action.workflowName]

    if (action.envId) {
      const env = this.props.params.environments.find(env => env.uuid === action.envId)
      env && _arr.push(' workflow of ' + env.name + ' environment ')
    }

    if (action.webHook) {
      _arr.push('on Push Event (WebHook)')
    } else if (action.customAction) {
      _arr.push(action.cronDescription)
    } else {
      _arr.push('for every artifact')
    }
    return _arr.join(' ')
  }

  renderArtifactPaths = artifact => {
    const arr = []
    const __service = this.props.params.services.find(s => s.uuid === artifact.serviceId)
    artifact.artifactPaths &&
      artifact.artifactPaths.map(str => {
        arr.push(`${str} ${__service ? `(${__service.name})` : ''}`)
      })

    return <div>{arr.map((item, index) => <div key={index}>{item}</div>)}</div>
  }

  redirectToServiceDetail (data) {
    this.redirectServiceDetail(data.serviceId)
    //  Utils.redirect({ appId: true, serviceId: data.serviceId, page: 'detail' })
    sessionStorage.setItem('artifactId', data.artifactSourceId)
  }

  redirectServiceDetail = serviceId => {
    // const accountId = Utils.accountIdFromUrl()
    // const queryParamObj = {}
    // queryParamObj.appId = [this.props.params.appIdFromUrl]
    // queryParamObj.serviceId = serviceId
    // const url = Utils.buildUrl(accountId, queryParamObj, 'application-details/services/detail')
    // Utils.redirectToUrl(url)
    const { accountId, appId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupServiceDetails({ accountId, appId, serviceId }))
  }

  renderNoData = () => {
    return (
      <main className="no-data-box">
        There are no Triggers.
        <span className="wings-text-link cta-button" onClick={this.props.params.onAddAction.bind(this)}>
          Add Triggers
        </span>
      </main>
    )
  }

  filterTriggersByActions = data => {}

  onArtifactStreamAddEdit = (data, service) => {
    const catalogs = this.props.catalogs
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
      showArtifactStreamModal: true,
      artifactStreamData: data,
      service,
      artifactType: data.artifactStreamType,
      artifactTitle: displayValue
    })
  }

  onCloseArtifactSource = () => {
    this.setState({ showArtifactStreamModal: false, artifactStreamData: null })
  }

  filterService (data) {
    if (data) {
      return this.props.params.services.find(item => item.uuid === data.serviceId)
    }
  }

  getDisplayName = item => {
    if (item) {
      const service = this.filterService(item)
      if (service) {
        return (
          <div>
            {item.jobname || item.imageName || String.fromCharCode(65112)}
            {item.sourceType ? `(${item.sourceType})` : ''} (Service:<span>{service.name}</span>)
          </div>
        )
      }
    }
  }

  getServiceName = item => {
    if (item) {
      const service = this.filterService(item)
      if (service) {
        return (
          <dd>
            <span
              className="wings-text-link"
              onClick={() => {
                this.redirectServiceDetail(service.uuid)
                // Utils.redirect({ appId: true, serviceId: service.uuid, page: 'detail' })
              }}
            >
              {service.name}
            </span>
          </dd>
        )
      }
    }
  }

  isDockerImageType = artifactType => {
    return artifactType === 'DOCKER'
  }

  isAWSLambdaImageType = artifactType => {
    return artifactType === 'Amazon_S3'
  }

  render () {
    const { accountId, appId } = this.props.urlParams
    const params = {
      onArtifactStreamAddEdit: this.onArtifactStreamAddEdit,
      redirectToServiceDetail: this.redirectToServiceDetail
    }

    const isDockerImageBased = this.isDockerImageType(this.state.service.artifactType)

    const isAWSLambdaImageType = this.isAWSLambdaImageType(this.state.artifactType)
    if (this.props.params.sortedStreamData.length > 0) {
      // this.services = this.props.params.services
    }
    return (
      <div className={`row ${css.main}`}>
        {this.props.params.sortedStreamData.length > 0 &&
          this.props.params.sortedStreamData.map(item => (
            <div key={item.uuid} className="col-md-12 col-xs-12 wings-card-col artifacts-card">
              <div className="box-solid wings-card">
                <div className="box-header ">
                  <div className="wings-card-header">{this.getDisplayName(item)}</div>
                </div>
                <div className="box-body wings-card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <dl className="dl-horizontal wings-dl __left-dl">
                        <dt>Service:</dt>
                        {this.getServiceName(item)}
                        <dt>Artifact Source:</dt>
                        <dd>
                          <ArtifactSources
                            artifactStreams={[item]}
                            isDetailPage={false}
                            params={params}
                            showEditAction={true}
                            service={this.filterService(item)}
                          />
                        </dd>

                        {/* <dt>Automatic Download</dt>
                      <dd>{(item.autoDownload) ? 'Enabled' : 'Not Enabled'}</dd>
                      <dt>Auto-approved for Production</dt>
                      <dd>{(item.autoApproveForProduction) ? 'Enabled' : 'Not Enabled'}</dd>*/}
                      </dl>
                    </div>
                    {/* <button className="btn btn-link" onClick={this.props.params.onAddAction.bind(this, item)}>
                  <i className="icons8-plus-math"></i> Add Action
                 </button>*/}

                    {/* <div className="col-md-6">
                    <dl className="dl-horizontal wings-dl __right-dl">
                      <dt>Artifact Path(s)</dt>
                      <dd>{this.renderArtifactPaths(item)}</dd>
                      <dt>Artifact Server</dt>
                      <dd>{this.getSettingsUrl(item.settingId)}</dd>
                      <dt>Job Name</dt>
                      <dd>{item.jobname || item.imageName || String.fromCharCode(65112)}</dd>
                     </dl>
                  </div>*/}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <dl className="dl-horizontal wings-dl __right-dl">
                        <dt>Actions:</dt>
                      </dl>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-16">
                      <ol>
                        {item.streamActions.map((action, i) => (
                          <li key={i}>
                            <span className="action-item">{this.renderAction(action)}</span>

                            <span className="artifact-actions">
                              <span>
                                <i
                                  className="icons8-pencil-tip"
                                  onClick={this.props.params.onEditAction.bind(this, item, action)}
                                />
                              </span>
                              <span>
                                <i
                                  className="icons8-delete"
                                  onClick={this.props.params.onDeleteAction.bind(this, item, action.uuid)}
                                />
                              </span>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {(!this.props.params.sortedStreamData || this.props.params.sortedStreamData.length === 0) &&
          this.props.noDataCls !== 'hide' &&
          this.renderNoData()}

        {this.state.showArtifactStreamModal && (
          <ArtifactSourceModal
            onHide={this.onCloseArtifactSource}
            appId={appId}
            serviceId={
              this.state.service.hasOwnProperty('uuid') ? this.state.service.uuid : this.props.params.services[0].uuid
            }
            accountId={accountId}
            imageBasedSource={isDockerImageBased || isAWSLambdaImageType}
            serviceArtifactType={this.state.service.artifactType}
            artifactType={this.state.artifactType}
            artifactTitle={this.state.artifactTitle}
            artifactSourceSelected={this.state.artifactStreamData}
            onSubmit={() => {
              Utils.hideModal.call(this, 'showArtifactStreamModal')
            }}
          />
        )}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ArtifactStreamPage/views/ArtifactStreamCardView.js