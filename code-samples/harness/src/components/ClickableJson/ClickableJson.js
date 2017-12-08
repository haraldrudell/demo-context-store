import React from 'react'
import css from './ClickableJson.css'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'

export class ClickableJson extends React.Component {
  state = { disablePopover: false }

  createArrayFromJson = (jsonObj, parentKeys = [], indent = 0) => {
    for (const key in jsonObj) {
      const value = jsonObj[key]
      const parentKeysCopy = [...parentKeys]
      parentKeysCopy.push(key.toString())

      // Test whether value is an object
      if (value !== null && typeof value === 'object') {
        // key
        this.processedJson.push({
          key: key + ':',
          value: '',
          parentKeys: parentKeysCopy,
          indent
        })

        // value
        this.createArrayFromJson(value, parentKeysCopy, indent + 1) // recurse
      } else {
        // Create object for clickable key
        this.processedJson.push({
          key: key + ':',
          value,
          parentKeys: parentKeysCopy,
          indent,
          showHover: true,
          finalKeyInChain: true
        })
      }
    }
  }

  processedJson = []

  disablePopoverWhenContentTruncated = event => {
    const isEllipsed = event.target.offsetWidth < event.target.scrollWidth
    this.setState({ disablePopover: !isEllipsed })
  }

  onJsonClick = chainedKeys => {
    this.props.onSelectJson(chainedKeys)
  }

  renderPopoverTarget = row => (
    <line-item-value>
      <text-truncator>
        <block-required-for-ellipsis onMouseEnter={this.disablePopoverWhenContentTruncated}>
          {row.value}
        </block-required-for-ellipsis>
      </text-truncator>
    </line-item-value>
  )

  renderPopoverContent = row => <span>{row.value}</span>

  render () {
    this.processedJson = []
    const { jsonString } = this.props

    const tableNestingIndentPx = 12
    this.createArrayFromJson(jsonString)
    this.createArrayFromJson(this.props.jsonString)

    const popoverProps = {
      useSmartArrowPositioning: true,
      interactionKind: PopoverInteractionKind.HOVER,
      position: Position.BOTTOM,
      hoverCloseDelay: 50,
      hoverOpenDelay: 0,
      transitionDuration: 0,
      popoverClassName: 'value-popover',
      isDisabled: this.state.disablePopover,
      autoFocus: false,
      enforceFocus: false
    }

    return (
      <div className={css.main}>
        <table-container>
          {this.processedJson.map((row, idx) => {
            const chainedKeys = row.parentKeys && row.parentKeys.join('.')
            return (
              <div key={idx} className={row.finalKeyInChain ? 'linked-key' : ''}>
                <line-item
                  style={{ 'padding-left': row.indent * tableNestingIndentPx + 16 }}
                  onClick={row.finalKeyInChain ? () => this.onJsonClick(chainedKeys) : null}
                >
                  <line-item-key>{row.key}</line-item-key>
                  {this.renderPopoverTarget(row)}
                  {/* clicking on this popover closes the window.  Disable it for now. */}
                  {false && (
                    <Popover
                      {...popoverProps}
                      target={this.renderPopoverTarget(row)}
                      content={this.renderPopoverContent(row)}
                    />
                  )}{' '}
                </line-item>
              </div>
            )
          })}
        </table-container>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/ClickableJson/ClickableJson.js