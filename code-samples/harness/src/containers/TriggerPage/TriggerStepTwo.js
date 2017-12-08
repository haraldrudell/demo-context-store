import React from 'react'
import Select from 'react-select'
import { Radio } from 'react-bootstrap'
import { NameValueList, Utils, CompUtils, UIButton } from 'components'
import css from './TriggerSteps.css'

import { PipelinesService } from 'services'

export default class TriggerStepTwo extends React.Component {
  state = {
    pipelines: [],
    selectedPipeline: null,
    artifactSources: [],
    formData: {
      // pipelineId: '', // action (trigger pipeline)
      artifactSelections: [] // array of [ { serviceId, type } ]
    }
  }
  form
  pipelines = []

  async componentWillMount () {
    const { formData } = this.props
    await this.init(this.props)

    // if (formData.pipelineId) {
    //   console.log(111)
    //   this.onChangePipeline(formData.pipelineId)
    // }
    if (formData.pipelineId) {
      await this.onChangePipeline(formData.pipelineId, true)
    }
  }

  async componentWillReceiveProps (newProps) {
    await this.init(newProps)
  }

  async init (props) {
    const { pipelines, artifactSources, formData } = props
    await CompUtils.setComponentState(this, { pipelines, artifactSources, formData })
  }

  onChangePipeline = async (pipelineId, isInitializing) => {
    const { accountId, appId } = this.props.urlParams
    const { formData } = this.state
    formData.pipelineId = pipelineId

    // call API to get & check Required Entities (Artifact)
    const { resource } = await PipelinesService.getRequiredEntitiesForPipelineExecution({ appId, pipelineId })
    if (pipelineId && resource && resource.includes('ARTIFACT')) {
      const { pipeline } = await PipelinesService.getPipelineServices(accountId, appId, pipelineId)
      // const pipeline = Mocks.pipelineWithServices

      // find Pipeline-Service(s) which don't belong to the selected Artifact Source's Services => disable them.
      const selArtifactSourceId = Utils.getJsonValue(this, 'props.formData.condition.artifactStreamId') || ''
      if (selArtifactSourceId) {
        const selArtifactSource = this.props.artifactSources.find(src => src.uuid === selArtifactSourceId)
        for (const svc of pipeline.services) {
          svc.disabled = svc.uuid !== selArtifactSource.serviceId // custom property "svc.disabled"
        }
      }
      await CompUtils.setComponentState(this, { formData, selectedPipeline: pipeline })
    } else {
      await CompUtils.setComponentState(this, { formData, selectedPipeline: null })
    }
    this.setupServicesSection(isInitializing)
  }

  setupServicesSection = isInitializing => {
    const { formData } = this.state
    if (isInitializing) {
      formData.artifactSelections = formData.artifactSelections || []
    } else {
      formData.artifactSelections = []
      this.props.onChange({ formData })
    }
  }

  onChangeSelectionArtSource = (service, type, artifactStreamId) => {
    const { formData } = this.state
    // before updating, delete the existing (if any) artifactSelection with serviceId
    formData.artifactSelections = formData.artifactSelections.filter(s => s.serviceId !== service.uuid) || []
    formData.artifactSelections.push({
      // now add new selection:
      serviceId: service.uuid,
      type, // 'LAST_COLLECTED' or 'WEBHOOK_VARIABLE'
      artifactStreamId,
      artifactFilter: null
    })
    this.props.onChange({ formData })
  }

  onChangeSelectionBuild = (service, buildTag) => {
    const { formData } = this.state
    const selection = formData.artifactSelections.find(s => s.serviceId === service.uuid)
    if (selection) {
      selection.artifactFilter = buildTag
      this.props.onChange({ formData })
    }
  }

  onChangeSelectionPipeline = (service, type, pipelineId) => {
    const { formData } = this.state
    // before updating, delete the existing (if any) artifactSelection with serviceId
    formData.artifactSelections = formData.artifactSelections.filter(s => s.serviceId !== service.uuid) || []
    formData.artifactSelections.push({
      // now add new selection:
      serviceId: service.uuid,
      type, // 'LAST_DEPLOYED' or 'PIPELINE_SOURCE'
      pipelineId
    })
    this.props.onChange({ formData })
  }

  renderFirstRow = (service, artifactSelection, pipelineOptions, artifactSourceOptions) => {
    const { formData } = this.state
    const conditionType = Utils.getJsonValue(formData, 'condition.conditionType') || ''

    if (conditionType === 'PIPELINE_COMPLETION') {
      return (
        <row key={'row_pipeline_' + service.uuid}>
          <col-4>
            <Radio
              name={'radioGroup_' + service.uuid}
              checked={artifactSelection.type === 'PIPELINE_SOURCE'}
              onChange={e => this.onChangeSelectionPipeline(service, 'PIPELINE_SOURCE')}
            >
              From Triggering Pipeline
            </Radio>
          </col-4>
          <col-4>&nbsp;</col-4>
          <col-4>&nbsp;</col-4>
        </row>
      )
    } else if (conditionType === 'NEW_ARTIFACT') {
      return (
        <row key={'row_last_collected_' + service.uuid} className={service.disabled && css.disabledService}>
          <Radio
            name={'radioGroup_' + service.uuid}
            checked={artifactSelection.type === 'ARTIFACT_SOURCE'}
            onChange={e => this.onChangeSelectionArtSource(service, 'ARTIFACT_SOURCE')}
            disabled={service.disabled}
          >
            From Triggering Artifact Source
          </Radio>
        </row>
      )
    } else if (conditionType === 'WEBHOOK') {
      return (
        <row key={'row_webhook_' + service.uuid}>
          <col-4>
            <Radio
              name={'radioGroup_' + service.uuid}
              checked={artifactSelection.type === 'WEBHOOK_VARIABLE'}
              onChange={e => this.onChangeSelectionArtSource(service, 'WEBHOOK_VARIABLE')}
            >
              User Version From Push Event Payload
            </Radio>
          </col-4>
          <col-4>
            <header>Artifact Source</header>
            <Select
              simpleValue
              value={artifactSelection.type === 'WEBHOOK_VARIABLE' && artifactSelection.artifactStreamId}
              placeholder={'Artifact Source'}
              options={artifactSourceOptions}
              onChange={val => this.onChangeSelectionArtSource(service, 'WEBHOOK_VARIABLE', val)}
            />
          </col-4>
          <col-4>
            <header>Build/Tag</header>
            <input type="textbox" />
          </col-4>
        </row>
      )
    }
  }

  render () {
    const { pipelines = [], selectedPipeline, artifactSources = [], formData } = this.state
    const pipelineOptions = Utils.toLabelValueOptions(pipelines, 'name', 'uuid')
    // const selPipeline = pipelines.find(p => p.uuid === formData.pipelineId)
    const services = Utils.getJsonValue(selectedPipeline, 'services') || []

    let labels = []
    if (formData.pipelineId && services.length > 0) {
      labels = [{ name: 'Service', value: 'Build / Version' }]
    }

    return (
      <main className={css.main}>
        <div className={css.executePipeline}>
          <label>Execute Pipeline:</label>
          <Select
            simpleValue
            value={formData.pipelineId}
            placeholder={'Select pipeline'}
            options={pipelineOptions}
            onChange={val => this.onChangePipeline(val, false)}
          />
        </div>
        <div>
          <NameValueList customWidths={['12%', '88%']} data={labels} />
          <NameValueList
            customKeys={['name', 'uuid']}
            customWidths={['12%', '88%']}
            data={services}
            renderValue={service => {
              const artifactSelection =
                (formData.artifactSelections || []).find(s => s.serviceId === service.uuid) || {}

              const artifactSourcesByServiceId = artifactSources.filter(a => a.serviceId === service.uuid)
              const artifactSourceOptions = Utils.toLabelValueOptions(artifactSourcesByServiceId, 'sourceName', 'uuid')
              // <div key={service.uuid} className={css.serviceGroup + ' ' + (service.disabled && css.disabledService)}>
              return (
                <div key={service.uuid} className={css.serviceGroup}>
                  {this.renderFirstRow(service, artifactSelection, pipelineOptions, artifactSourceOptions)}

                  <row key={'row2_' + service.uuid}>
                    <col-4>
                      <Radio
                        name={'radioGroup_' + service.uuid}
                        checked={artifactSelection.type === 'LAST_COLLECTED'}
                        onChange={e => this.onChangeSelectionArtSource(service, 'LAST_COLLECTED')}
                      >
                        Last Collected
                      </Radio>
                    </col-4>
                    <col-4>
                      <header>Artifact Source</header>
                      <Select
                        simpleValue
                        value={artifactSelection.type === 'LAST_COLLECTED' && artifactSelection.artifactStreamId}
                        placeholder={'Artifact Source'}
                        options={artifactSourceOptions}
                        onChange={val => this.onChangeSelectionArtSource(service, 'LAST_COLLECTED', val)}
                      />
                    </col-4>
                    <col-4>
                      <header>Build/Tag</header>
                      <input
                        type="textbox"
                        value={artifactSelection.artifactFilter}
                        onChange={ev => this.onChangeSelectionBuild(service, ev.target.value)}
                      />
                    </col-4>
                  </row>
                  <row key={'row3_' + service.uuid}>
                    <col-4>
                      <Radio
                        name={'radioGroup_' + service.uuid}
                        checked={artifactSelection.type === 'LAST_DEPLOYED'}
                        onChange={e => this.onChangeSelectionPipeline(service, 'LAST_DEPLOYED')}
                      >
                        Last Successfully Deployed
                      </Radio>
                    </col-4>
                    <col-4>
                      <header>Pipeline</header>
                      <Select
                        simpleValue
                        value={artifactSelection.type === 'LAST_DEPLOYED' && artifactSelection.pipelineId}
                        placeholder={'Pipeline'}
                        options={pipelineOptions}
                        onChange={val => this.onChangeSelectionPipeline(service, 'LAST_DEPLOYED', val)}
                      />
                    </col-4>
                    <col-4>&nbsp;</col-4>
                  </row>
                </div>
              )
            }}
          />
        </div>
        <UIButton
          className={css.submit}
          type="button"
          accent
          onClick={() => this.props.onClickNext('actions', formData)}
        >
          Next
        </UIButton>
      </main>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerStepTwo.js