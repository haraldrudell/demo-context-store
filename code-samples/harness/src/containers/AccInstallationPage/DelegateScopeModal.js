import React from 'react'
import { observer } from 'mobx-react'
import { Button, Modal } from 'react-bootstrap'
import { WingsModal, WingsForm, Utils, FormUtils } from 'components'
import { InfrasService } from 'services'

const baseSchema = {
  type: 'object',
  required: [],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    // TODO: support taskTypes
    name: {
      type: 'string',
      title: 'Name'
    },
    taskTypes: {
      type: 'string',
      title: 'Command',
      enum: [],
      enumNames: []
    },
    applications: {
      type: 'string',
      title: 'Application',
      enum: [],
      enumNames: []
    },
    environmentTypes: {
      type: 'string',
      title: 'Environment Type',
      enum: ['PROD', 'NON_PROD'],
      enumNames: ['Production', 'Non-Production']
    },
    environments: {
      type: 'string',
      title: 'Environment',
      enum: [],
      enumNames: []
    },
    serviceInfrastructures: {
      type: 'string',
      title: 'Service Infrastructure',
      enum: [],
      enumNames: []
    }
    // includeOrExclude: {
    //   type: 'string',
    //   title: 'Scope',
    //   default: 'INCLUDE',
    //   enum: ['INCLUDE', 'EXCLUDE'],
    //   enumNames: ['Include', 'Exclude']
    // }
  }
}

const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' } // for Edit
  // includeOrExclude: { 'ui:widget': 'radio' }
}

@observer
class DelegateScopeModal extends React.Component {
  state = {
    schema: baseSchema,
    uiSchema: baseUiSchema,
    formData: {}
  }
  initialized = false
  allInfraMappings

  componentWillReceiveProps = async newProps => {
    if (newProps.show && !this.initialized) {
      // run only once on modal show.
      this.initialized = true
      await this.fetchData()

      const formData =
        FormUtils.toFormData({
          data: newProps.data,
          arrayToStringProps: [
            'taskTypes',
            'environmentTypes',
            'environments',
            'applications',
            'serviceInfrastructures'
          ]
        }) || {}

      this.updateForm({ formData })
      // this.setState({ initialized: true })
    }
  }

  fetchData = async () => {
    const { infraMappings } = await InfrasService.getInfraMappings(this.props.urlParams.accountId)
    this.allInfraMappings = []
    for (const infra of infraMappings) {
      const app = Utils.findByUuid(this.props.dataStore.apps, infra.appId)
      infra.customName = app.name + ': ' + infra.name
      this.allInfraMappings.push(infra)
    }
  }

  getAllEnvironments = () => {
    const allEnvironments = []
    const apps = this.props.dataStore.apps || []
    for (const app of apps) {
      for (const env of app.environments) {
        env.customName = app.name + ': ' + env.name
        allEnvironments.push(env)
      }
    }
    return allEnvironments
  }

  updateForm = ({ formData }) => {
    const _schema = FormUtils.clone(baseSchema)
    const _uiSchema = FormUtils.clone(baseUiSchema)
    const allEnvs = this.getAllEnvironments()
    FormUtils.setEnumAndNames(_schema.properties.applications, this.props.dataStore.apps)
    FormUtils.setEnumAndNames(_schema.properties.environments, allEnvs, 'uuid', 'customName')
    FormUtils.setEnumAndNames(_schema.properties.serviceInfrastructures, this.allInfraMappings, 'uuid', 'customName')
    FormUtils.setEnumAndNames(_schema.properties.taskTypes, this.props.dataStore.catalogs.TASK_TYPES, 'value', 'name')

    this.setState({ schema: _schema, uiSchema: _uiSchema, formData })
  }

  onChange = async ({ formData }) => {
    if (FormUtils.isFieldChanged(this, formData, 'applications')) {
      this.updateForm({ formData })
    }
    this.setState({ formData })
  }

  onSubmit = async ({ formData }) => {
    this.setState({ submitting: true })
    await this.props.onSubmit(formData)
    this.initialized = false
    this.setState({ submitting: false })
  }

  onHide = () => {
    this.setState({ submitting: false })
    this.props.onHide()
    this.initialized = false
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.onHide} submitting={this.state.submitting}>
        <Modal.Header closeButton>
          <Modal.Title>Delegate Scope</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Delegate Scope Modal"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          >
            <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
              SUBMIT
            </Button>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default DelegateScopeModal



// WEBPACK FOOTER //
// ../src/containers/AccInstallationPage/DelegateScopeModal.js