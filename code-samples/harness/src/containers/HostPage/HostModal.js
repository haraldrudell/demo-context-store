import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsForm, Utils, FormFieldTemplate } from 'components'
// import Form from 'react-jsonschema-form'
import css from './HostModal.css'

const schema = {
  type: 'object',
  required: [], // will be set later
  properties: {
    hostNamesText: { type: 'string', title: 'Host Name(s)', default: '' }, // will be set later
    uuid: { type: 'string', title: 'uuid', default: '' },
    hostConnAttrUuid: { type: 'string', title: 'Connection Type', enum: [] },
    bastionConnAttrUuid: { type: 'string', title: 'Bastion Connection', enum: [] },
    configTagUuid: { type: 'string', title: 'Host Tags', enum: [] },
    serviceTemplates: {
      type: 'array',
      title: 'Service Mapping',
      uniqueItems: true,
      items: { type: 'string', enum: [] }
    }
  }
}
const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  hostNamesText: { 'ui:help': 'Hostname or IP address' },
  hostConnAttrUuid: { 'ui:help': 'Connection Type that should be used to connect to the host(s)' },
  serviceTemplates: { 'ui:widget': 'checkboxes', 'ui:help': 'The Services that the hosts support.' }
}
const log = type => {} // console.log.bind(console, type)

export default class HostModal extends React.Component {
  static contextTypes = {
    catalogs: React.PropTypes.object // isRequired
  }
  state = { data: {}, schema, uiSchema }

  updateSchema = (connAttrs, configTag, serviceTemplates, isEditing) => {
    if (isEditing) {
      delete schema.properties['hostNamesText']
      schema.required = ['hostName']
      schema.properties = {
        hostName: { type: 'string', title: 'Name' },
        ...schema.properties
      }
      delete uiSchema['hostNamesText']
    } else {
      // Creating a New Host: use textarea for hostNamesText
      delete schema.properties['hostName']
      schema.required = ['hostNamesText']
      schema.properties = {
        hostNamesText: { type: 'string', title: 'Name(s)' },
        ...schema.properties
      }
      uiSchema['hostNamesText'] = {
        'ui:widget': 'textarea',
        'ui:placeholder': 'hostname1\nhostname2',
        ...uiSchema['hostNamesText']
      }
    }
    if (connAttrs) {
      schema.properties.hostConnAttrUuid.enum = connAttrs.map(item => item.uuid)
      schema.properties.hostConnAttrUuid.enumNames = connAttrs.map(item => item.name)
      // schema.properties.bastionConnAttrUuid.enum = ['']
      // schema.properties.bastionConnAttrUuid.enumNames = ['']
    }
    if (configTag) {
      schema.properties.configTagUuid.enum = configTag.map(item => item.uuid)
      schema.properties.configTagUuid.enumNames = configTag.map(item => item.name)
    }
    if (serviceTemplates) {
      schema.properties.serviceTemplates.items.enum = serviceTemplates.map(item => item.uuid)
      schema.properties.serviceTemplates.items.enumNames = serviceTemplates.map(item => item.name)
    }
  }

  componentWillReceiveProps (newProps) {
    const isEditing = newProps.data ? true : false
    if (isEditing) {
      newProps.data.hostConnAttrUuid = Utils.getJsonValue(newProps, 'data.hostConnAttr.uuid')
      newProps.data.bastionConnAttrUuid = Utils.getJsonValue(newProps, 'data.bastionConnAttr.uuid')

      if (!newProps.data.bastionConnAttrUuid) {
        newProps.data.bastionConnAttrUuid = ''
        schema.properties.bastionConnAttrUuid.enum = ['']
        schema.properties.bastionConnAttrUuid.enumNames = ['']
      }
    }

    this.updateSchema(newProps.connAttrs, newProps.configTag, newProps.serviceTemplates, isEditing)
    this.presetData(newProps.data, newProps.configTag, newProps.serviceTemplates)
  }

  presetData = (data, configTag, appServices) => {
    const formData = data ? data : {}
    const _servs = []
    appServices.map(item => {
      _servs.push(item.uuid)
    })
    formData.serviceTemplates = _servs
    formData.configTag = configTag ? configTag : {}
    this.setState({ data: formData, schema, uiSchema })
  }

  onSubmit = ({ formData }) => {
    const isEditing = this.props.data ? true : false
    if (!isEditing) {
      // split by line-break or comma, remove blank items.
      formData['hostNames'] = formData.hostNamesText.split(/[\n|,]/).filter(o => o.length > 0)
    }
    formData['hostConnAttr'] = formData.hostConnAttrUuid
    formData['bastionConnAttr'] = formData.bastionConnAttrUuid
    formData['configTag'] = { uuid: formData.configTagUuid }
    formData['serviceTemplates'] = Utils.mapToUuidArray(formData.serviceTemplates)
    this.props.onSubmit(formData, isEditing)
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={`${css.main} __hostModal`}>
        <Modal.Header closeButton>
          <Modal.Title>Host</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Host"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            FieldTemplate={FormFieldTemplate}
            formData={this.state.data}
            onChange={log('changed')}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          />
        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/HostPage/HostModal.js