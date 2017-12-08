import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class TooltipOverlay extends React.Component {
  state = {}

  render () {
    const placement = this.props.placement || 'top'
    const tooltipEl = (
      <Tooltip id="tooltip">
        {this.props.tooltip}
      </Tooltip>
    )

    return (
      <OverlayTrigger placement={placement}
        overlay={tooltipEl}
        delay={this.props.delay}
        className={this.props.className}>
        {this.props.children}
      </OverlayTrigger>
    )
  }
}

TooltipOverlay.defaultProps = {
  tooltip: '',
  delay: 200
}

export default TooltipOverlay



// WEBPACK FOOTER //
// ../src/components/TooltipOverlay/TooltipOverlay.js