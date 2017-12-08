import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { WingsForm, Utils, TargetEnvsFormWidget, ManageVersionsModal } from 'components'
import css from './CommandModal.css'

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    name: { type: 'string', title: 'Name' },
    command: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
        commandUnitType: { type: 'string', title: 'Command Unit', default: 'COMMAND' },
        commandType: { type: 'string', title: 'Command Type' }
      }
    },
    commandType: {
      type: 'string', title: 'Command Type', default: 'OTHER',
      enum: ['START', 'STOP', 'INSTALL', 'ENABLE', 'DISABLE', 'VERIFY', 'RESIZE', 'OTHER'],
      enumNames: ['Start', 'Stop', 'Install', 'Enable', 'Disable', 'Verify', 'Resize', 'Other']
    },
    targetToAllEnv: { type: 'boolean', title: '  ', default: true },
    envIdVersionMap: { type: 'object', title: '  ', properties: {}, default: {} }
  }
}

const log = (type) => {} // console.log.bind(console, type)


export default class CommandModal extends React.Component {
  state = { schema, data: {}, showManageVersions: false }

  targetEnvWidget = (props) => {
    return (
      <TargetEnvsFormWidget params={props} onShowTargetModal={this.onShowTargetModal.bind(this)} />
    )
  }

  uiSchema = {
    uuid: { 'ui:widget': 'hidden' },
    name: { 'ui:placeholder': 'Command Name' },
    command: { classNames: '__objCommand' },
    targetToAllEnv: { 'ui:widget': this.targetEnvWidget, classNames: '__targetToAllEnvs' },
    envIdVersionMap: { classNames: '__envIdVersionMap' }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.setState({ data: newProps.data })
    }
  }

  onShowTargetModal = () => {
    this.setState({ showManageVersions: true })
  }

  onUpdateEnvIdVersionMap = (data) => {
    data.targetToAllEnv = false
    this.setState({ showManageVersions: false, data })
  }


  onSubmit = ({ formData }) => {
    formData.command.name = formData.name
    formData.command.commandType = formData.commandType
    delete formData.commandType
    this.props.onSubmit(formData)
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Command</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Command"
            ref="form"
            schema={schema}
            uiSchema={this.uiSchema}
            formData={this.state.data}
            onChange={log('changed')}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          >
            <Button bsStyle="default" type="submit" className="submit-button">
              SUBMIT
            </Button>
          </WingsForm>
        </Modal.Body>
        <ManageVersionsModal
          show={this.state.showManageVersions}
          data={this.state.data}
          environments={this.props.environments}
          showVersion={false}
          modalTitle={'Command'}
          onSubmit={this.onUpdateEnvIdVersionMap}
          onHide={Utils.hideModal.bind(this, 'showManageVersions')}
        />
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/CommandPage/CommandModal.js