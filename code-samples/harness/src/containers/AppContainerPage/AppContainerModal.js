import React from 'react'
import { observer } from 'mobx-react'
import ReactDOM from 'react-dom'
import { Modal } from 'react-bootstrap'
import { WingsModal, WingsForm, Utils, AppStorage } from 'components'
// import Form from 'react-jsonschema-form'
import css from './AppContainerModal.css'
import apis from 'apis/apis'
import pubsub from 'pubsub-js'

const schema = {
  type: 'object',
  required: ['name', 'file'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    version: { type: 'string', title: 'Version', default: '' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description', default: '' },
    family: { type: 'string', title: 'Family' },
    sourceType: { type: 'object', title: '', required: [ 'sourceTypeProp' ],
      properties: {
        sourceTypeProp: {
          type: 'string',
          title: 'Source Type',
          default: 'FILE_UPLOAD',
          enum: [ 'FILE_UPLOAD' ], // enum: [ 'FILE_UPLOAD', 'HTTP' ],
          enumNames: ['File Upload' ] // enumNames: ['File Upload', 'Http']
        }
      }
    },
    file: { type: 'string', title: 'App Stack Archive File' },

    md5: { type: 'string', title: 'MD5 (checksum)', default: '' }
  }
}

const FileWidget = (props) => {
  return (
    <input type="file" id="root_file"
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  )
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  version: { 'ui:placeholder': 'Version' },
  name: { 'ui:placeholder': 'Application Stack Name' },
  description: { 'ui:placeholder': 'Description' },
  sourceType: { classNames: 'wings-radio-list', sourceTypeProp: { 'ui:widget': 'hidden' } },
  file: { 'ui:widget': FileWidget },
  md5: { classNames: 'wings-short-input', 'ui:placeholder': 'to ensure data integrity of the file uploaded' }
}

const log = (type) => {} // console.log.bind(console, type)

@observer
class AppContainerModal extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  pubsubToken = null
  state = {
    formSubmitted: false,
    initialized: false
  }
  acctId = AppStorage.get('acctId')
  formData = {}

  componentWillMount () {
    if (this.context.catalogs) {
      this.updateCatalogs(this.context.catalogs)
    } else {
      this.pubsubToken = this.context.pubsub.subscribe('appsEvent', (msg, appData) => {
        this.updateCatalogs(appData.catalogs)
      })
    }
  }

  componentWillReceiveProps (newProps) {
    this.formData = {}
    if (newProps.show && !this.state.initialized) {
      if (newProps.data) {
        this.formData = this.preprocessData(newProps.data)
      }
      this.setState({ formSubmitted: false, initialized: true })
    } else {

    }
  }

  componentWillUnmount () {
    this.context.pubsub.unsubscribe(this.pubsubToken)
  }

  onHide = () => {
    this.setState({ formSubmitted: false, initialized: false })
    this.props.onHide()
  }

  updateCatalogs (catalogs) {
    if (catalogs) {
      const objFamily = {}
      catalogs.CONTAINER_FAMILY.map((containerFamily) => {
        if (containerFamily.name !== null) {
          objFamily[containerFamily.value] = containerFamily.displayText
        }
      })
      const firstFamily = Object.keys(objFamily)[0]
      delete schema.properties['family']
      schema.properties = {
        family: {
          type: 'string',
          enum: Object.keys(objFamily),
          enumNames: Object.keys(objFamily).map((k) => objFamily[k]),
          title: 'Family',
          default: firstFamily
        },
        ...schema.properties
      }
    }
  }

  onChange = ( { formData }) => {
    this.formData = formData
  }

  onSubmit = ({ formData }) => {
    const handleResp = (resp) => {
      if ( !resp.ok ) {
        return resp.json().then(Promise.reject.bind(Promise))
      } else {
        return resp.json()
      }
    }
    console.log('submitting the app stack')
    const submitData = Utils.clone(formData)
    const isEditing = (this.props.data ? true : false)
    const el = ReactDOM.findDOMNode(this.refs.form)
    submitData.standard = 'true'
    submitData.file = el.querySelector('input[type="file"]').files[0]
    submitData.sourceType = submitData.sourceType.sourceTypeProp
    this.setState({ formSubmitted: true })
    // this.props.onSubmit(submitData, isEditing)

    const data = new FormData()
    data.append('family', submitData.family)
    data.append('standard', submitData.standard)
    data.append('name', submitData.name)
    data.append('description', submitData.description)
    data.append('sourceType', submitData.sourceType)
    data.append('file', submitData.file)
    data.append('version', submitData.version)

    const methodType = (isEditing) ? 'PUT' : 'POST'

    Utils.request(this,
      apis.service.fetch(apis.getAppContainersEndpoint(this.acctId, data.uuid), {
        method: methodType,
        body: data
      })).then(res => handleResp(res))
      .then((res) => {
        if (res.resource ) {
          this.props.onSubmit(res.resource)
          this.onHide()
          // this.props.onHide()
        }
      })
      .catch((err) => {
        this.getErrorResponse(err, 'error')
      })
  }

  getErrorResponse = (error, type ) => {
    const messages = Utils.buildErrorMessage(error, type)
    Utils.publishErrorNotification(pubsub, messages, type)
    this.setState({ error: true, formSubmitted: false })
  }
  preprocessData (data) {
    if (data) {
      const _data = Utils.clone(data)
      if (!_data.family && schema.properties.family.default) {
        _data.family = schema.properties.family.default
      }
      return _data
    }
    return data
  }

  renderButton () {
    if (this.state.formSubmitted) {
      return (
        <div className={css.main + ' ' + 'buttonBar'}>
          <button type="submit" disabled className="btn btn-info disabled">
            SUBMITTING...
          </button>
          <span className="wings-spinner" />
        </div>
      )
    }

    return (
      <div className={css.main + ' ' + 'buttonBar'}>
        <button type="submit" className="btn btn-info">Submit</button>
      </div>
    )
  }

  render () {
    return (
      <WingsModal show={this.props.show} className={css.main} onHide={this.onHide} data-name="newAppStackModal">
        <Modal.Header closeButton>
          <Modal.Title>Application Stack</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <WingsForm name="Application Stack" ref="form" schema={schema} uiSchema={uiSchema}
            formData={this.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')} >
            {this.renderButton()}
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default AppContainerModal



// WEBPACK FOOTER //
// ../src/containers/AppContainerPage/AppContainerModal.js