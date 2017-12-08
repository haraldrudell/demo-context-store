import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { WingsModal, WingsDynamicForm, CompUtils, FormUtils, SearchableSelect, NestedFormTemplate } from 'components'
import { AWSLambdaSpecService } from 'services'
import css from './AWSLambdaFunctionSpec.css'

const runTimeEnums = ['nodejs4.3', 'nodejs4.3-edge', 'nodejs6.10', 'python3.6', 'python2.7', 'java8', 'dotnetcore1.0']

const fieldOrder = ['defaults', 'functions']

const defaultFunctionValue = '${app.name}_${service.name}_${env.name} <function-name>'

const defaultFormData = {
  defaults: {
    runtime: 'nodejs6.10',
    memorySize: '128',
    timeout: '3'
  },
  functions: [
    {
      functionName: `${defaultFunctionValue}`,
      memorySize: '128',
      runtime: 'nodejs6.10',
      timeout: '3'
    }
  ]
}

const uiFields = ['defaults', 'functions']

const baseSchema = {
  type: 'object',
  addExpand: false,
  properties: {
    defaults: {
      type: 'object',
      title: 'Defaults',
      required: ['runtime', 'memorySize', 'timeout'],
      addExpand: false,
      properties: {
        runtime: {
          type: 'string',
          title: 'Runtime',
          enum: [],
          enumNames: [],
          'custom:ordering': true,
          default: 'nodejs6.10'
        },
        memorySize: {
          type: 'string',
          title: 'Memory Size',
          enum: [],
          enumNames: [],
          'custom:ordering': true,
          default: '128'
        },
        timeout: {
          type: 'string',
          title: 'Execution TimeOut',
          default: '3'
        }
      }
    },
    functions: {
      type: 'array',
      title: 'Functions',
      addExpand: true,
      defaultChecked: false,
      items: {
        type: 'object',
        addExpand: true,
        defaultChecked: false,
        required: ['functionName', 'handler', 'memorySize', 'timeout'],
        properties: {
          functionName: {
            type: 'string',
            title: 'Function Name',
            default: defaultFunctionValue
          },
          handler: {
            type: 'string',
            title: 'Handler'
          },
          memorySize: {
            type: 'string',
            title: 'Memory Size',
            enum: [],
            enumNames: [],
            'custom:ordering': true,
            default: '128'
          },
          timeout: {
            type: 'string',
            title: 'Execution TimeOut',
            default: '3'
          }
        }
      }
    }
  }
}

const baseUiSchema = {
  defaults: {
    runtime: {
      'ui:widget': 'SearchableSelect',
      classNames: css.tableCell,
      'ui:placeholder': 'Select RunTime'
    },

    memorySize: {
      'ui:widget': 'SearchableSelect',
      classNames: `${css.tableCell} ${css.paddingLeft}`,
      'ui:placeholder': ''
    },

    timeout: {
      classNames: `${css.tableCell} ${css.paddingLeft}`
    }
  },
  functions: {
    classNames: '__functionspecs-array',
    items: {
      memorySize: {
        'ui:widget': 'SearchableSelect',
        classNames: `${css.functionMemCell} `,
        'ui:placeholder': ''
      },
      timeout: {
        classNames: `${css.funcSpecTimeCell} ${css.paddingLeft}`
      }
    }
  },
  'ui:order': ['defaults', 'functions']
}

const widgets = {
  SearchableSelect
}

class AWSLambdaFunctionSpec extends React.Component {
  state = {
    widgets,
    schema: {},
    uiSchema: {},
    formData: {},
    error: false
  }

  form
  isEditing = false

  async componentWillMount () {
    if (this.props.show) {
      await this.init(this.props)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.init(newProps)
    }
  }

  modifyFormData = formData => {
    this.isEditing = true
    if (!formData.functions) {
      formData.functions = defaultFormData.functions
    }

    formData.defaults.memorySize = formData.defaults.memorySize.toString()
    formData.defaults.timeout = formData.defaults.timeout.toString()
    this.modifyMemorySizeOnEditData(formData)
  }

  modifyMemorySizeOnEditData = formData => {
    const functions = formData.functions
    for (const item of functions) {
      item.memorySize = item.memorySize.toString()
      item.timeout = item.timeout.toString()
    }
  }
  init = async props => {
    const formData = defaultFormData // API-data to formData (for Edit)

    /* if (this.props.data) {
      formData = this.props.data
      this.modifyFormData(this.props.data)
    }*/

    this.fillRunTimeEnums()
    this.updateMemorySizeOnSchema()

    await CompUtils.setComponentState(this, {
      initialized: true,
      fieldOrder: fieldOrder,
      schema: baseSchema,
      uiSchema: baseUiSchema,
      formData
    })
  }

  /*
   TODO -> Findout how to fill enum names
   I was trying to do on intializeform but was not filling
   */
  fillRunTimeEnums = () => {
    const defaultRuntimeProperty = baseSchema.properties.defaults.properties.runtime
    // const functionSpecsRunTimeProperty = baseSchema.properties.functionSpecs.items.properties.runtime

    FormUtils.fillEnumAndNamesWithSimpleArray(defaultRuntimeProperty, [], runTimeEnums, runTimeEnums)
    // FormUtils.fillEnumAndNamesWithSimpleArray(functionSpecsRunTimeProperty, [], runTimeEnums, runTimeEnums)
  }

  updateMemorySizeOnSchema = () => {
    const memoryEnums = this.fetchMemorySizeEnums()
    const memoryEnumNames = this.fetchMemorySizeEnumNames()

    const defaultSpecMemoryProperty = baseSchema.properties.defaults.properties.memorySize
    const functionSpecMemoryProperty = baseSchema.properties.functions.items.properties.memorySize

    FormUtils.fillEnumAndNamesWithSimpleArray(defaultSpecMemoryProperty, [], memoryEnums, memoryEnumNames)
    FormUtils.fillEnumAndNamesWithSimpleArray(functionSpecMemoryProperty, [], memoryEnums, memoryEnumNames)
  }

  fetchMemorySizeEnums = () => {
    const numbers = Array.from({ length: 47 }, (v, k) => k + 1)
    const modifiedArr = numbers.splice(1, 46)
    const supportedMemSizes = modifiedArr.map(size => size * 64)

    const sortedMemSizes = supportedMemSizes.sort(function (a, b) {
      return a - b
    })

    return sortedMemSizes.map(size => size.toString())
  }

  fetchMemorySizeEnumNames = () => {
    const numbers = Array.from({ length: 47 }, (v, k) => k + 1)
    const modifiedArr = numbers.splice(1, 46)
    const supportedMemSizes = modifiedArr.map(size => size * 64)

    const sortedMemSizes = supportedMemSizes.sort(function (a, b) {
      return a - b
    })

    return sortedMemSizes.map(size => `${size}MB`)
  }

  onInitializeForm = async form => {
    /* form.setEnumAndNamesWithArray('runtime', runTimeEnums)
    const memorySizeEnums = this.fetchMemorySize()
    form.setEnumAndNames('memorySize', memorySizeEnums)*/
    const { serviceId, appIdFromUrl } = this.props
    await form.setFormState({ loading: true })

    const { specs } = await AWSLambdaSpecService.getLambdaSpecs({ serviceId, appId: appIdFromUrl })

    await form.autoProcessInitialize(fieldOrder)
    if (specs) {
      const formData = specs

      this.modifyFormData(formData)
      form.buffer.formData = formData

      await form.updateChanges()
    }
  }

  onChange = async ({ formData }) => {
    // TODO Why setstate is not working when formData for functins is updated
    // this.onAddFunctions({ formData })
    /*  const savedData = FormUtils.clone(this.state.formData)
    this.form.buffer.formData = formData
    const currentMemorySize = formData.defaults.memorySize
    const currentTimeout = formData.defaults.timeout

    if (savedData.defaults.memorySize !== currentMemorySize || savedData.defaults.timeout !== currentTimeout) {
      this.modifyFunctionSpecsWithDefaults(formData)
    }

    const newFormData = Object.assign({}, formData)
    await this.setState({ formData: newFormData })
    console.log(this.state.formData, 'formData')*/
    // await form.updateChanges({ formData })
    const form = this.form
    form.buffer.formData = formData
    await form.updateChanges({ formData })
  }

  modifyFunctionSpecsWithDefaults = formData => {
    if (formData.functions) {
      const functionList = formData.functions

      for (const fn of functionList) {
        fn.memorySize = formData.defaults.memorySize
        fn.timeout = formData.defaults.timeout
      }
    }
  }

  onAddFunctions = ({ formData }) => {
    const prevData = this.form.base.formData
    const functionList = formData.functions
    const prevFuncList = prevData.functions

    if (functionList) {
      if (!prevFuncList || functionList.length !== prevFuncList.length) {
        return this.addIndexToFunctionName(functionList, formData)
      }
    }
  }

  addIndexToFunctionName = (functionList, formData) => {
    let index = 0

    for (const item of functionList) {
      item.functionName = `${defaultFunctionValue}_${index}`
      index++
    }
    formData.functions = functionList
  }

  isFormValid = formData => {
    if (!formData.functions || formData.functions.length === 0) {
      this.errorMessage = 'Should have at least one function to continue'

      return false
    }

    const funcList = formData.functions

    const funcNames = funcList.map(fn => fn.functionName)

    const uniqueFuncArray = [...new Set(funcNames)]

    if (uniqueFuncArray.length !== funcNames.length) {
      this.errorMessage = 'Function Names should be unique'

      return false
    }
    return true
  }

  onSubmit = async ({ formData }) => {
    const appId = this.props.appIdFromUrl
    const serviceId = this.props.serviceId

    if (this.isFormValid(formData)) {
      if (!this.isEditing) {
        this.addRunTimeToFunctionList(formData)

        await this.createSpec({ serviceId, appId, formData })
      } else {
        this.addRunTimeToFunctionList(formData)
        const specId = formData.uuid

        await this.editSpec({ serviceId, specId, appId, formData })
      }
    } else {
      this.setState({ error: true })

      this.errorClass = css.error
    }
  }

  addRunTimeToFunctionList = formData => {
    if (formData.functions) {
      const functionList = formData.functions
      for (const item of functionList) {
        item['runtime'] = formData.defaults.runtime
      }
    }
  }

  createSpec = async ({ serviceId, appId, formData }) => {
    const { error } = await AWSLambdaSpecService.createSpec({ serviceId, appId, body: formData })

    if (error) {
      this.setState({ error: true })
      return
    }
    this.onHide()
  }

  editSpec = async ({ serviceId, specId, appId, formData }) => {
    const editData = this.getEditData(formData)

    const { error } = await AWSLambdaSpecService.editLambdaSpecs({
      serviceId,
      specId,
      appId,
      body: editData
    })

    if (error) {
      this.setState({ error: true })
      return
    }
    this.onHide()
  }

  getEditData = formData => {
    const copiedData = FormUtils.clone(formData)

    Object.keys(copiedData).map(key => {
      if (!uiFields.includes(key)) {
        delete copiedData[key]
      }
    })
    return copiedData
  }

  onHide = () => {
    this.errorClass = ''
    this.errorMessage = ''
    this.props.onHide()
  }

  render () {
    // FieldTemplate = { NestedFormTemplate }
    return (
      <WingsModal show={this.props.show} onHide={this.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Aws Lambda Function Specifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            {...this.props}
            name="Aws Lambda Function Spec"
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
          >
            <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
              SUBMIT
            </Button>
            {this.state.error && <span className={this.errorClass}>{this.errorMessage}</span>}
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default AWSLambdaFunctionSpec



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/AWSLambdaFunctionSpec.js