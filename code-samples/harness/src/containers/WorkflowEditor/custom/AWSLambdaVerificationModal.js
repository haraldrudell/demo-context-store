import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsDynamicForm, WingsModal, InlineEditableText, CompUtils, FormUtils, NestedFormTemplate } from 'components'
import { AWSLambdaSpecService } from 'services'
import css from './AWSLambdaVerificationModal.css'

const baseSchema = {
  type: 'object',
  properties: {}
}

export default class AWSLambdaVerificationModal extends React.Component {
  state = {
    schema: baseSchema,
    uiSchema: {},
    formData: {}
  }
  initialized = false
  async componentWillMount () {
    if (this.props.show && !this.initialized) {
      this.initialized = true
      await this.init(this.props)
    }
  }

  async componentWillReceiveProps (newProps) {
    if (newProps.show && !this.initialized) {
      this.initialized = true
      await this.init(newProps)
    }
  }

  init = async props => {
    const { serviceId, appId } = props
    let formData = {}
    const { specs, error } = await AWSLambdaSpecService.getLambdaSpecs({ serviceId, appId })
    if (error) {
      return
    }

    formData = this.convertFormData(props)

    const { functions } = specs

    this.functionList = functions

    const { schema, uiSchema } = this.createSchemaWithFunctionList(functions)

    await CompUtils.setComponentState(this, {
      initialized: true,
      fieldOrder: [],
      schema,
      uiSchema,
      formData
    })
  }

  convertFormData = props => {
    const data = {}
    if (props.data) {
      const { nodeData } = props.data
      const { properties } = nodeData

      if (properties) {
        const { lambdaTestEvents } = properties
        if (lambdaTestEvents && lambdaTestEvents.length > 0) {
          for (const event of lambdaTestEvents) {
            const functionName = event.functionName

            data[functionName] = event
            this.addAssertionOrPayload(data)
          }
        }
      }
    }
    return data
  }

  addAssertionOrPayload = data => {
    if (!data.assertion) {
      data.assertion = ''
    }
    if (!data.payload) {
      data.payload = ''
    }
  }

  onInitializeForm = async form => {
    await form.autoProcessInitialize()

    await form.updateChanges()
  }

  createSchemaWithFunctionList = functionList => {
    const schema = {
      type: 'object',
      title: 'Configure Test Events',
      properties: {}
    }

    const uiSchema = {
      classNames: css.mainTitle
    }

    if (functionList.length > 0) {
      for (const fn of functionList) {
        const { functionName } = fn
        schema['properties'][functionName] = {
          type: 'object',
          title: functionName,
          addExpand: true,
          defaultChecked: false,
          properties: {
            functionName: { type: 'string', default: functionName, title: '' },
            payload: { type: 'string', title: 'Payload' },
            assertion: { type: 'string', title: 'Assertion' }
          }
        }
        uiSchema[functionName] = {}
        uiSchema[functionName]['functionName'] = { 'ui:widget': 'hidden' }
        uiSchema[functionName]['payload'] = { 'ui:widget': 'textarea', classNames: css.textArea }
        uiSchema[functionName]['assertion'] = { 'ui:widget': 'textarea' }
        /*   uiSchema[functionName]['enable'] = {}
        uiSchema[functionName]['enable']['classNames'] = css.disableTest*/
      }
    }
    return { schema, uiSchema }
  }

  onHide = async () => {
    await CompUtils.setComponentState(this, { initialized: false, formData: {} })
    this.props.onHide()
    this.initialized = false
  }

  modifyFormData = ({ formData }) => {
    const resultObj = {}
    resultObj['lambdaTestEvents'] = []

    const functionList = this.functionList
    if (functionList && functionList.length > 0) {
      for (const fn of functionList) {
        const data = {}
        const { functionName } = fn
        const funcData = formData[functionName]
        if (funcData.assertion || funcData.payload) {
          data['functionName'] = functionName
          //  data['enable'] = funcData.enable ? funcData.enable : false
          data['assertion'] = funcData.assertion
          data['payload'] = funcData.payload
          resultObj.lambdaTestEvents.push(data)
        }
      }
    }
    return resultObj
  }

  onSubmit = ({ formData }) => {
    const propsData = FormUtils.clone(this.props.data)

    const data = this.modifyFormData({ formData })
    Object.assign(propsData, data)

    this.props.onSubmit({ formData: propsData })
    this.initialized = false
  }

  render () {
    //    FieldTemplate={NestedFormTemplate}
    return (
      <WingsModal show={this.props.show} onHide={this.onHide} className={css.main}>
        <Modal.Header closeButton>
          <InlineEditableText onChange={this.props.onTitleChange}>
            {this.props.title}
          </InlineEditableText>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            {...this.props}
            name="Aws Lambda Verification Step"
            ref={f => (this.form = f)}
            onInitializeForm={this.onInitializeForm}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            widgets={this.state.widgets}
            showErrorList={false}
            noValidate={true}
            FieldTemplate={NestedFormTemplate}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/AWSLambdaVerificationModal.js