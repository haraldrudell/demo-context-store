import React from 'react'
import { Dropdown } from 'react-bootstrap'

export class LabellingDropdown extends React.Component {
  state = {}

  toggleDropdown = () => {
    const open = !this.state.open
    const { props: { onShow = () => null } } = this

    this.setState({ open })

    if (open) {
      onShow()
    }
  }

  shouldCloseDropdown = (isOpen, event, source) => {
    const { props: { shouldCloseOnClick = () => true, onHide = () => null } } = this
    const open = !shouldCloseOnClick(isOpen, event, source)

    this.setState({ open })

    if (!open) {
      onHide()
    }
  }

  render () {
    const { state = {}, props, props: { title = '', label = '', width = 'auto', items = null, className = '' } } = this
    const styles = { width }
    const titleComponent =
      title && typeof title === 'string'
        ? <label>
          {title}
        </label>
        : props.title // title can be string or component

    return (
      <labelling-dropdown class={className}>
        {titleComponent}
        <Dropdown open={state.open} id={'dropdown-' + title} onToggle={this.shouldCloseDropdown}>
          <a className="labelling-dropdown-label" onClick={this.toggleDropdown}>
            <strong style={styles}>
              {label}
            </strong>
            <span className="caret" />
          </a>
          {items}
        </Dropdown>
      </labelling-dropdown>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/LabellingDropdown/LabellingDropdown.js