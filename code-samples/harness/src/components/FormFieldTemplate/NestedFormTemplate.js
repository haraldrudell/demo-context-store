import React from 'react'
import css from './NestedFormTemplate.css'

export default class NestedFormTemplate extends React.Component {
  renderHtmlForNonObjects = () => {
    const { id, classNames, label, help, children, description, required, schema, uiSchema } = this.props
    const type = schema.type
    const title = schema.title
    const uiWidget = uiSchema['ui:widget']
    const showLabel = schema.showLabel
    if (uiWidget !== 'hidden') {
      return (
        <div className={`${classNames} ${css.main}`}>
          <label htmlFor={id} data-title={title}>
            {this.renderLabel(type, uiWidget, showLabel, label)}
            {required ? '*' : null}
          </label>
          <div>
            {description}
            {children}

            {help}
          </div>
        </div>
      )
    } else {
      return children
    }
  }

  renderLabel = (type, uiWidget, showLabel, label) => {
    if (showLabel || type !== 'array') {
      return label
    } else if (uiWidget !== 'hidden') {
      return label
    }
  }

  renderHtmlForObject = () => {
    const { classNames, label, help, children, description, id, schema } = this.props
    const defaultChecked = schema.defaultChecked !== undefined ? schema.defaultChecked : true
    return (
      <div className={`${classNames} ${css.main}`}>
        <input id={`toggle_${id}`} data-type="toggle" type="checkbox" defaultChecked={defaultChecked} />

        <label htmlFor={`toggle_${id}`} className="toggleLabel">
          <span className={css.labelSpan}>
            {(children && this.props.children.props.formData.functionName) || label}
          </span>
        </label>
        <div className="toggleContent" data-type="toggleContent">
          {description}
          {children}

          {help}
        </div>
      </div>
    )
  }

  renderHtmlForBoolean = () => {
    const { help, children, description } = this.props
    return (
      <span className={`${css.booleanFieldTemplate}`}>
        {description}
        {children}

        {help}
      </span>
    )
  }

  render () {
    const { id, schema } = this.props
    const type = schema.type
    const addExpand = schema.addExpand
    if (type === 'object' && id !== 'root' && addExpand) {
      return this.renderHtmlForObject()
    } else if (type === 'boolean') {
      return this.renderHtmlForBoolean()
    } else if (id === 'root' || type !== 'boolean' || !addExpand) {
      return this.renderHtmlForNonObjects()
    }
  }
}



// WEBPACK FOOTER //
// ../src/components/FormFieldTemplate/NestedFormTemplate.js