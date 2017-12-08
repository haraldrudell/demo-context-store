import React from 'react'
import { Modal } from 'react-bootstrap'
import { UIButton, WingsModal, WingsDynamicForm, Utils, CompUtils } from 'components'
import { SetupAsCodeService } from 'services'
import css from './SetupAsCodeGitSyncModal.css'

import dataService from '../../apis/dataService'
const baseUrl = dataService.url

const baseSchema = {
  type: 'object',
  required: [],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    // enabled: { type: 'boolean', title: 'Enabled' },
    url: { type: 'string', title: 'Git Https URL' },
    branchName: { type: 'string', title: 'Branch name' },
    // rootPath: { type: 'string', title: 'Root Path', default: '' },
    // sshKey: { type: 'string', title: 'SSH Key' },
    // passphrase: { type: 'string', title: 'Passphrase', default: '' }, // hidden, optional
    username: { type: 'string', title: 'Username' },
    password: { type: 'string', title: 'Password' },
    syncMode: {
      type: 'string',
      title: 'Sync Mode',
      default: 'HARNESS_TO_GIT',
      enum: ['HARNESS_TO_GIT'], // enum: ['HARNESS_TO_GIT', 'GIT_TO_HARNESS', 'BOTH'],
      enumNames: ['One-direction: Harness -> Git']
      // enumNames: ['One-direction: Harness -> Git', 'One-direction: Git -> Harness', 'Both']
    },
    webhookToken: { type: 'string', title: '' }, // hidden
    webhookUrl: { type: 'string', title: 'Webhook URL' } // readonly, don't submit this.
  }
}
const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' }, // for Edit
  webhookToken: { 'ui:widget': 'hidden' },
  webhookUrl: { 'ui:widget': 'hidden', 'ui:readonly': true },
  // enabled: { 'ui:widget': 'checkbox', classNames: css.enabledCheckbox },
  url: { 'ui:placeholder': 'https://github.com/account-name/repo-name.git' },
  sshKey: { 'ui:widget': 'textarea' },
  password: { 'ui:widget': 'password' },
  // #TODO: 'ui:enumDisabled' doesn't work with 'ui:widget': 'radio'
  // 'ui:enumDisabled': ['GIT_TO_HARNESS', 'BOTH']
  syncMode: { 'ui:widget': 'radio' }
}
const widgets = {}

class SetupAsCodeGitSyncModal extends React.Component {
  state = {
    schema: null,
    uiSchema: null
  }
  isRootNode = false

  componentWillMount = async () => {
    if (Utils.isYamlEnabled(this.props.urlParams.accountId)) {
      if (baseSchema.properties.syncMode.enum.indexOf('BOTH') < 0) {
        baseSchema.properties.syncMode.enum.push('BOTH')
        baseSchema.properties.syncMode.enumNames.push('Both direction: Harness <-> Git')
      }
    }
    const formData = WingsDynamicForm.toFormData({ data: this.props.data }) || {} // API-data to formData (for Edit)
    await CompUtils.setComponentState(this, {
      schema: baseSchema,
      uiSchema: baseUiSchema,
      formData: formData
    })
  }

  onInitializeForm = async form => {
    const { formData } = this.form.buffer

    const node = this.props.selectedNode
    const path = Utils.getJsonValue(node, 'directoryPath.path') || ''
    this.isRootNode = node && node.type === 'folder' && path === 'setup'
    formData.enabled = true
    console.log('modal - node: ', node)
    console.log('modal - formData: ', formData)
    if (node.syncMode === 'BOTH') {
      // show Webhook URL
      let url = `${baseUrl}/setup-as-code/yaml/webhook/${formData.webhookToken}`
      url += `?accountId=${this.props.urlParams.accountId}`
      this.form.showFields(['webhookUrl'])
      formData.webhookUrl = url
    }
    await this.form.updateChanges({ formData })
  }

  onChange = async ({ formData }) => {
    if (this.form.isFieldChanged('syncMode')) {
      if (formData.syncMode === 'HARNESS_TO_GIT') {
        this.form.hideFields(['webhookUrl'])
      } else {
        this.form.showFields(['webhookUrl'])
        const { webhookToken } = await SetupAsCodeService.fetchWebhookToken({
          accountId: this.props.urlParams.accountId,
          entityId: Utils.getJsonValue(this, 'props.selectedNode.directoryPath.path')
        })
        formData.webhookToken = webhookToken
      }
    }
    await this.form.updateChanges({ formData })
  }

  onSubmit = async ({ formData }) => {
    this.setState({ submitting: true })
    delete formData.webhookUrl
    console.log('onSubmit: ', formData)
    console.log(this.props)
    console.log(this.props.onSubmit)
    await this.props.onSubmit({ formData })
    this.setState({ submitting: false })
  }

  onHide = () => {
    this.setState({ submitting: false })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={true} onHide={this.onHide} className={css.main} submitting={this.state.submitting}>
        <Modal.Header closeButton>
          <Modal.Title>Git Sync</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Setup Git Sync"
            ref={f => (this.form = f)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onInitializeForm={this.onInitializeForm}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            widgets={widgets}
            dataStore={this.props.dataStore}
          >
            <UIButton type="submit" disabled={this.state.submitting}>
              SUBMIT
            </UIButton>
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default SetupAsCodeGitSyncModal



// WEBPACK FOOTER //
// ../src/containers/SetupAsCode/SetupAsCodeGitSyncModal.js