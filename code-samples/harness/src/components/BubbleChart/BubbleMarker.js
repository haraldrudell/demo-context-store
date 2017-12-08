import React, { PropTypes } from 'react'
import BubbleUtils from './BubbleUtils'

function BubbleMarker (props) {
  const { point, r } = props
  const exec = point.datum
  const radius = d3.functor(r)(exec)
  const params = { cx: point.x, cy: point.y, r: radius, strokeWidth: 5, fill: props.fill, opacity: props.opacity }
  return (
    <g onClick={(e) => BubbleUtils.clickBubble(exec)}>
      {BubbleUtils.drawBubble(exec, params)}
    </g>
  )
}


BubbleMarker.propTypes = {
  stroke: PropTypes.string,
  fill: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  point: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    datum: PropTypes.object.isRequired
  }).isRequired,
  className: PropTypes.string,
  r: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func
  ]).isRequired
}

BubbleMarker.defaultProps = {
  stroke: '#d2d6de',
  opacity: 0.1,
  fill: '#fff',
  className: 'react-stockcharts-marker-circle'
}

BubbleMarker.drawOnCanvas = (props, point, ctx) => {
  BubbleMarker.drawOnCanvasWithNoStateChange(props, point, ctx)
}


BubbleMarker.drawOnCanvasWithNoStateChange = (props, point, ctx) => {
  ctx.moveTo(point.x, point.y)
}

export default BubbleMarker



// WEBPACK FOOTER //
// ../src/components/BubbleChart/BubbleMarker.js