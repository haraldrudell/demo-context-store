import React from 'react'
import { Popover, Position } from '@blueprintjs/core'

import css from './FormFieldTemplate.css'

const FormFieldTemplate = props => {
  const {
    id,
    classNames,
    label,
    help,
    rawHelp,
    hidden,
    required,
    description,
    errors,
    children,
    schema,
    uiSchema
  } = props
  const type = schema.type

  const classes = classNames + (hidden ? ' hidden' : '')
  const toolTipContent = (
    <span className={css.toolTipContent}>
      {rawHelp}

      {uiSchema['custom:LinkText'] &&
        <a href={uiSchema['custom:url']} target="_blank">
          {uiSchema['custom:LinkText']}
        </a>}
    </span>
  )
  const customText = uiSchema['custom:helpText'] ? uiSchema['custom:helpText'] : toolTipContent
  const tooltip = (
    <Popover id={`${id}tooltip`} title={label} position={Position.TOP_LEFT} content={customText}>
      <i className="icons8-help-filled" />
    </Popover>
  )

  const helpEl = () => {
    if (uiSchema['custom:helpText'] || rawHelp) {
      return (
        <span className={css.toolTip}>
          {tooltip}
        </span>
      )
    }
    return help
  }
  if (type !== 'boolean') {
    return (
      <div className={`${classes} ${css.main}`}>
        <label htmlFor={id}>
          {type !== 'boolean' && label}
          {required ? '*' : null}
          {helpEl()}
        </label>
        {description}
        {children}
        {errors}
      </div>
    )
  } else if (type === 'boolean') {
    return (
      <span className={`${classes} ${css.booleanFieldTemplate}`}>
        {children}
        {rawHelp && helpEl()}
      </span>
    )
  }
}

export default FormFieldTemplate



// WEBPACK FOOTER //
// ../src/components/FormFieldTemplate/FormFieldTemplate.js