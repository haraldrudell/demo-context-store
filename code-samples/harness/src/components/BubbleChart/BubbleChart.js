import React from 'react'
import Bubble from './Bubble'
import css from './BubbleChart.css'
import moment from 'moment'
import Utils from '../Utils/Utils'


export default class BubbleChart extends React.Component {
  state = { bubbleData: [] }

  componentWillReceiveProps (newProps) {
    this.executions = newProps.executions
    this.environments = newProps.environments
    this.createBubbleData()
  }

  createBubbleData () {
    const bubbleData = []

    if ( this.executions.length > 0 ) {
      this.executions.map((exec) => {
        const _bubble = Object.assign({}, Utils.clone(exec), {
          _id: exec.uuid,
          entity: this.findEnvById(exec.envId),
          time: (moment.unix(exec.createdAt / 1000).format('MM/DD hh:mm a'))
        })

        bubbleData.push(_bubble)
        this.setState({ bubbleData })
      })
    }


  }

  findEnvById (envId) {
    const _env = this.environments.find((env) => env.uuid === envId)
    return (_env) ? _env.name : ''
  }

  findMax (executions) {
    const _arr = []
    this.executions.map((exec) => {
      _arr.push(exec.total)
    })
    return Math.max(..._arr)
  }

  findRangeByTotal (total, max) {
    const flat = 50 * total / max
    switch (true) {
      case (flat < 25):
        return 25
      case (flat < 30):
        return 30
      case (flat < 40):
        return 40
      case (flat < 50):
      default:
        return 50
    }
  }


  textLegend (item) {

    return (
      <div className={css.legendText}>
        <div className={css.timeText}> {item.time} </div>
        {item.entity &&
        <div className={css.entityText}> {item.entity} </div>}
        {!item.entity && <div>-</div>}
      </div>
    )
  }

  bubble (item) {
    return (
      <td key={item._id}>
        <Bubble legend={this.textLegend(item)}
          key={item._id}
          exec={item}
          allApps={true}
          className="appCardBubble"/>
      </td>
    )
  }
  bubbleForNoData (key, item) {

    return (
      <td key={key}>
        <Bubble legend={this.textLegend(item)}
          key={item._id} />
      </td>
    )
  }

  renderLeftArrow () {
    if (!this.props.hasLeft) {
      return null
    }


    return (
      <a className={'left carousel-control'} href="#" role="button" data-slide="prev"
        onClick={this.props.onLeftArrowClick}>
        <span className="icons8-back" />
        <span className="sr-only">Previous</span>
      </a>
    )
  }


  renderRightArrow () {

    if (!this.props.hasRight) {
      return null
    }

    return (
      <a className={'right carousel-control'} href="#" role="button" data-slide="next"
        onClick={this.props.onRightArrowClick}>
        <span className="icons8-forward" />
        <span className="sr-only">Next</span>
      </a>
    )
  }

  renderBubbleChartForNoData () {
    let count = 0
    const dummyData = []
    for (let repeat = 10; repeat < 13; repeat++) {
      const _bubble = Object.assign({}, {
        _id: repeat,
        entity: 'Development',
        time: '00/00 0:00pm'
      })

      dummyData.push(_bubble)

    }
    return (
      <div className={'row __bubbleChartContainer ' + css.content}>
        <div className="__arrrowCol col-md-1 col-xs-1">
          {this.renderLeftArrow()}
        </div>
        <div className="col-md-10 col-xs-10 __bubbleChart">
          <table className={css.main}>
            <tbody>
              <tr>

                {dummyData.map((item) =>

                  this.bubbleForNoData(count++, item)
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-1 col-xs-1 __arrrowCol __rightCol">
          {this.renderRightArrow()}
        </div>
      </div>

    )
  }
  render () {

    const _bubbleData = this.state.bubbleData || []

    if ( this.props.executions === '-1' && this.props.noDataCls !== '__hide') {
      return this.renderBubbleChartForNoData()
    } else if (_bubbleData.length === 0) {
      return (
        <div className={css.main + ' __bubbleChartContainer show-grid'}>
          <div className="__zeroLabel"> No Latest Deployments</div>
        </div>
      )
    }

    return (
      <div className={'row __bubbleChartContainer ' + css.content}>
        <div className="__arrrowCol col-md-1 col-xs-1">
          {this.renderLeftArrow()}
        </div>
        <div className="col-md-10 col-xs-10 __bubbleChart">
          <table className={css.main}>
            <tbody>
              <tr>
                {_bubbleData.map((item) =>
                  this.bubble(item)
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-1 col-xs-1 __arrrowCol __rightCol">
          {this.renderRightArrow()}
        </div>
      </div>

    )
  }
}




// WEBPACK FOOTER //
// ../src/components/BubbleChart/BubbleChart.js