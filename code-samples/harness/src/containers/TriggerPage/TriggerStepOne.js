import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { UIButton, WingsForm, CompUtils, FormUtils, Utils } from 'components'
import { TriggerService } from 'services'
import css from './TriggerSteps.css'

const TRANSLATE_API_THROTTLE = 200 // ms

const baseSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    // name: { type: 'string', title: 'Name' },
    // description: { type: 'string', title: 'Description' },
    condition: {
      type: 'object',
      title: '',
      properties: {
        conditionType: {
          type: 'string',
          title: 'Type:',
          enum: ['NEW_ARTIFACT', 'PIPELINE_COMPLETION', 'SCHEDULED', 'WEBHOOK'],
          enumNames: ['On New Artifact', 'On Pipeline Completion', 'On Time Schedule', 'On Webhook Push Event']
        },
        artifactStreamId: {
          type: 'string',
          title: 'Artifact Source',
          enum: [],
          enumNames: []
        },
        artifactFilter: {
          type: 'string',
          title: 'Build/Tag Filter'
        },
        pipelineId: {
          type: 'string',
          title: 'Pipeline',
          enum: [],
          enumNames: []
        }
      }
    }
  }
}
const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' }, // for Edit
  // name: { 'ui:placeholder': 'Trigger Name' },
  condition: {
    conditionType: {
      'ui:widget': 'radio',
      'ui:options': { inline: false }
    },
    artifactStreamId: { 'ui:widget': 'hidden' },
    artifactFilter: { 'ui:widget': 'hidden' },
    pipelineId: { 'ui:widget': 'hidden' }
  }
}
const widgets = {}

export default class TriggerStepOne extends React.Component {
  state = {
    schema: baseSchema,
    uiSchema: baseUiSchema,
    formData: {
      condition: {}
    },
    formKey: Math.random()
  }
  form
  artifactSources
  pipelines
  translateTimer

  async componentWillMount () {
    // const formData = WingsDynamicForm.toFormData({ data: this.props.data }) || {} // API-data to formData (for Edit)
    await this.init(this.props)

    // initializing = true to avoid infinite loop.
    await this.onChange({ formData: this.props.formData, isInitializing: true })
  }

  async componentWillReceiveProps (newProps) {
    await this.init(newProps)
  }

  async init (props) {
    const { services = [], formData } = props
    const { schema, uiSchema } = this.state

    // if props.artifactSources has data => initialize Artifact Sources dropdown:
    const isArtifactSourcesChanged = this.setupArtifactSources(props.artifactSources, services)
    const isPipelinesChanged = this.setupPipelines(props.pipelines)
    if (isArtifactSourcesChanged || isPipelinesChanged) {
      await CompUtils.setComponentState(this, {
        schema,
        uiSchema,
        formData,
        formKey: Math.random() // force refresh form
      })
    }
    await CompUtils.setComponentState(this, {
      schema,
      uiSchema,
      formData
    })
  }

  setupArtifactSources = (artifactSources, services) => {
    if (this.artifactSources !== artifactSources) {
      this.artifactSources = artifactSources
      const field = baseSchema.properties.condition.properties.artifactStreamId
      field.enum = []
      field.enumNames = []
      for (const artifactSrc of this.artifactSources) {
        const service = services.find(svc => svc.uuid === artifactSrc.serviceId)
        field.enum.push(artifactSrc.uuid)
        field.enumNames.push(`${artifactSrc.sourceName} (${service.name})`)
      }
      return true
    }
    return false
  }

  setupPipelines = pipelines => {
    if (this.pipelines !== pipelines) {
      this.pipelines = pipelines
      FormUtils.setEnumAndNames(baseSchema.properties.condition.properties.pipelineId, this.pipelines)
      return true
    }
    return false
  }

  // onInitializeForm = async form => {
  //   // await form.autoProcessInitialize(['condition'])
  //   await form.autoProcessSubfieldInitialize('condition')
  // }

  onChange = async ({ formData, isInitializing = false }) => {
    // NOTE! this will make parent to change data => update this.props => trigger init (props)
    const { schema, uiSchema } = this.state

    const lastType = Utils.getJsonValue(this, 'state.formData.condition.conditionType') || ''
    const currentType = Utils.getJsonValue(formData, 'condition.conditionType')
    if (isInitializing || (typeof currentType !== 'undefined' && currentType && currentType !== lastType)) {
      console.log('Type changed => refresh Form.')
      if (currentType === 'NEW_ARTIFACT') {
        FormUtils.hideFields(baseUiSchema, uiSchema, ['pipelineId'])
        FormUtils.showFields(baseUiSchema, uiSchema, ['artifactStreamId', 'artifactFilter'])
      } else if (currentType === 'PIPELINE_COMPLETION') {
        FormUtils.hideFields(baseUiSchema, uiSchema, ['artifactStreamId', 'artifactFilter'])
        FormUtils.showFields(baseUiSchema, uiSchema, ['pipelineId'])
      } else {
        FormUtils.hideFields(baseUiSchema, uiSchema, ['artifactStreamId', 'artifactFilter', 'pipelineId'])
      }
      await CompUtils.setComponentState(this, {
        schema,
        uiSchema,
        formData,
        formKey: Math.random()
      })
    }
    if (isInitializing === false) {
      this.props.onChange({ formData })
    }
  }

  onChangeCron = ({ cronExpression, cronDescription }) => {
    const { formData } = this.state
    if (cronExpression) {
      formData.condition.cronExpression = cronExpression
    }
    if (cronDescription) {
      formData.condition.cronDescription = cronDescription
    }
    console.log(555, formData.condition.cronExpression)
    this.setState({ formData })
  }

  renderCronUI = div => {
    this.cronDiv = div
    if (this.cronDiv) {
      const { formData } = this.state
      console.log(111, formData.condition.cronExpression)

      new CronUI(this.cronDiv, {
        initial: formData.condition.cronExpression,
        changeEvent: async cronExpression => {
          // const cronDescription = await this.translateCron(cronString)
          this.onChangeCron({ cronExpression })
          this.props.resetErrorMessage()

          clearTimeout(this.translateTimer)
          if (cronExpression) {
            this.translateTimer = setTimeout(async () => {
              const cronDescription = await this.translateCron(cronExpression)
              this.onChangeCron({ cronDescription })
            }, TRANSLATE_API_THROTTLE)
          }
        }
      })
    }
  }

  translateCron = async expression => {
    const { response, error } = await TriggerService.translateCron({
      accountId: this.props.urlParams.accountId,
      expression
    })
    if (!error) {
      const cronDescription = response
      this.setState({ cronDescription })
      return cronDescription
    }
    return ''
  }

  onChangeOnNewArtifactOnly = e => {
    const { formData } = this.state
    formData.condition.onNewArtifactOnly = e.target.checked
    this.setState({ formData })
  }

  render () {
    const { formData } = this.state
    const conditionType = Utils.getJsonValue(formData, 'condition.conditionType') || ''
    return (
      <main className={css.main}>
        <div className={css.condition}>
          <WingsForm
            key={this.state.formKey}
            name="Trigger Modal - Step One"
            ref={f => (this.form = f)}
            onInitializeForm={this.onInitializeForm}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            widgets={widgets}
          >
            <span />
          </WingsForm>

          {conditionType === 'SCHEDULED' && (
            <div className={css.cron}>
              <Checkbox checked={formData.condition.onNewArtifactOnly} onChange={this.onChangeOnNewArtifactOnly}>
                On New Artifact Only
              </Checkbox>
              <label>Trigger Every:</label>
              <div className="__cronBuilder" ref={this.renderCronUI} />

              {this.state.cronDescription ? (
                <div className={css.expression}>Schedule: {this.state.cronDescription}</div>
              ) : null}
            </div>
          )}

          <UIButton
            className={css.submit}
            type="button"
            accent
            onClick={() => this.props.onClickNext('condition', formData)}
          >
            Next
          </UIButton>
        </div>
      </main>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerStepOne.js