import React from 'react'
import css from './InstancesSummary.css'
import DonutChart from '../DonutChart/DonutChart'
import { Wings } from 'utils'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import Utils from '../Utils/Utils'
import { TruncateText } from '../TruncateText/TruncateText'
import { Link } from 'react-router'

export class InstancesSummary extends React.Component {
  state = {}

  renderDonutCharts = (instanceStatsObj, instancesByAppFilterInfo) => (
    <div className="main-content">
      <div className="instance-box">
        <div className="total-value-box">
          <span className="total-value">{instanceStatsObj.totalCount}</span>
        </div>
        <span className="chart-label">Total</span>
      </div>

      {instanceStatsObj &&
        instanceStatsObj.countMap &&
        instancesByAppFilterInfo &&
        instancesByAppFilterInfo.length > 0 &&
        instancesByAppFilterInfo.map((chartInfo, idx) => {
          const chart = instanceStatsObj.countMap[chartInfo.type]
          return this.renderDonutChart(chart, chartInfo.label, idx)
        })}
    </div>
  )

  renderDonutChart = (instanceStats, chartLabel, chartIndex) => {
    let donutChartList = []
    const popoverList = []
    const subList = []
    let totalItemsInAggregatedOtherCategory = 0
    const numItemsToShowBeforeGroupingIntoOther = 5

    const formattedData = instanceStats.map(item => ({
      name: item.entitySummary.name,
      value: item.count
    }))

    Utils.sortDataByKey(formattedData, 'value', 'DESC')
    donutChartList = formattedData.slice(0, numItemsToShowBeforeGroupingIntoOther)

    // Create 'Other' category, to group items not in the top 5
    if (formattedData.length > numItemsToShowBeforeGroupingIntoOther) {
      const rowsToAggregate = formattedData.slice(numItemsToShowBeforeGroupingIntoOther)
      totalItemsInAggregatedOtherCategory += rowsToAggregate.reduce((total, num) => {
        return total + num.value
      }, 0)

      donutChartList.push({ name: 'Other', value: totalItemsInAggregatedOtherCategory })
      subList.push(...formattedData.slice(numItemsToShowBeforeGroupingIntoOther))
      subList.forEach(item => (item.className = 'small-text'))
    }
    popoverList.push(...donutChartList)

    // Add extra items to popover list, but not to donut chart list
    // if (this.props.showSubListInPopover) {
    popoverList.push(...subList)
    // }

    const colors = [
      Wings.RING_CHART_COLOR_1,
      Wings.RING_CHART_COLOR_2,
      Wings.RING_CHART_COLOR_3,
      Wings.RING_CHART_COLOR_4,
      Wings.RING_CHART_COLOR_5,
      Wings.RING_CHART_COLOR_6
    ]

    const pieChartProps = {
      pieChartProps: {
        width: 130,
        height: 130
      },
      pieProps: {
        colors,
        data: donutChartList,
        nameKey: 'name',
        dataKey: 'value',
        innerRadius: 22,
        outerRadius: 35
      }
    }

    const circleColors = ['blue-1', 'blue-2', 'blue-3', 'blue-4', 'blue-5', 'grey']

    const popoverData = (
      <table>
        <tbody>
          {popoverList.map((item, itemIndex) => (
            <tr className={item.className} key={itemIndex}>
              <td>
                <key>
                  <circle-div class={circleColors[itemIndex]} />
                  <text-sizer>
                    <TruncateText inputText={item.name} />
                  </text-sizer>
                </key>
              </td>
              <td>
                <value>{`${item.value} Instance${Utils.pluralize(item.value)}`}</value>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    const { popoverProps = {} } = this.props
    const defaultPopoverProps = {
      useSmartArrowPositioning: true,
      interactionKind: PopoverInteractionKind.HOVER,
      position: Position.LEFT,
      hoverCloseDelay: 100,
      hoverOpenDelay: 50,
      transitionDuration: 0,
      className: css.popoverTarget,
      popoverClassName: 'instance-summary-popover',
      portalClassName: css.instanceSummaryPopoverPortal,
      target: <DonutChart {...pieChartProps} />,
      content: <donut-popover>{popoverData}</donut-popover>
    }

    const mergedPopoverProps = Object.assign({}, defaultPopoverProps, popoverProps)

    return (
      <div key={chartIndex} className="instance-box">
        <div className="chart-container">
          <Popover {...mergedPopoverProps} />
        </div>
        <span className="chart-label">{chartLabel}</span>
      </div>
    )
  }

  renderTitle = () => {
    const { titleClickRedirectPath = '', title = 'Instances' } = this.props
    const renderedTitle = <card-title>{title}</card-title>
    return titleClickRedirectPath.length > 0 ? <Link to={titleClickRedirectPath}>{renderedTitle} </Link> : renderedTitle
  }

  render = () => {
    const { subTitle, instanceStats = {}, instancesByAppFilterInfo = [] } = this.props

    return (
      <main className={css.main}>
        <ui-card>
          <ui-card-header>
            <box-for-baselined-items>
              {this.renderTitle()}
              <card-sub-title>{subTitle}</card-sub-title>
            </box-for-baselined-items>
          </ui-card-header>
          <ui-card-main>{this.renderDonutCharts(instanceStats, instancesByAppFilterInfo)}</ui-card-main>
        </ui-card>
      </main>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/InstancesSummary/InstancesSummary.js