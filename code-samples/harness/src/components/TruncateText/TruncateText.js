import React from 'react'
import css from './TruncateText.css'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'

export class TruncateText extends React.Component {
  state = {}

  disablePopover = false

  defaultPopoverProps = {
    useSmartArrowPositioning: true,
    interactionKind: PopoverInteractionKind.HOVER,
    position: Position.TOP,
    hoverCloseDelay: 100,
    hoverOpenDelay: 100,
    transitionDuration: 0,
    popoverClassName: 'truncate-text-popover',
    portalClassName: css.popoverportal
  }

  showPopoverWhenContentTruncated = event => {
    const isEllipsed = this.ellipsisBlock.offsetWidth < this.ellipsisBlock.scrollWidth
    this.disablePopover = !isEllipsed
    this.forceUpdate()
  }

  renderPopoverTarget = ({ targetClass, target }) => (
    <text-truncator class={targetClass} onMouseEnter={this.showPopoverWhenContentTruncated}>
      <block-required-for-ellipsis ref={r => (this.ellipsisBlock = r)}>{target}</block-required-for-ellipsis>
    </text-truncator>
  )

  renderPopoverContent = ({ inputText }) => <span>{inputText}</span>
  renderPopoverContentForArray = ({ inputText }) => (
    <multi-line-popover ref={r => (this.contentRef = r)}>
      {inputText.map((item, itemIdx) => <span key={itemIdx}>{item}</span>)}
    </multi-line-popover>
  )

  addCommasInArray = ({ inputArray }) => {
    return inputArray.map((el, elIndex) => {
      return (
        <array-element key={elIndex}>
          {el}
          {elIndex < inputArray.length - 1 ? ',' : null}
        </array-element>
      )
    })
  }

  render = () => {
    let { popoverProps = this.defaultPopoverProps } = this.props
    const { targetClass = '' } = this.props
    const { noPopover } = this.props
    popoverProps = Object.assign({}, this.defaultPopoverProps, popoverProps)
    let content = ''
    let target = ''

    if (this.props.isArray) {
      content = this.props.content || this.renderPopoverContentForArray({ inputText: this.props.inputText })
      target =
        this.props.target ||
        this.renderPopoverTarget({ target: this.addCommasInArray({ inputArray: this.props.inputText }) })
    } else {
      content = this.props.content || this.renderPopoverContent({ inputText: this.props.inputText })
      target = this.props.target || this.renderPopoverTarget({ targetClass, target: this.props.inputText })
    }

    const disablePopover = noPopover ? true : this.disablePopover

    return (
      <Popover className={css.target} {...popoverProps} target={target} isDisabled={disablePopover} content={content} />
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/TruncateText/TruncateText.js