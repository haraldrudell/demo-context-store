import React from 'react'
import { observer } from 'mobx-react'
import { Button, Modal } from 'react-bootstrap'
import { FormUtils, WingsModal, WingsDynamicForm, CompUtils } from 'components'
import JsonPicker from './JsonPicker'

import { ElkService } from 'services'

const fieldOrder = ['analysisServerConfigId', 'indices', 'hostnameField']

const noIndices = 'no indices available'
@observer
class TestModal extends React.Component {
  widgets = {
    JsonPicker,
    customInput: props => {
      return (
        <input
          defaultValue={props.value}
          onChange={ev => this.onChangeOfCustomIndex(ev)}
          className="form-control"
          placeholder="please enter an index"
        />
      )
    }
  }

  state = {
    schema: {},
    uiSchema: {},
    formData: {},
    jsonString: {}
  }
  form

  async componentWillMount () {
    if (this.props.show) {
      await this.init(this.props)
    }
  }

  async componentWillReceiveProps (newProps) {
    if (newProps.show) {
      await this.init(newProps)
    }
  }

  fetchIndices = async ({ formData, formProps }) => {
    const serverConfigId = formData.analysisServerConfigId
    const { accountId } = this.props.urlParams
    const fetchKey1 = +new Date()
    this.fetchKey1 = fetchKey1

    const getIndexList = ElkService.getIndices({
      accountId,
      serverConfigId
    })
    const { indexList, error: indexListError } = await getIndexList

    if (this.fetchKey1 === fetchKey1) {
      if (indexListError) {
      } else if (indexList) {
        const arr = Object.keys(indexList).filter(key => !key.startsWith('.'))

        return {
          data: arr,
          transformedData:
            arr && arr.length > 0
              ? arr.map(j => ({ name: j, uuid: j }))
              : [{ name: 'No jobs are available', uuid: null }]
        }
      } else {
        return {
          data: noIndices,
          transformedData: []
        }
      }
    }
  }

  fetchSampleRecord = async ({ formData, formProps }) => {
    const index = formData.indices
    if (!index) {
      return
    }

    const serverConfigId = this.form.buffer.formData.analysisServerConfigId
    const { accountId } = this.props.urlParams
    const fetchKey2 = +new Date()
    this.fetchKey2 = fetchKey2

    const getSampleRecord = ElkService.getSampleRecord({
      accountId,
      serverConfigId,
      index
    })
    const { sampleRecord, error: sampleRecordError } = await getSampleRecord

    if (this.fetchKey2 === fetchKey2) {
      if (sampleRecordError) {
      } else {
        return {
          data: sampleRecord,
          transformedData: []
        }
      }
    }
  }

  init = async props => {
    const formData = WingsDynamicForm.toFormData({ data: props.data }) || {}
    const schema = FormUtils.clone(props.schema)
    const uiSchema = FormUtils.clone(props.uiSchema)

    schema.properties.indices = {
      'custom:dataProvider': 'fetchIndices',
      type: 'string',
      title: 'Indices',
      enum: [],
      enumNames: []
    }

    schema.properties.hostnameField = {
      'custom:dataProvider': 'fetchSampleRecord',
      type: 'string',
      title: 'Host Name Field'
    }

    schema.dataProviders = {
      fetchIndices: this.fetchIndices,
      fetchSampleRecord: this.fetchSampleRecord
    }

    schema.properties.hostnameField.jsonString = this.state.jsonString
    schema.properties.hostnameField.default = undefined
    schema.properties.timeDuration.description = ''
    schema.properties.timeDuration.title = 'Analysis Period (min)'

    uiSchema.hostnameField = {}
    uiSchema.hostnameField['ui:widget'] = 'JsonPicker'
    uiSchema.indices = {
      'ui:placeholder': 'Select Index',
      'custom:widget': 'customInput'
    }

    // TODO: only show this field after previous fields are fetched
    await CompUtils.setComponentState(this, {
      initialized: true,
      fieldOrder: fieldOrder,
      schema: schema,
      uiSchema: uiSchema,
      formData: formData,
      widgets: this.widgets
    })
  }

  onInitializeForm = async form => {
    await form.autoProcessInitialize(fieldOrder)

    const indicesProperty = this.form.buffer.schema.properties.indices
    const uiSchema = this.form.buffer.uiSchema
    this.modifyIndicesPropertySchema(indicesProperty, uiSchema)

    await this.form.updateChanges()
  }

  modifyIndicesPropertySchema = (indicesProp, uiSchema) => {
    const enumData = indicesProp.data
    if (enumData === noIndices || !(enumData.length > 0)) {
      uiSchema.indices = {
        'ui:widget': 'customInput',
        'custom:widget': 'customInput',
        'ui:placeholder': 'Please type Index'
      }
    } else {
      uiSchema.indices = {
        'ui:placeholder': 'Select Index',
        'custom:widget': 'customInput'
      }
    }
  }

  onChange = async ({ formData }) => {
    await this.form.autoProcessChange(fieldOrder)

    const indicesProperty = this.form.buffer.schema.properties.indices
    const uiSchema = this.form.buffer.uiSchema
    this.modifyIndicesPropertySchema(indicesProperty, uiSchema)

    await this.form.updateChanges()
  }

  onChangeOfCustomIndex = async ev => {
    const selValue = ev.currentTarget.value

    const form = this.form
    const formData = form.buffer.formData

    formData['indices'] = selValue
    await this.form.autoProcessChange(fieldOrder)

    await this.form.updateChanges()
  }

  onSubmit = async ({ formData }) => {
    this.setState({ submitting: true })
    this.props.onSubmit({ formData })
    this.onHide()
  }

  onHide = () => {
    this.setState({ submitting: false })
    this.initialized = false
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.onHide} submitting={this.state.submitting}>
        <Modal.Header closeButton>
          <Modal.Title>ELK</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            jsonString={this.state.jsonString}
            name="Elk"
            ref={f => (this.form = f)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onInitializeForm={this.onInitializeForm}
            onChange={this.onChange.bind(this)}
            onSubmit={this.onSubmit}
            widgets={this.state.widgets}
            noValidate={true}
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

export default TestModal



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/ElkVerificationModal.js