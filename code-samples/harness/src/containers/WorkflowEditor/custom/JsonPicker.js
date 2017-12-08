import React from 'react'
import { ClickableJson, Utils } from 'components'
import css from './JsonPicker.css'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'

class JsonPicker extends React.Component {
  state = {
    showJsonPicker: false,
    selectedText: this.props.value
  }
  showJsonPickerToggle = true

  // After value is changed through json picker.
  onSelectJson = chainedKeys => {
    this.setState({ selectedText: chainedKeys, showJsonPicker: false })
    this.props.onChange(chainedKeys)
    this.input.value = chainedKeys
  }

  // After user changes value by hand.
  onChange = ev => {
    this.props.onChange(ev.target.value)
  }

  hideJsonPicker = () => this.setState({ showJsonPicker: false })
  renderPopoverTarget = () => (
    <a className={`launcher-button ${this.showJsonPickerToggle ? '' : 'hide'}`}>Guide from Example</a>
  )

  renderPopoverContent = jsonString => (
    <ui-card>
      <header>
        <header-1>Host Name Field</header-1>
        <header-2>Select key from example.</header-2>
      </header>
      <main>
        <ClickableJson jsonString={jsonString} onSelectJson={this.onSelectJson} />
      </main>
    </ui-card>
  )

  handleInteraction = nextOpenState => {
    this.setState({ showJsonPicker: nextOpenState })
  }

  render () {
    const jsonString = Utils.getJsonValue(this.props.schema, 'data', 'data')
    this.showJsonPickerToggle = !!jsonString

    const popoverProps = {
      target: this.renderPopoverTarget(),
      content: this.renderPopoverContent(jsonString),
      interactionKind: PopoverInteractionKind.CLICK,
      position: Position.RIGHT,
      hoverCloseDelay: 100,
      hoverOpenDelay: 0,
      transitionDuration: 0,
      autoFocus: false,
      enforceFocus: false,
      popoverClassName: 'json-picker-window',
      isOpen: this.state.showJsonPicker,
      onInteraction: this.handleInteraction
    }

    return (
      <div className={css.main}>
        <input-row>
          <input
            defaultValue={this.props.value || ''}
            onChange={ev => this.onChange(ev)}
            ref={ref => (this.input = ref)}
          />
          <Popover {...popoverProps} />
        </input-row>
      </div>
    )
  }
}

export default JsonPicker



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/JsonPicker.js