import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { WingsModal, WingsDynamicForm, CompUtils, Utils } from 'components'
import { SettingsService } from 'services'

const fieldOrder = ['analysisServerConfigId', 'applicationId']

const baseSchema = {
  type: 'object',
  required: ['analysisServerConfigId', 'applicationId', 'comparisonStrategy'],
  properties: {
    analysisServerConfigId: {
      type: 'string',
      title: 'New Relic Server',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchNewRelicServers'
    },
    applicationId: {
      type: 'string',
      title: 'Application Name',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchNewRelicApps'
    },
    comparisonStrategy: {
      enum: ['COMPARE_WITH_CURRENT', 'COMPARE_WITH_PREVIOUS'],
      type: 'string',
      title: 'Baseline for Risk Analysis',
      enumNames: ['Canary Analysis', 'Previous Analysis'],
      default: 'COMPARE_WITH_PREVIOUS'
    },
    timeDuration: {
      type: 'string',
      description: 'Default 15 minutes',
      title: 'Analysis Time duration (in minutes)',
      default: '15'
    },
    executeWithPreviousSteps: {
      type: 'boolean',
      title: 'Execute with previous steps',
      default: false
    }
  },
  dataProviders: {
    fetchNewRelicServers: async ({ formData, formProps }) => {
      const { accountId } = formProps.urlParams
      const { connectors } = await SettingsService.fetchConnectors({ accountId })
      const arr = connectors.filter(c => c.value && c.value.type === 'NEW_RELIC')
      return arr
    },
    fetchNewRelicApps: async ({ formData, formProps }) => {
      const { accountId } = formProps.urlParams
      const { apps } = await SettingsService.fetchNewRelicApps({
        accountId,
        settingId: formData.analysisServerConfigId
      })
      return {
        data: apps,
        transformedData:
          apps && apps.length > 0
            ? apps.map(app => ({ name: app.name, uuid: app.id.toString() }))
            : [{ name: 'No apps are available', uuid: null }]
      }
    }
  }
}
const baseUiSchema = {
  analysisServerConfigId: { 'ui:placeholder': 'Select New Relic Server' },
  applicationId: { 'ui:placeholder': 'Select New Relic Application' }
}
const widgets = {}

class NewRelicVerificationModal extends React.Component {
  state = {}
  form

  componentWillMount () {
    if (this.props.show) {
      this.init(this.props)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.init(newProps)
    }
  }

  init = async props => {
    await CompUtils.setComponentState(this, {
      initialized: true,
      fieldOrder: fieldOrder,
      schema: baseSchema,
      uiSchema: baseUiSchema,
      formData: Utils.clone(props.formData)
    })
  }

  onInitializeForm = async form => {
    await form.autoProcessInitialize(fieldOrder)
  }

  onChange = async ({ formData }) => {
    const form = this.form
    await form.autoProcessChange(fieldOrder)
    await form.updateChanges()
  }

  onSubmit = async ({ formData }) => {
    this.props.onSubmit({ formData })
  }

  onHide = () => {
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>New Relic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            {...this.props}
            name="New Relic Form"
            ref={f => (this.form = f)}
            onInitializeForm={this.onInitializeForm}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            widgets={widgets}
            dataStore={this.props.dataStore}
          >
            <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
              SUBMIT
            </Button>
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default NewRelicVerificationModal



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/NewRelicVerificationModal.js