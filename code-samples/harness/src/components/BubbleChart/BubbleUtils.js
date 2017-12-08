import React from 'react'
import Utils from '../Utils/Utils'
import css from './BubbleUtils.css'

const FILL = 'transparent'
const STROKE = 'transparent'

export default class BubbleUtils {
  /**
   * Returns Inner Bubble Total Count.
   * @param  {Object} [exec] - Execution Object.
   * @param  {Object} [params] - Configurable Params.
   */
  static innerText (exec, params) {
    if (exec === null) {
      return this.innerTextForNoData(params)
    }
    if (params.r > 0) {
      const onClick = params.onClick || (e => BubbleUtils.clickBubble(e, exec))
      return BubbleUtils.renderTextWithIcon(exec, onClick, params)
    }

    return null
  }
  static iconObj = {
    SUCCESS: '\uf195',
    FAILED: '',
    RUNNING: '\uf15c',
    PAUSED: '\uf122',
    ABORTED: '\uf17d',
    PAUSING: '\uf122',
    ABORTING: '\uf17d'
  }
  static innerTextStroke = {
    SUCCESS: '#9AE1AD',
    FAILED: '#EC9FA8',
    RUNNING: '#7DDBDF',
    PAUSED: '#FEBF01',
    ABORTED: '#C3C8CA',
    PAUSING: '#FEBF01',
    ABORTING: '#C3C8CA'
  }
  /* Temporary Fix */
  static setX = () => {
    const url = window.location.href
    if (url.indexOf('/applications') > -1) {
      return '42px'
    } else {
      return '37px'
    }
  }
  static setY = () => {
    const url = window.location.href
    if (url.indexOf('/applications') > -1) {
      return '38px'
    } else {
      return '32px'
    }
  }
  /* SVG Content for running-> as there is no running icon in icons8 */
  static renderRunningIcon (onClick) {
    const x = BubbleUtils.setX()
    const y = BubbleUtils.setY()
    return (
      <svg
        version="1.1"
        id="Rectangle_766_1_"
        xmlns="http://www.w3.org/2000/svg"
        x={x}
        y={y}
        viewBox="0 0 141 164.5"
        width="10"
        height="10"
        fill="#00ade4"
        onClick={onClick}
      >
        <g id="Rectangle_766">
          {' '}
          <g>
            <polygon class="st0" points="38.5,123.1 38.5,0 0,0 0,164.5 141,164.5 141,123.1 		" />
          </g>
        </g>
      </svg>
    )
  }
  static renderTextWithIcon = (exec, onClick, params) => {
    const yParam = params.cy + 2
    if (exec.status !== 'RUNNING') {
      return (
        <text
          x={params.cx}
          y={yParam}
          className={`${css[exec.status + '_StatusText']} ${css.innerText}`}
          dy=".25em"
          onClick={onClick}
          danger
        >
          {exec.status !== 'FAILED' && BubbleUtils.iconObj[exec.status]}
          {exec.status === 'FAILED' && '!'}
        </text>
      )
    } else if (exec.status === 'RUNNING') {
      return BubbleUtils.renderRunningIcon(onClick)
    }
  }
  static innerTextForNoData (params) {
    if (params.r > 0) {
      const className = params.r <= 15 ? 'smallText' : 'normalText'

      return (
        <text x={params.cx} y={params.cy} className={className + ' ' + css.innerText} dy=".25em" textAnchor="middle" />
      )
    }
  }

  static getToolTipForInnerCirle (exec) {
    if (exec) {
      const status = exec.status
      let _status
      switch (status) {
        case 'INPROGRESS':
          _status = 'In Progress'
          break
        case 'FAILED':
          _status = 'Failed'
          break
        case 'SUCCESS':
          _status = 'Success'
          break
        case 'QUEUED':
          _status = 'Queued'
          break
        case 'RUNNING':
          _status = 'Running'
          break
        case 'PAUSED':
          _status = 'Paused'
          break
        case 'ABORTED':
          _status = 'Aborted'
          break
        case 'PAUSING':
          _status = 'Pausing'
          break
        case 'ABORTING':
          _status = 'Aborting'
          break
        default:
          _status = 'Not Started'
      }

      const toolTipData = 'Status: ' + _status
      return toolTipData
    }
  }

  static renderInnerCircle (exec, params, radius, className = '') {
    const calRadius = 12 // ( radius || (params.r / 2) )
    return (
      <circle
        className={`${className} ${css.innerCircle}`}
        cx={params.cx}
        cy={params.cy}
        r={calRadius}
        fill={FILL}
        stroke={exec !== null && BubbleUtils.innerTextStroke[exec.status]}
        strokeWidth={3}
        textAnchor="middle"
      >
        <title> {BubbleUtils.getToolTipForInnerCirle(exec)}</title>
      </circle>
    )
  }

  /**
   * Returns the complete Bubble with all statuses.
   * @param  {Object} [exec] - Execution Object.
   * @param  {Object} [params] - Configurable Params.
   */
  static drawBubble (exec, params) {
    return (
      <g className={css['bubble' + exec.status]}>
        {BubbleUtils.renderBgCircle(exec, params, `bubbleBase ${css.bubbleBase}`)}
        {exec.status === 'RUNNING' && BubbleUtils.renderInnerCircle(exec, params, params.r, '__animation')}
        {BubbleUtils.renderCircle('inprogress', exec, params)}
        {BubbleUtils.renderCircle('failed', exec, params)}
        {BubbleUtils.renderCircle('success', exec, params)}
        {BubbleUtils.renderCircle('queued', exec, params)}

        {/* BubbleUtils.innerText(exec, params)*/}
        {/* BubbleUtils.renderInnerCircle(exec, params)*/}
      </g>
    )
  }

  static drawBubbleForNoData (params) {
    return (
      <g className={css['bubble' + 'inprogress']}>
        {BubbleUtils.renderBgCircle(null, params, `bubbleBase ${css.bubbleBase}`)}

        {BubbleUtils.renderCircle('inprogress', null, params)}
        {BubbleUtils.renderCircle('failed', null, params)}
        {BubbleUtils.renderCircle('success', null, params)}
        {BubbleUtils.innerText(null, params)}
        {BubbleUtils.renderInnerCircle(null, params)}
      </g>
    )
  }

  static renderBgCircle (exec, params, className) {
    const strokeWidth = params.strokeWidth || 2
    const fill = params.fill || FILL
    const opacity = params.opacity || 1
    const cir = 2 * Math.PI * params.r
    const offset = (1 - 0.8) * cir
    return (
      <circle
        className={className}
        cx={params.cx}
        cy={params.cy}
        r={params.r}
        fill={fill}
        fillOpacity={opacity}
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeDasharray={cir}
        strokeDashoffset={offset}
        transform={'rotate(-235 ' + params.cx + ' ' + params.cy + ')'}
      >
        <title>{exec !== null && BubbleUtils.getTitle(exec)}</title>
      </circle>
    )
  }

  /**
   * Returns a Circle.
   * @param  {string} [status] - Execution Status.
   * @param  {Object} [exec] - Execution Object.
   * @param  {Object} [params] - Configurable Params.
   */
  static renderCircle (status, exec, params) {
    if (exec === null) {
      return this.renderCircleForNoData(params)
    }

    if (exec.breakdown[status] <= 0) {
      return
    }

    let calc = 0

    switch (status.toUpperCase()) {
      case 'INPROGRESS':
        calc = exec.breakdown['inprogress'] + exec.breakdown['success'] + exec.breakdown['failed']
        break
      case 'FAILED':
        calc = exec.breakdown['success'] + exec.breakdown['failed']
        break
      case 'QUEUED':
        calc = exec.breakdown['queued']
        break
      case 'SUCCESS':
      default:
        calc = exec.breakdown['success']
        break
    }

    const percent = calc / exec.total
    const _c = Math.max(0, Math.min(0.8, percent))
    const cir = 0.8 * 2 * Math.PI * params.r
    const offset = (0.8 - _c) * cir
    const strokeWidth = params.strokeWidth || 1.5
    const fill = params.fill || FILL
    const onClick = params.onClick || (e => BubbleUtils.clickBubble(e, exec))
    const opacity = params.opacity || 1

    return (
      <circle
        className={'bubbleArc ' + css[status]}
        cx={params.cx}
        cy={params.cy}
        r={params.r}
        fill={fill}
        fillOpacity={opacity}
        strokeWidth={strokeWidth}
        strokeDasharray={cir}
        strokeDashoffset={offset}
        transform={'rotate(-235 ' + params.cx + ' ' + params.cy + ')'}
        onClick={onClick}
      >
        <title>{BubbleUtils.getTitle(exec)}</title>
      </circle>
    )
  }

  static renderCircleForNoData (params) {
    const _c = 0.8
    const cir = 0.8 * 2 * Math.PI * params.r
    const offset = (0.8 - _c) * cir
    const strokeWidth = params.strokeWidth || 1.5
    const fill = params.fill || FILL
    const opacity = params.opacity || 1

    return (
      <circle
        className={'bubbleArc ' + css[status]}
        cx={params.cx}
        cy={params.cy}
        r={params.r}
        fill={fill}
        fillOpacity={opacity}
        strokeWidth={strokeWidth}
        strokeDasharray={cir}
        strokeDashoffset={offset}
        transform={'rotate(-235 ' + params.cx + ' ' + params.cy + ')'}
      >
        <title>0</title>
      </circle>
    )
  }

  /**
 * Returns Tooltip title for the Bubble.
 * @param  {Object} [exec] - Execution Object.
 */
  static getTitle (exec) {
    const _ar = []

    Object.keys(exec.breakdown).map(item => {
      let _status = ''

      if (exec.breakdown[item] > 0) {
        switch (item.toUpperCase()) {
          case 'INPROGRESS':
            _status = 'In Progress'
            break
          case 'FAILED':
            _status = 'Failed'
            break
          case 'SUCCESS':
            _status = 'Success'
            break
          case 'QUEUED':
            _status = 'Queued'
            break
          default:
        }
        _ar.push(_status + ' : ' + exec.breakdown[item])
      }
    })

    return _ar.join('\n')
  }

  /**
   * Handle Click Method.
   * @param  {Object} [e] - Click Event.
   * @param  {Object} [exec] - Execution Object.
   */
  static clickBubble (e, exec) {
    if (!exec) {
      return
    }

    localStorage.setItem('env', exec.envId)
    Utils.redirect({ appId: exec.appId, envId: exec.envId, executionId: exec.uuid, page: 'detail' })
  }
}



// WEBPACK FOOTER //
// ../src/components/BubbleChart/BubbleUtils.js