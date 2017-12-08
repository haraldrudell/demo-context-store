import React from 'react'
import { observer } from 'mobx-react'
import { WingsModal, Utils } from 'components'
import { Button, Modal } from 'react-bootstrap'
// import Form from 'react-jsonschema-form'
import { WingsForm, ServiceArtifactSelect, FormFieldTemplate } from 'components'
import cssArtifactSelect from './ArtifactSelectModal.css' // TODO: Deprecate
import css from './ExecPipelineModal.css'

import { PipelinesService } from 'services'
import apis from 'apis/apis'

const schema = {
  type: 'object',
  required: ['pipelineSelect', 'artifacts'],
  properties: {
    appId: { type: 'string', title: 'Application', enum: [], enumNames: [] },
    pipelineSelect: {
      type: 'string',
      title: 'Pipeline',
      enum: [],
      enumNames: []
    },
    artifacts: {
      type: 'string',
      title: 'Artifacts'
    },
    workflowVariables: {
      type: 'object',
      title: 'Workflow Variables',
      required: [],
      properties: {}
    }
  }
}

const uiSchema = {
  appId: { 'ui:placeholder': 'Select Application' },
  pipelineSelect: { 'ui:placeholder': 'Select Pipeline' },
  artifacts: { 'ui:widget': 'hidden' },
  workflowVariables: { 'ui:widget': 'hidden' }
}

@observer
class ExecPipelineModal extends React.Component {
  state = {
    key: '',
    artifacts: [],
    selectedArtifacts: [],
    errors: '',
    schema,
    formData: {},
    serviceList: [],
    uiSchema,
    services: [],
    artifactClsName: '__hide',
    initialized: false
  }
  artifactDataList = []
  artifactStreamData = []
  accountId = Utils.accountIdFromUrl()

  componentWillReceiveProps (newProps) {
    if (newProps.show && !this.state.initialized) {
      this.setState({ initialized: true })
      const pipelines = Utils.getJsonValue(newProps, 'data.pipelines') || []
      this.updateForm({ pipelines })
    }
  }

  updateForm ({ formData = {}, pipelines = [], selectedPipeline, workflowDetails = [] }) {
    const allApps = this.props.dataStore.apps
    const _schema = Utils.clone(schema)
    const _uiSchema = Utils.clone(uiSchema)

    // if (!selectedPipeline) {
    _schema.properties.appId.enum = [...allApps.map(item => item.uuid)]
    _schema.properties.appId.enumNames = [...allApps.map(item => item.name)]

    _schema.properties.pipelineSelect.enum = [...pipelines.map(item => item.uuid)]
    _schema.properties.pipelineSelect.enumNames = [...pipelines.map(item => item.name)]
    // }
    // this.setState({ schema, errors: '', selectedArtifacts: [] })
    _uiSchema.artifacts = { 'ui:widget': 'hidden' }

    // Workflow variables exist
    // workflowDetails.forEach(workflow => {
    //   if (!workflow) {
    //     return
    //   }
    //   const workflowVariableSchema = _schema.properties.workflowVariables
    //   workflowVariableSchema.properties = {}
    //   workflowVariableSchema.required = []
    //   _uiSchema.workflowVariables = {}
    //   formData.workflowVariables = {}
    //
    //   const labelProp = `__workflow_section_label_for_${workflow.workflowName}`
    //   workflowVariableSchema.properties[labelProp] = {
    //     title: `${workflow.pipelineStageName} Workflow Variables`,
    //     type: 'string'
    //   }
    //
    //   _uiSchema.workflowVariables[labelProp] = {
    //     classNames: 'workflow-variable-section-label',
    //     'ui:disabled': 'true'
    //   }
    //
    //   workflow.variables && workflow.variables.forEach(v => {
    //     workflowVariableSchema.properties[v.name] = {
    //       type: 'string',
    //       title: v.name,
    //       default: v.value
    //     }
    //
    //     formData.workflowVariables[v.name] = v.value
    //
    //     if (v.mandatory) {
    //       workflowVariableSchema.required.push(v.name)
    //     }
    //
    //     _uiSchema.workflowVariables[v.name] = { classNames: 'workflow-variable-field' }
    //     if (v.description) {
    //       _uiSchema.workflowVariables[v.name]['ui:help'] = v.description
    //     }
    //
    //   })
    // })

    this.setState({ schema: _schema, uiSchema: _uiSchema, formData })
  }

  onChange = async ({ formData }) => {
    const prevAppId = Utils.getJsonValue(this, 'state.formData.appId') || ''
    if (formData.appId !== prevAppId && formData.appId) {
      const { pipelines } = await PipelinesService.getPipelines(this.accountId, `&appId=${formData.appId}`)
      this.updateForm({ formData, pipelines })
    }

    const prevPipeLine = this.state.formData.pipelineSelect
    if (formData.pipelineSelect !== prevPipeLine) {
      const { services /* , workflowDetails*/ } = await PipelinesService.getPipelineServices(
        this.accountId,
        formData.appId,
        formData.pipelineSelect
      )

      // if (workflowDetails && workflowDetails.length) {
      //   this.updateForm({ formData, selectedPipeline: formData.pipelineSelect, workflowDetails })
      // }

      const serviceIds = services.map(service => service.uuid)
      this.setState({ serviceArray: services })
      this.artifactDataList = []
      this.artifactStreamData = []
      const fetchArr = [
        this.getArtifacts(formData.appId, serviceIds),
        this.getArtifactStreams(formData.appId, serviceIds)
      ]
      Promise.all(fetchArr).then(response => {
        const _uiSchema = Utils.clone(this.state.uiSchema)
        const artifacts = this.artifactDataList
        const streamData = this.artifactStreamData
        const groupedArtifacts = ServiceArtifactSelect.groupArtifactBuildsByService(services, artifacts, streamData)
        const uiWidget =
          groupedArtifacts.serviceNames.length > 0
            ? this.renderArtifactComponent.bind(this, groupedArtifacts)
            : 'hidden'

        _uiSchema.artifacts = {
          'ui:widget': uiWidget,
          classNames: '__artifactSelect'
        }

        this.setState({
          services: services,
          serviceList: serviceIds,
          artifactList: this.artifactDataList,
          formData,
          uiSchema: _uiSchema,
          key: Math.random()
        })
      })
    }

    // if ( formData.pipelineSelect !== prevPipeLine ) {
    //   apis.fetchPipelineServices(this.props.appId, formData.pipelineSelect)
    //     .then((result) => {
    //       serviceList = result.resource.services.map( (service) => service.uuid)
    //       this.artifactDataList = []
    //       this.artifactStreamData = []
    //       const fetchArr = [this.getArtifacts(this.props.appId, serviceList),
    //       this.getArtifactStreams(this.props.appId, serviceList)]
    //       Promise.all (fetchArr)
    //             .then(response => {
    //               const uiSchema = Utils.clone(this.state.uiSchema)
    //               const serviceList = result.resource.services
    //               const artifacts = this.artifactDataList
    //               const streamData = this.artifactStreamData
    //               const groupedArtifacts = ServiceArtifactSelect.groupArtifactBuildsByService(serviceList, artifacts,
    //               streamData)
    //               const uiWidget = (groupedArtifacts.serviceNames.length > 0)
    //               ? this.renderArtifactComponent.bind(this, groupedArtifacts) : 'hidden'

    //               uiSchema.artifacts = { 'ui:widget': uiWidget,
    //                classNames: '__artifactSelect' }
    //               this.setState({ services: result.resource.services,
    //                 serviceList,
    //                 artifactList: this.artifactDataList,
    //                 formData, uiSchema, key: Math.random() })
    //             })
    //       /* apis.fetchArtifactsForPipeLines(this.props.appId, serviceList)
    //       .then ((artifactData) => {
    //         artifactList = artifactData.resource.response
    //         uiSchema.artifacts = { 'ui:widget': this.renderArtifactMultiSelect, classNames: '__artifactSelect' }
    //         this.setState({ formData, uiSchema, artifactList, serviceList, services: result.resource.services })
    //       })*/
    //     })
    // }
    // console.log(this.state.uiSchema)
  }

  getArtifacts = (appId, serviceIdArr, searchFilter = null) => {
    return apis.fetchArtifactsForPipeLines(appId, serviceIdArr, searchFilter).then(artifactsData => {
      this.artifactDataList = artifactsData.resource.response
    })
  }

  getArtifactStreams = (appId, serviceIdArr) => {
    return apis.fetchServiceArtifactStreamDataForDeployment(appId, serviceIdArr).then(result => {
      this.artifactStreamData = result.resource.response
    })
  }

  filterArtifactSelectByBuildNumber = buildNumber => {
    const formData = Utils.clone(this.state.formData)

    const serviceArr = Utils.clone(this.state.serviceArray)
    const serviceIds = serviceArr.map(service => service.uuid)

    const fetchArr = [
      this.getArtifacts(formData.appId, serviceIds, buildNumber),
      this.getArtifactStreams(formData.appId, serviceIds)
    ]
    return Promise.all(fetchArr).then(response => {
      return this.setUiWidget(serviceArr)
    })
  }

  setUiWidget = serviceArr => {
    const groupedArtifactsObj = ServiceArtifactSelect.groupArtifactBuildsByService(
      serviceArr,
      this.artifactDataList,
      this.artifactStreamData
    )

    return groupedArtifactsObj
    /* formUiSchema.artifactSelect = { 'ui:widget': uiWidget, classNames: '__artifactSelect' }
    this.setState({ formUiSchema, key: Math.random() })*/
  }

  onSubmit = () => {
    // TODO: Why not use {formData} passed to this function???
    const uiSchema = Utils.clone(this.state.uiSchema)
    const formData = this.state.formData
    const artifactExists = formData.artifacts && formData.artifacts.length > 0
    if (formData.pipelineSelect !== '' && artifactExists) {
      this.props.onSubmit(this.state.formData)
    } else {
      let errorMessage
      if (formData.pipelineSelect === '' && !artifactExists) {
        errorMessage = 'Please select Pipeline and Artifact to execute.'
      } else if (formData.pipelineSelect === '') {
        errorMessage = 'Please select Pipeline to execute.'
      } else if (!artifactExists) {
        const uiWidget = uiSchema.artifacts['ui:widget']
        errorMessage =
          uiWidget !== 'hidden' ? 'Please select Artifacts to execute.' : 'Incomplete as there are no artifacts'
      }
      this.setState({ errors: errorMessage })
    }
  }

  validate = formData => {}

  renderArtifactComponent = (result, props) => {
    const serviceNames = result.serviceNames
    const resultObj = result.groupedArtifacts
    const uniqServices = new Set(serviceNames)

    const serviceArray = Array.from(uniqServices)
    if (serviceArray.length > 0) {
      return (
        <ServiceArtifactSelect
          services={serviceArray}
          parentProps={props}
          artifacts={resultObj}
          setArtifactsOnFormData={this.updateArtifacts}
          filterArtifactSelectByBuildNumber={this.filterArtifactSelectByBuildNumber}
        />
      )
    } else {
      return <div />
    }
  }

  updateArtifacts = selectedValue => {
    const artifacts = selectedValue.split(',')
    const formData = Utils.clone(this.state.formData)
    formData.artifacts = artifacts
    this.setState({ formData })
  }

  hideModal = () => {
    this.setState({ initialized: false })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={`${css.main} ${cssArtifactSelect.main}`}>
        <Modal.Header closeButton>
          <Modal.Title>Execute Pipeline</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <WingsForm
            name="Execute Pipeline"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            FieldTemplate={FormFieldTemplate}
            onChange={this.onChange}
            key={this.state.key}
          >
            <div /> {/* use empty div to remove the default Submit button */}
          </WingsForm>

          <div className="__errors">
            {this.state.errors}
          </div>

          <div className="__footer">
            <Button bsStyle="primary" onClick={this.onSubmit} className="submit-button">
              Submit
            </Button>
          </div>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default ExecPipelineModal


// WEBPACK FOOTER //
// ../src/containers/ArtifactPage/ExecPipelineModal.js