import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsDynamicForm, CompUtils, WingsModal, SearchableSelect, Utils } from 'components'
import { SecretManagementService } from 'services'

const widgets = {
  SearchableSelect
}

export default class MigrateKMSModal extends React.Component {
  baseSchema = {
    type: 'object',
    required: ['migrateTo'],
    properties: {
      migrateTo: {
        type: 'string',
        title: 'Transition data to use',
        enum: [],
        enumNames: [],
        'custom:ordering': true,
        'custom:dataProvider': 'fetchMigrateKMSList'
      }
    },
    dataProviders: {
      fetchMigrateKMSList: () => {
        const { migrateKMSList } = this.props
        const kmsArray = []
        migrateKMSList.map(item => {
          const obj = {}
          obj['uuid'] = item.uuid
          const encryptionTitle = Utils.encryptionTitles[item.encryptionType]
          obj['name'] = `${item.name} (${encryptionTitle})`
          kmsArray.push(obj)
        })

        return {
          data: migrateKMSList,
          transformedData: kmsArray
        }
      }
    }
  }

  baseUiSchema = {
    migrateTo: {
      'ui:widget': 'SearchableSelect',
      'ui:placeholder': 'Select KMS'
    }
  }

  async componentWillMount () {
    await this.init(this.props)
  }

  init = async props => {
    if (props.show) {
      await CompUtils.setComponentState(this, {
        initialized: true,
        schema: this.baseSchema,
        uiSchema: this.baseUiSchema,
        formData: {},
        widgets
      })
    }
  }

  modifyKMSList = () => {
    const { migrateKMSList } = this.props
    const kmsArray = []
    migrateKMSList.map(item => {
      const obj = {}
      obj['uuid'] = item.uuid
      const encryptionTitle = Utils.encryptionTitles[item.encryptionType]
      obj['name'] = `${item.name} (${encryptionTitle})`
      kmsArray.push(obj)
    })

    return kmsArray
  }

  onInitializeForm = async form => {
    await form.autoProcessInitialize(['migrateTo'])
  }

  hideModal = () => {
    this.props.onHide()
  }

  onSubmit = async ({ formData }) => {
    const { accountId, migrateFrom } = this.props
    const { uuid: fromKmsId, encryptionType: fromEncryptionType } = migrateFrom

    const toKmsId = formData.migrateTo

    const { error } = await SecretManagementService.migrateKMS({
      accountId,
      fromKmsId,
      toKmsId,
      fromEncryptionType,
      toEncryptionType: this.toEncryptionType
    })
    if (error) {
      return
    }
    await this.props.afterSubmit()
  }

  onChange = async ({ formData }) => {
    const context = this.form
    const fieldData = context.getFieldData('migrateTo')

    if (formData.migrateTo) {
      const filteredItem = fieldData.find(item => item.uuid === formData.migrateTo)
      this.toEncryptionType = filteredItem.encryptionType
    }
    await context.updateChanges()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deprecate KMS - {this.props.migrateFrom.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Migrate KMS"
            onInitializeForm={this.onInitializeForm}
            ref={f => (this.form = f)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            widgets={this.state.widgets}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/MigrateKMSModal.js