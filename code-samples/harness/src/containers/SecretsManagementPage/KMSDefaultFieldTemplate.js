import React from 'react'
import css from './CustomKMSForm.css'
export default class KMSDefaultFieldTemplate extends React.Component {
  renderLabel = () => {
    const { label, schema, id, required } = this.props

    const type = schema.type
    if (type !== 'boolean') {
      return (
        <label htmlFor={id}>
          <span>
            {type !== 'object' && label}
            {required && label ? '*' : null}
          </span>
        </label>
      )
    }
  }

  renderWarningMessage = () => {
    const { id, children, uiSchema } = this.props
    const formData = children.props.formData
    const uiDisabled = uiSchema['ui:disabled']
    if (id === 'root_default' && formData && !uiDisabled) {
      return <span className={css.warning}> This Secret manager will be used for encryption going forward</span>
    } else {
      return null
    }
  }

  renderTitle = () => {
    const { id, children, uiSchema } = this.props
    const formData = children.props.formData
    const uiDisabled = uiSchema['ui:disabled']
    if (id === 'root_default' && formData && uiDisabled) {
      return 'Marking others as default makes it non-default'
    } else {
      return null
    }
  }

  render () {
    const { classNames, help, errors, children } = this.props
    const title = this.renderTitle()
    return (
      <div className={classNames} title={title}>
        {this.renderLabel()}
        {children}
        {this.renderWarningMessage()}
        {errors}
        {help}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/KMSDefaultFieldTemplate.js