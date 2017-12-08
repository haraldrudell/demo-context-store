import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal, UIButton, CollapsiblePanel, NameValueList, Utils } from 'components'
import TriggerStepOverview from './TriggerStepOverview'
import TriggerStepOne from './TriggerStepOne'
import TriggerStepTwo from './TriggerStepTwo'
import { PipelinesService, ArtifactStreamService } from 'services'
import TriggerUtils from './TriggerUtils'
import css from './TriggerModal.css'

export default class TriggerModal extends React.Component {
  state = {
    isOpenOverview: true,
    isOpenStepOne: false,
    isOpenStepTwo: false,
    pipelines: [],
    artifactSources: [],
    data: {
      // combined data of StepOne & StepTwo formDatas
      name: '',
      description: '',
      condition: {
        conditionType: '',
        artifactFilter: ''
        // artifactStreamId
        // pipelineId
      }
      // artifactSelections: [] // array of [ { serviceId, type } ]
    }
  }
  modal

  /*
  {
   “name”:“New Artifact Trigger 5",
   “description”:“New artifact trigger”,
   “condition”:{
     “conditionType”:“NEW_ARTIFACT”,
      “artifactStreamId”:“gDwEv80aQOK86gyJxhlg6w”,
      “artifactFilter”:“todo*”
   },
   “artifactSelections”:[
     {
        “serviceId”:“gF23g3SSSRmWO33SQJAu3A”,
        “type”:“ARTIFACT_SOURCE”
      }
   ],
   “pipelineId”:“DVefLtcyQ-G9nHLBofPLLA”  // Execute Pipeline
}
*/

  async componentWillMount () {
    // - fetch Artifact Sources
    // - fetch Pipelines
    const { data = {} } = this.props
    const { accountId, appId } = this.props.urlParams
    const { pipelines } = await PipelinesService.getPipelines(accountId, `&appId=${appId}`)
    const { artifactStreams } = await ArtifactStreamService.fetchAppArtifactStreams({ accountId, appId })
    // const { pipelines, artifactStreams } = Mocks

    this.setState({ pipelines, artifactSources: artifactStreams, data })
  }

  onChangeStepData = ({ formData }) => {
    const { data } = this.state
    const updatedData = {
      ...data,
      ...formData
    }
    this.setState({ data: updatedData })
  }

  onChangeStepTwo = ({ formData }) => {
    const { data } = this.state
    const updatedData = {
      ...data,
      ...formData
    }
    this.setState({ data: updatedData })
  }

  onSubmit = () => {
    const { data } = this.state
    data.condition = data.condition || {}
    const type = Utils.getJsonValue(data, 'condition.conditionType') || ''
    // clean up data:
    if (type === 'NEW_ARTIFACT') {
      delete data.condition.pipelineId
      delete data.condition.pipelineName
      delete data.condition.cronExpression
      delete data.condition.cronDescription
      delete data.condition.onNewArtifactOnly
      delete data.condition.webHookToken
    } else if (type === 'PIPELINE_COMPLETION') {
      delete data.condition.artifactStreamId
      delete data.condition.artifactSourceName
      delete data.condition.artifactFilter
      delete data.condition.cronExpression
      delete data.condition.cronDescription
      delete data.condition.onNewArtifactOnly
      delete data.condition.webHookToken
    } else {
      if (type === 'SCHEDULED') {
        delete data.condition.webHookToken
      } else if (type === 'WEBHOOK') {
        delete data.condition.cronExpression
        delete data.condition.cronDescription
        delete data.condition.onNewArtifactOnly
      }
      delete data.condition.artifactStreamId
      delete data.condition.artifactSourceName
      delete data.condition.artifactFilter
      delete data.condition.pipelineId
      delete data.condition.pipelineName
    }
    console.log('onSubmit: ', JSON.stringify(data))
    console.log(data)
    this.props.onSubmit(data)
  }

  onHide = () => {
    this.props.onHide()
  }

  onClickNext = (panel, formData) => {
    const { data } = this.state
    console.log('onClickNext data: ', data)

    if (panel === 'overview') {
      data.name = formData.name
      data.description = formData.description
      this.setState({ isOpenOverview: false, isOpenStepOne: true, isOpenStepTwo: false, data })
    } else if (panel === 'condition') {
      this.setState({ isOpenOverview: false, isOpenStepOne: false, isOpenStepTwo: true, data })
    } else if (panel === 'actions') {
      this.setState({ isOpenOverview: false, isOpenStepOne: false, isOpenStepTwo: false, data })
    }
  }

  onTogglePanel = (isOpen, panel) => {
    if (isOpen === true) {
      if (panel === 'overview') {
        this.setState({ isOpenOverview: true, isOpenStepOne: false, isOpenStepTwo: false })
      } else if (panel === 'condition') {
        this.setState({ isOpenOverview: false, isOpenStepOne: true, isOpenStepTwo: false })
      } else if (panel === 'actions') {
        this.setState({ isOpenOverview: false, isOpenStepOne: false, isOpenStepTwo: true })
      }
    }
  }

  renderSummaryOne = () => {
    const { data } = this.state
    if (data.condition && data.condition.conditionType) {
      const arr = []
      arr.push({ name: 'Type', value: TriggerUtils.getTypeText(data) })
      if (data.condition.conditionType !== 'WEBHOOK') {
        // for Webhook, we show "Type" only:
        arr.push({
          name: 'Condition',
          value: TriggerUtils.getConditionText(data, this.state.pipelines, this.state.artifactSources)
        })
      }
      return <NameValueList data={arr} />
    }
    return null
  }

  renderSummaryTwo = () => {
    const { data } = this.state
    if (data.artifactSelections && data.artifactSelections.length > 0) {
      const arr = []
      for (const selection of data.artifactSelections) {
        arr.push({
          name: 'Action',
          value: TriggerUtils.getActionText(selection, this.state.pipelines, this.state.artifactSources)
        })
      }
      return <NameValueList data={arr} />
    }
  }

  render () {
    const { isOpenOverview, isOpenStepOne, isOpenStepTwo, pipelines, artifactSources, data } = this.state
    const formData = data

    const commonProps = {
      ...this.props,
      formData,
      services: this.props.services,
      artifactSources,
      pipelines,
      resetErrorMessage: () => this.modal.resetErrorMessage()
    }
    const showSubmit = formData.uuid || (!isOpenOverview && !isOpenStepOne && !isOpenStepTwo) ? true : false
    // const selections = Utils.getJsonValue(formData, 'artifactSelections') || []
    // const isDisabledSubmit = !formData.name || selections.length === 0 ? true : false
    const isDisabledSubmit = !formData.name ? true : false

    return (
      <WingsModal show={true} onHide={this.onHide} className={css.main} ref={m => (this.modal = m)}>
        <Modal.Header closeButton>
          <Modal.Title>Trigger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <TriggerStepOverview
              {...commonProps}
              className={css.panel}
              isOpen={isOpenOverview}
              onChange={this.onChangeStepData}
              onClickNext={this.onClickNext}
              onToggle={this.onTogglePanel}
            />

            <CollapsiblePanel
              className={css.panel}
              name="condition"
              title="Condition"
              isOpen={isOpenStepOne}
              onToggle={this.onTogglePanel}
              summary={TriggerUtils.renderCondition(formData, pipelines, artifactSources)}
            >
              <TriggerStepOne {...commonProps} onChange={this.onChangeStepData} onClickNext={this.onClickNext} />
            </CollapsiblePanel>

            <CollapsiblePanel
              className={css.panel}
              name="actions"
              title="Actions"
              isOpen={isOpenStepTwo}
              onToggle={this.onTogglePanel}
              summary={TriggerUtils.renderActions(formData, pipelines, artifactSources, this.props.services)}
            >
              <TriggerStepTwo {...commonProps} onChange={this.onChangeStepData} onClickNext={this.onClickNext} />
            </CollapsiblePanel>

            {showSubmit && (
              <UIButton type="submit" onClick={this.onSubmit} disabled={isDisabledSubmit} disabled={isDisabledSubmit}>
                Submit
              </UIButton>
            )}
          </div>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerModal.js