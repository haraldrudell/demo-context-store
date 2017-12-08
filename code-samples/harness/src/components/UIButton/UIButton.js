import React from 'react'
import { pickHTMLProps } from 'pick-react-known-prop'
import * as Icons from 'styles/icons'
import TooltipOverlay from '../TooltipOverlay/TooltipOverlay'
import './UIButton.css'

/**
 * @param {Object} props - Props.
 * @example
 * <UIButton icon="Cross" />
 * <UIButton icon="Add" medium>New Item</UIButton>
 * <UIButton>Text Button (Link)</UIButton>
 * <UIButton type="button">Regular Button</UIButton>
 * <UIButton type="submit">Submit</UIButton>
 * <UIButton tooltip="Tooltip">Button</UIButton>
 */
const UIButton = props => {
  const { tooltip = '', icon, medium, large, accent = false, children } = props
  const customClass = props.className ? ' ' + props.className : ''
  const className = 'ui-btn' + customClass + (accent ? ' ui-accent-btn' : '')

  let buttonEl = null
  let dataName = ''
  if (props.children && typeof props.children === 'string') {
    dataName = props.children
  }
  if (icon) {
    // UIButton with icon prop:
    const SvgIcon = Icons[icon]
    let title = children || icon // default title (useful for icon-only buttons)
    if (tooltip) {
      title = '' // reset title if tooltip prop exists.
    }
    let sizeCss = ''
    sizeCss = medium ? 'md-icon' : sizeCss
    sizeCss = large ? 'lg-icon' : sizeCss
    const validProps = pickHTMLProps(props)
    buttonEl = (
      <button data-name={dataName} title={title} {...validProps} className={`${className} with-icon ${sizeCss}`}>
        <SvgIcon />
        {children && <span>{children}</span>}
      </button>
    )
  } else {
    // UIButton
    const validProps = pickHTMLProps(props)
    buttonEl = (
      <button data-name={dataName} {...validProps} className={className}>
        {children}
      </button>
    )
  }

  if (tooltip) {
    return <TooltipOverlay tooltip={tooltip}>{buttonEl}</TooltipOverlay>
  } else {
    return buttonEl
  }
}

export default UIButton



// WEBPACK FOOTER //
// ../src/components/UIButton/UIButton.js