import React from 'react'
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core'
import css from './DropdownMenu.css'

class DropdownMenu extends React.Component {
  renderMenuContent () {
    // const options = [{ label: 'Menu 1', onClick: () => { alert(1) } }, { label: 'Menu 2', onClick: () => {} }]
    const { options = [] } = this.props
    return (
      <Menu>
        {options.map(option => {
          return (
            <MenuItem
              key={option.label}
              text={option.label}
              onClick={option.onClick}
              className={option.className || ''}
            />
          )
        })}
      </Menu>
    )
  }

  render () {
    const {
      title,
      position,
      button,
      buttonClassName,
      content,
      caret = true,
      popoverProps = {},
      showDropdown = true
    } = this.props

    let popoverClassName = `pt-minimal ${css.popover}`
    if (popoverProps && popoverProps.popoverClassName) {
      popoverClassName += ' ' + popoverProps.popoverClassName
    }

    const buttonEl = button || (
      <button className={`ui-btn ${buttonClassName}`}>
        {title}
        {caret && <i className="icons8-sort-down" />}
      </button>
    )

    if (showDropdown) {
      return (
        <Popover
          className={css.name}
          content={content || this.renderMenuContent()}
          position={position || Position.BOTTOM_LEFT}
          {...popoverProps}
          popoverClassName={popoverClassName} /* must be the last prop */
        >
          {buttonEl}
        </Popover>
      )
    } else {
      return <main>{buttonEl}</main>
    }
  }
}

export default DropdownMenu



// WEBPACK FOOTER //
// ../src/components/DropdownMenu/DropdownMenu.js