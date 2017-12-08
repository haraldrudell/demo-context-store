import React from 'react'
import Utils from '../Utils/Utils'
import TemplateUtils from '../Utils/TemplateUtils'
import css from './CustomFieldTemplate.css'
import WingsIcons from '../WingsIcons/WingsIcons'
const CANARYWORKFLOWTEMPLATEMSG = 'This will templatize the Service Infrastructure for each phase'
export default class CustomFieldTemplate extends React.Component {
  state = {
    isTemplate: false,
    currentLabel: null,
    templateMsgObj: null,
    workflowType: null
  }
  formData = {}
  templatizeFormData = {}
  hasSetOnTemplate = false

  componentWillMount () {
    const { schema, label } = this.props

    const templatizedField = schema.templatizedField
    const templateObj = {}
    const templateMsgObj = {}
    if (templatizedField && templatizedField.edit && templatizedField.expression) {
      templateObj[label] = true
      templateMsgObj[label] = {}
      templateMsgObj[label].className = css.hide
    } else {
      templateObj[label] = false
      templateMsgObj[label] = {}
      templateMsgObj[label].className = css.templateMsgObj
    }
    this.setState({ templateObj, templateMsgObj })
  }

  renderTemplateButtonForEditMode = () => {
    const { schema, children, label } = this.props
    const shouldHaveTemplateButton = this.canTemplatizeButton(schema, children.props.name)
    // const btnText = this.state.templateObj[label] ? 'Remove Templatize' : 'Templatize'
    const isTemplatized = this.state.templateObj[label]
    if (shouldHaveTemplateButton) {
      return this.renderIcons(isTemplatized)
    } else {
      return null
    }
  }
  /*
    Not Showing templatize options to the following
 */
  canTemplatizeButton = (schema, fieldName) => {
    const { children } = this.props
    const type = schema.type
    /*
      For child properties of type object
      like schema.properties.workflowVariables={type:object},array boolen and integer
      should not have templatize option
    */
    if (type === 'object' || type === 'array' || type === 'boolean' || type === 'integer') {
      return false
    } else if (schema.templatize !== undefined && !schema.templatize) {
      /*
        even if type is of string ,customizing few properties
        should not have templatize option.properties like
        workflowtype on newworkflowmodal
       */
      return false
    } else if (children.props.name === 'timeDuration') {
      /* TODO=> Fix this to add notemplatize option and should be true for the prvious case */
      return false
    } else {
      return true
    }
  }

  getValue = label => {
    return this.templatizeFormData[label]
  }
  /*
    Check if the enetered input text is present
    in the existing uservariables
  */
  onChangeOfTemplateField = e => {
    const { children, label } = this.props
    const name = children.props.name
    const templateMsgObj = Utils.clone(this.state.templateMsgObj)
    this.templatizeFormData[label] = e.target.value
    const currentValueWithoutSplCharecters = Utils.stripOffSpecialCharecters(e.target.value)
    const userVariableIdx = this.checkIfExistsInUserVariable(currentValueWithoutSplCharecters)

    templateMsgObj[label].className = userVariableIdx === -1 ? css.templateMessage : css.hide

    this.setState({
      templatizedFormData: this.templatizeFormData,
      templateMsgObj
    })
    children.props.schema['templatizedField'] = {
      fieldName: name,
      expression: e.target.value,
      edit: true
    }
  }
  /*
    Logic for default template value input field gets
    when templatize option is clicked
    For Env->when templatized=> ${Environment_{selectedenvname}}
    For Service->when templatized->${Service_{selectedServiceName}}
    For InfraMapping=> templatized=>${Service_${selectedServiceName}_${within brances of inframapping display name}}
    For these we are customizing schema to have defaulttemplatefieldvalue
    other wise taking the current formdata (for dropdown we need enunname)
  */
  getFieldValue = (schema, formData, label) => {
    const LOADING_TEXT = 'Loading...'
    let originalValue
    let includeLabel = false
    if (schema.templatizedField && schema.templatizedField.edit && schema.templatizedField.expression) {
      originalValue = schema.templatizedField.expression
      includeLabel = false
    } else if (schema.enum && schema.enumNames) {
      const enmIdx = schema.enum.findIndex(optn => optn === formData)
      if (label === 'Workflow Type') {
        originalValue = formData
      } else {
        originalValue = schema.enumNames[enmIdx] !== LOADING_TEXT ? schema.enumNames[enmIdx] : ''
      }
      includeLabel = true
    } else {
      originalValue = formData
      includeLabel = true
    }
    if (schema.defaultTemplateFieldValue) {
      /* When default template field value is available ignore rest and take that as default value */
      // originalValue = this.replaceString(originalValue)
      label = schema.defaultTemplateFieldValue
      return { finalResult: `\$\{${label}}` }
    }

    if (includeLabel) {
      const finalResult = originalValue ? `\$\{${label}_${originalValue}}` : `\$\{${label}}`
      return {
        value: originalValue,
        label,
        finalResult
      }
    }
    return {
      value: originalValue,
      label,
      finalResult: originalValue
    }
  }
  /* to check if it exists in uservariables */
  checkIfExistsInUserVariable = value => {
    const { schema } = this.props
    const { userVariables } = schema
    return userVariables.findIndex(userVariable => userVariable.name === value)
  }

  onTemplateClick = () => {
    const { label, schema, children } = this.props
    const workflowType = schema['workflowType']
    const title = schema.title
    const templateObj = Utils.clone(this.state.templateObj)
    const templateMsgObj = Utils.clone(this.state.templateMsgObj)
    const modifiedVal = templateObj[label] ? false : true
    const templatizedField = schema.templatizedField
    const fieldName = children.props.name

    if (!modifiedVal) {
      delete schema.templatizedField
    } else if (!templatizedField) {
      schema['templatizedField'] = {
        fieldName,
        expression: this.templatizeFormData[label],
        edit: true
      }
    } else {
      /* Check the entered input text is present in uservariables */
      const userVariableIdx = this.checkIfExistsInUserVariable(this.templatizeFormData[label])
      templateMsgObj[label].className = userVariableIdx === -1 ? css.templateMessage : css.hide
      templateMsgObj[label].message =
        workflowType === 'CANARY' && title === TemplateUtils.entityTypeTitles.ENVIRONMENT
          ? CANARYWORKFLOWTEMPLATEMSG
          : ''
      schema.templatizedField['expression'] = this.templatizeFormData[label]
    }
    templateObj[label] = modifiedVal

    this.setState({ templateObj, currentLabel: label, templateMsgObj })
  }

  getWorkflowVariablesIndex = label => {
    const value = this.templatizeFormData[label]
    return this.userVariables.findIndex(variable => variable.name === value)
  }

  renderMessage = label => {
    const value = TemplateUtils.stripOffSpecialCharecters(this.templatizeFormData[label])
    if (this.state.templateMsgObj && value) {
      return (
        <div className={this.state.templateMsgObj[label].className}>
          <div>This creates a new workflow variable {this.templatizeFormData[label]}.</div>
          <div>{this.state.templateMsgObj[label].message}</div>
        </div>
      )
    } else {
      return null
    }
  }

  renderChildren = () => {
    const { label, children, schema } = this.props
    const templateObj = Utils.clone(this.state.templateObj)
    const isTemplate = templateObj[label] !== undefined ? templateObj[label] : false
    const currentLabel = Utils.clone(this.state.currentLabel)
    const type = schema.type
    const formData = children.props.formData

    /*
      When clicks on templatize button
      dropdown or whatever child controls that has been rendered
      would be replaced with input element
    */
    if (isTemplate) {
      this.templatizeFormData[label] = this.templatizeFormData[label] || schema.templatizedField.expression
      return (
        <div>
          <input
            type="text"
            className="form-control"
            onChange={this.onChangeOfTemplateField}
            value={this.templatizeFormData[label]}
          />
          {this.renderMessage(label, this.props.name)}
        </div>
      )
    } else if (!isTemplate || (currentLabel !== label && type !== 'array')) {
      /*
      Test comments
      This if condition has to be executed when it is nottemplate for the current label
        or when label is not equal to currentLabel and is of type array
       If not clicked on templatized option, for all others apart from schema properties which
        are type of array would be replaced with regular children
       */
      const result = this.getFieldValue(schema, formData, label)

      this.templatizeFormData[label] = !this.templatizeFormData[label]
        ? result.finalResult
        : this.templatizeFormData[label]

      return children
    }
  }

  renderLabel = () => {
    const { label, uiSchema, schema, id, required } = this.props
    const uiWidget = uiSchema['ui:widget']
    const type = schema.type
    /*
      When type:string but uiWidget is hidden
      it should not render the label and children .Same for array property also
     */
    if (uiWidget !== 'hidden' && type !== 'array') {
      return (
        <label htmlFor={id} className={css.label}>
          <span>
            {type !== 'object' && label}
            {required && label ? '*' : null}
          </span>
          {this.renderTemplateButton()}
        </label>
      )
    }
  }

  renderTemplateButton = () => {
    const { schema, children, label } = this.props
    const shouldHaveTemplateButton = this.canTemplatizeButton(schema, children.props.name)
    const isTemplatized = this.state.templateObj[label]

    // const btnText = this.state.templateObj[label] ? 'Remove Templatize' : 'Templatize'
    if (shouldHaveTemplateButton) {
      return this.renderIcons(isTemplatized)
    } else {
      return null
    }
  }
  renderIcons = isTemplatized => {
    const html = isTemplatized
      ? WingsIcons.renderNonTemplatizeIcon('__nonTemplatize', this.onTemplateClick)
      : WingsIcons.renderTemplatizeIcon('__templatize', this.onTemplateClick)
    return <div onClick={this.onTemplateClick}>{html}</div>
  }

  render () {
    const { classNames, label, help, errors, children, description } = this.props
    return (
      <div className={classNames}>
        {this.renderLabel()}
        {description}
        {this.renderChildren(label, children, children.props.formData)}
        {errors}
        {help}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/FormFieldTemplate/CustomFieldTemplate.js