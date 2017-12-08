import React from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import { WingsModal, Utils } from 'components'
import apis from 'apis/apis'
import css from './ArtifactActionModal.css'
import AppStorage from '../../components/AppStorage/AppStorage'
import { ArtifactStreamService } from 'services'
import dataService from '../../apis/dataService'

const defaultUnixCronExpression = '0 5 * * ?'
const defaultCronExpression = '0 5 * * *'
const baseUrl = dataService.url

export default class ArtifactActionModal extends React.Component {
  state = {
    cronMsg: null,
    selectedServiceId: null,
    disableArtifactsDropDown: false,
    disableServiceDropDown: false,
    disableTriggerTypeSelector: true,
    artifactStreams: null,
    errorClass: 'hide',
    errorMessage: '',
    freqType: '1',
    webHookToken: null,
    webHookApiParams: '',
    urlBase: '',
    showCurlInfoClass: '',
    copied: false
  }

  isEdit = null
  cronDiv = null
  cronString = null
  form = {}
  workflows = []
  artifactStream = null
  frequencyOptions = [
    { value: 1, name: 'Trigger on Every Artifact Collection' },
    { value: 2, name: 'Trigger at Specific Times' },
    { value: 0, name: 'Trigger on Push Event (WebHook)' }
  ]

  componentWillMount = () => {
    this.isEdit = !!this.props.data
    if (this.isEdit) {
      this.form = Utils.clone(this.props.data)
    } else {
      this.form = {
        workflowType: 'ORCHESTRATION',
        envId: '',
        customAction: false
      }
    }
  }

  componentDidMount = () => this.init(this.props)

  createCurl = () =>
    `curl -X POST  -H 'content-type: application/json' --url ${this.state.urlBase} -d '${this.state.payload}'`

  getWebHookTokenFromDataOrCreate = () => {
    const { webHookToken, webHook } = this.form
    const { requestBody } = this.form
    const urlBase = `${baseUrl}/webhooks/${webHookToken}`

    const webHookApiParams = [
      {
        key: 'HTTP URL:',
        value: urlBase
      },
      { key: 'Method:', value: 'POST' },
      { key: 'Payload:', value: requestBody }
    ]

    // If the trigger was created before the webHookToken feature was added, there will be no token.
    // Create one.
    if (!webHookToken) {
      this.getWebHookToken(this.artifactStream.uuid)
    } else {
      this.setState({
        webHookApiParams,
        freqType: this.convertWebHookBooleanToFreqType(webHook),
        payload: requestBody,
        urlBase,
        webHookToken
      })
    }
  }

  getWebHookToken = async streamId => {
    const appId = this.props.urlParams.appId
    const { webHookInfo: { payload, webHookToken } } = await ArtifactStreamService.getWebHookInfo({
      appId,
      streamId
    })

    const urlBase = `${baseUrl}/webhooks/${webHookToken}`
    const webHookApiParams = [
      {
        key: 'HTTP URL:',
        value: urlBase
      },
      { key: 'Method:', value: 'POST' },
      { key: 'Payload:', value: payload }
    ]

    // Every new trigger gets a webhook token, whether they need one or not.
    // This way, if a non-webhook trigger changes to a webhook trigger later,
    // the logic is less error prone.
    this.setState({
      webHookApiParams,
      payload,
      urlBase,
      webHookToken
    })
  }

  setTriggerTypeDropDown = form => {
    if (form.webHook) {
      this.onTriggerTypeChange('0')
    } else if (form.customAction) {
      this.onTriggerTypeChange('2')
    } else {
      this.onTriggerTypeChange('1')
    }
  }

  init (props) {
    this.setToFirstService()

    if (this.isEdit) {
      // If this is an existing trigger
      this.artifactStream = props.artifactStream
      this.getWebHookTokenFromDataOrCreate()

      // For workflow (not pipeline) triggers, get workflows
      if (this.form.envId) {
        this.fetchWorkflows()
      }
      this.setTriggerTypeDropDown(this.form)

      this.setState({
        disableArtifactsDropDown: true,
        artifactStreams: [this.artifactStream],
        selectedServiceId: this.artifactStream.serviceId,
        disableServiceDropDown: true
      })
    } else {
      this.fetchWorkflows()
      this.onTriggerTypeChange('1')
    }

    this.setState({ __update: 'init' })
  }

  setToFirstService = () => {
    if (this.props.services.length > 0) {
      const firstService = this.props.services[0]
      if (this.props.artifactsData.length > 0) {
        this.setArtifactStreams(firstService.uuid)
      } else {
        this.setState({
          selectedServiceId: firstService.uuid,
          errorClass: 'modal-error',
          errorMessage: 'No Artifact Streams Available'
        })
      }
    } else {
      this.setState({
        errorClass: 'modal-error',
        errorMessage: 'No Services/Artifact Streams Available'
      })
    }
  }

  setArtifactStreams = serviceId => {
    const artifactStreams = this.props.artifactsData.filter(artifactStream => artifactStream.serviceId === serviceId)
    if (artifactStreams.length > 0) {
      this.artifactStream = artifactStreams[0]
      this.setState({
        artifactStreams,
        selectedServiceId: serviceId,
        errorClass: 'hide',
        errorMessage: ''
      })
      this.onArtifactChange(this.artifactStream.uuid)
    } else {
      this.artifactStream = null
      this.setState({
        artifactStreams,
        selectedServiceId: serviceId,
        errorClass: 'modal-error',
        errorMessage: 'No Artifact Streams Available'
      })
      this.onArtifactChange('0')
    }
  }

  fetchWorkflows () {
    this.props.fetchWorkflows(this.props.appIdFromUrl).then(resp => {
      this.workflows = resp.resource.response
      if (!this.form.workflowId) {
        this.form.workflowId = ''
      }
      this.setState({ __update: 'workflows' })
    })
  }

  onCronChange = cronString => {
    this.cronString = cronString
    this.setState({ __update: 'cron change' })
  }

  onTriggerTypeChange = freqType => {
    if (freqType === '0') {
    } else if (freqType === '1') {
      this.form.customAction = false
    } else if (freqType === '2') {
      this.form.customAction = true
    }

    // customAction means custom trigger interval.
    if (this.form.customAction && !this.form.cronExpression) {
      this.form.cronExpression = defaultCronExpression
    }
    this.setState({ freqType, __update: 'freqType change' })
  }

  onExecutionTypeChange = e => {
    this.form.workflowType = e.currentTarget.value
    if (this.form.workflowType === 'PIPELINE') {
      this.form.envId = null
      this.form.workflowId = ''
    } else {
      this.form.envId = ''
      this.form.workflowId = ''
      this.fetchWorkflows()
    }

    this.setState({ __update: 'exec change' })
  }

  onGenericChange = (propType, value) => {
    this.form[propType] = value
    this.setState({ __update: `${propType} change` })
  }

  onEnvironmentChange = e => {
    this.form.workflowId = ''
    this.form.envId = e.currentTarget.value
    this.setState({ __update: 'env change' })
    this.fetchWorkflows()
  }

  convertFreqTypeToWebHookBoolean = freqType => freqType === '0'

  // The back end sends and receives freqType as a boolean, but the UI treats it as '0' and '1'
  // because it is used in the <select/> in the form.
  // When webHook is true, it means use a webhook style of trigger.
  convertWebHookBooleanToFreqType = webHook => (webHook ? '0' : '1')

  onSubmit = () => {
    const isEdit = this.props.data ? true : false
    if (this.isValidForm()) {
      if (this.form.cronExpression === defaultCronExpression) {
        this.form.cronExpression = defaultUnixCronExpression
      }

      this.form.webHookToken = this.state.webHookToken
      this.form.webHook = this.convertFreqTypeToWebHookBoolean(this.state.freqType)
      this.form.requestBody = this.state.payload

      this.props
        .onSubmit(this.artifactStream, this.form, isEdit)
        .then(() => {
          this.props.afterSubmitAction()
          this.hideModal()
        })
        .catch(error => {
          throw error
        })
    }
  }

  validateWorkflow = workflowId => {
    /* Commenting out templatization check as parameters supported as part of webhook request
    if (this.form.workflowType === 'ORCHESTRATION') {
      const workflows = this.workflows
      const workflowObj = workflows.find(item => item.uuid === workflowId)
      if (workflowObj.templatized) {
        return false
      }
    }
    */
    return true
  }

  validatePipeline = pipelineId => {
    const pipelines = this.props.pipelines
    const currentPipeline = pipelines.find(item => item.uuid === pipelineId)
    if (currentPipeline.templatized) {
      return false
    }
    return true
  }

  isValidForm = () => {
    let validForm = true
    let type
    const workflowId = this.form.workflowId
    if (workflowId) {
      if (this.form.workflowType === 'ORCHESTRATION') {
        type = 'workflows'
        validForm = this.validateWorkflow(workflowId)
      } else if (this.form.workflowType === 'PIPELINE') {
        type = 'pipelines'
        validForm = this.validatePipeline(workflowId)
      }
    }
    if (!validForm) {
      this.setErrorForTriggers(type)
      return validForm
    }
    return true
  }

  setErrorForTriggers = type => {
    const errorClass = 'modal-error'
    const errorMessage = `We don\'t support templatized ${type} on triggers yet`
    this.setState({ errorClass, errorMessage })
  }

  renderCronUI = div => {
    this.cronDiv = div
    if (this.cronDiv && this.props.isScriptLoaded) {
      new CronUI(this.cronDiv, {
        initial: this.form.cronExpression,
        changeEvent: cronString => {
          this.form.cronExpression = cronString
          this.verifyCron()
        }
      })
    }
  }

  verifyCron = () => {
    if (!this.form.cronExpression || this.form.cronExpression.length <= 5) {
      this.setState({ cronMsg: null })
      return
    }

    const data = { expression: this.form.cronExpression }
    const _url = 'artifactstreams/cron/translate'
    const acctId = AppStorage.get('acctId')
    apis.service
      .isomorphicFetch(`${_url}?accountId=${acctId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(r => {
        r.json().then(resp => this.setState({ cronMsg: resp.resource }))
      })
      .catch(error => {
        this.setState({ cronMsg: null })
        throw error
      })
  }

  addTemplateToPipelines = () => {}

  renderExecute = () => (
    <div className="form-group">
      <div className="row">
        <div className="col-md-2">
          <div className="radio">
            <strong>Execute:</strong>
          </div>
        </div>
        <div className="col-md-2">
          <div className="radio">
            <label>
              <input
                type="radio"
                name="workflowType"
                value="PIPELINE"
                onChange={this.onExecutionTypeChange}
                checked={this.form.workflowType === 'PIPELINE'}
              />
              <strong> Pipeline </strong>
            </label>
          </div>
        </div>
        <div className="col-md-6">
          {this.form.workflowType === 'PIPELINE' && (
            <div className="form-group field field-string">
              <select
                className="form-control"
                value={this.form.workflowId}
                onChange={e => this.onGenericChange('workflowId', e.currentTarget.value)}
              >
                <option />
                {this.props.pipelines.map(item => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name} {item.templatized ? '(TEMPLATIZED)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-2"> &nbsp; </div>
        <div className="col-md-2">
          <div className="radio">
            <label>
              <input
                type="radio"
                name="workflowType"
                value="ORCHESTRATION"
                onChange={this.onExecutionTypeChange}
                checked={this.form.workflowType === 'ORCHESTRATION'}
              />
              <strong> Workflow </strong>
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2"> &nbsp; </div>
        <div className="col-md-10">
          {this.form.workflowType === 'ORCHESTRATION' && (
            <div className="form-group field field-string __workflow">
              <select className="form-control" value={this.form.envId} onChange={this.onEnvironmentChange}>
                <option />
                {this.props.environments.map(item => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </select>
              {this.renderWorkflows()}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  renderWorkflows = () => {
    const filteredWorkflows = this.workflows.filter(item => item.envId === this.form.envId)
    let filteredWorkflowsbyService = []
    if (filteredWorkflows) {
      filteredWorkflowsbyService = filteredWorkflows.filter(item =>
        item.services.map(service => service.uuid).includes(this.state.selectedServiceId)
      )
    } else {
      filteredWorkflowsbyService = filteredWorkflows
    }

    return (
      <select
        className="form-control"
        value={this.form.workflowId}
        onChange={e => this.onGenericChange('workflowId', e.currentTarget.value)}
      >
        <option />
        {filteredWorkflowsbyService.map(item => (
          <option key={item.uuid} value={item.uuid}>
            {item.name}
            {item.templatized ? '(TEMPLATIZED)' : ''}
          </option>
        ))}
      </select>
    )
  }

  showCurlBox = () => this.setState({ showCurlInfoClass: 'unhide' })

  renderTriggerTypeSelector = () => (
    <frequency-selector>
      <section-label>Trigger Type (WebHook):</section-label>
      <select
        disabled={this.state.disableTriggerTypeSelector}
        className="form-control"
        onChange={e => {
          this.onTriggerTypeChange(e.currentTarget.value)
        }}
        value={this.state.freqType}
      >
        {this.frequencyOptions.map((item, itemIdx) => (
          <option key={itemIdx} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      {this.state.freqType === '0' && (
        <web-hook-info>
          <section-label>WebHook:</section-label>
          <param-container>
            <api-params>
              {this.state.webHookApiParams &&
                this.state.webHookApiParams.map((param, paramIdx) => (
                  <api-param-container key={paramIdx} onClick={this.copyToClipBoard}>
                    <kv-pair>
                      <key>{param.key}</key>
                      <value>{param.value}</value>
                    </kv-pair>
                  </api-param-container>
                ))}
            </api-params>
            <a onClick={this.showCurlBox.bind(this)} className="link-style action-message">
              generate curl command
            </a>
          </param-container>

          <div className={`curl-info ${this.state.showCurlInfoClass}`}>
            <section-label>Curl Command:</section-label>
            <curl-string>
              {this.createCurl()}

              <CopyToClipboard text={this.createCurl()} onCopy={() => this.setState({ copied: true })}>
                <span className="link-style action-message"> Copy to Clipboard</span>
              </CopyToClipboard>
              {this.state.copied ? <copied-message>Copied.</copied-message> : null}
            </curl-string>

            {/* This input mirrors my curl-string, but is hidden */}
            <input
              className="dummy-input-for-clipboard-copy"
              value={this.createCurl()}
              onChange={({ target: { value } }) => this.setState({ value, copied: false })}
            />
          </div>
        </web-hook-info>
      )}
      {this.state.freqType === '2' && (
        <cron-tools>
          <div className="form-group">
            <section-label>Trigger every:</section-label>
            <div className="__cronBuilder" ref={this.renderCronUI} />
            <div className="__cronMessage">{this.state.cronMsg}</div>
          </div>
        </cron-tools>
      )}
    </frequency-selector>
  )

  onArtifactChange = async artifactId => {
    // Don't clear the workflowId when the form is being initialized during edit mode.
    if (!this.isEdit) {
      this.form.workflowId = ''
      this.form.envId = ''
    }
    if (artifactId && artifactId !== '0') {
      const artifactStream = this.props.artifactsData.find(item => item.uuid === artifactId)
      if (artifactStream) {
        this.artifactStream = artifactStream
        if (this.isEdit) {
          this.getWebHookTokenFromDataOrCreate()
        } else {
          this.getWebHookToken(artifactId)
        }
        this.setState({ disableTriggerTypeSelector: false })
      }
    } else {
      this.artifactStream = null
      this.setState({ disableTriggerTypeSelector: true })
    }
  }

  hideModal = () => this.props.onHide()

  renderArtifactFilterField = () => (
    <div className="form-group">
      <div className="row">
        <div className="col-md-4 artifacts">
          <strong>Build / Tag Filter:</strong>
        </div>
        <div className="col-md-8 artifact-form">
          <input
            className="form-control"
            type="text"
            value={this.form.artifactFilter}
            onChange={e => this.onChangeArtifactFilter(e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  )

  onChangeArtifactFilter = selectedValue => {
    this.form.artifactFilter = selectedValue
    this.setState({ __update: 'artifactfilter_change' })
  }

  renderArtifactsDropDown = () => (
    <div className="form-group">
      <div className="row">
        <div className="col-md-4 artifacts">
          <strong>Artifact Source*:</strong>
        </div>
        <div className="col-md-8 artifact-form">
          <select
            className="form-control"
            onChange={e => {
              this.onArtifactChange(e.currentTarget.value)
            }}
            value={this.artifactStream && this.artifactStream.uuid ? this.artifactStream.uuid : ''}
            disabled={this.state.disableArtifactsDropDown}
          >
            <option value="0"> </option>
            {this.state.artifactStreams &&
              this.state.artifactStreams.map((item, index) => (
                <option key={index} value={item.uuid}>
                  {item.sourceName}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  )

  renderServicesDropDown = () => (
    <div className="form-group">
      <div className="row">
        <div className="col-md-4 artifacts">
          <strong>Service*:</strong>
        </div>
        <div className="col-md-8 artifact-form">
          <select
            className="form-control"
            value={this.state.selectedServiceId}
            disabled={this.state.disableServiceDropDown}
            onChange={e => {
              this.setArtifactStreams(e.currentTarget.value)
            }}
          >
            <option value="0"> </option>
            {this.props.services &&
              this.props.services.map((item, index) => (
                <option key={index} value={item.uuid}>
                  {item.name}({item.artifactType})
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  )

  render () {
    const allowSubmit =
      this.form.workflowId && this.form.workflowId.length > 0 && this.artifactStream && this.artifactStream.uuid
    const disableSubmitButton = allowSubmit ? '' : 'disabled'

    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Auto Deployment Triggers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderServicesDropDown()}
          {this.renderArtifactsDropDown()}
          {this.renderArtifactFilterField()}
          {this.renderExecute()}
          {this.renderTriggerTypeSelector()}
        </Modal.Body>
        {this.state.freqType === '0' && (
          <span className="placeholder-message">
            All placeholder values in WebHook request must be replaced with actual values.
          </span>
        )}
        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={6} md={4} className="text-left">
              <Button disabled={disableSubmitButton} bsStyle="primary" onClick={this.onSubmit.bind(this)}>
                Submit
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
        <span className={this.state.errorClass}>{this.state.errorMessage}</span>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ArtifactStreamPage/ArtifactActionModal.js