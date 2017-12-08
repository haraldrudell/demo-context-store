import React, { PropTypes } from 'react'
import css from './Bubble.css'
import WingsIcons from '../WingsIcons/WingsIcons.js'
import BubbleUtils from './BubbleUtils'

class Bubble extends React.Component {

  renderBubbleForNoData () {
  }

  render () {
    const exec = this.props.exec || {}
    const cls = `${css.main}` + ' ' + `${this.props.className}`
    const className = (this.props.allApps) ? `${css.appCardBubble}` : cls
    const svgCls = (this.props.allApps) ? css.iconsAppCardView : css.iconsContentView
    const params = {}
    params.cx = params.cy = this.props.diameter / 2
    params.r = (this.props.diameter - ( 2 * this.props.strokeWidth )) / 2
    params.strokeWidth = this.props.strokeWidth
    params.fill = this.props.fill
    params.opacity = this.props.opacity
    if ( this.props.exec ) {
      params.onClick = this.props.onClick || ((e) => BubbleUtils.clickBubble(e, exec))
    }
    return (
      <div className={className} onClick={params.onClick}>
        <svg width={this.props.diameter} height={this.props.diameter}>
          {this.props.exec && BubbleUtils.drawBubble(exec, params)}}
          {!this.props.exec && BubbleUtils.drawBubbleForNoData( params)}}
        </svg>
        {WingsIcons.renderStatusIcon(exec.status, svgCls, { 'showToolTip': true })}
        <span className="text-center">
          {this.props.legend}
        </span>
      </div>
    )
  }
}

Bubble.propTypes = {
  exec: PropTypes.object.isRequired,
  diameter: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  legend: PropTypes.object,
  className: PropTypes.string,
  fill: PropTypes.string,
  opacity: PropTypes.number
}

Bubble.defaultProps = {
  diameter: 90,
  strokeWidth: 12,
  legend: null,
  className: '',
  fill: 'transparent',
  opacity: 1
}

export default Bubble



// WEBPACK FOOTER //
// ../src/components/BubbleChart/Bubble.js