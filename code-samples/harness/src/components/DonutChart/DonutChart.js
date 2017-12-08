import React from 'react'
import css from './DonutChart.css'
import { Wings } from 'utils'
import { Cell, PieChart, Pie, Sector } from 'recharts'
import Utils from '../Utils/Utils'

export default class DonutChart extends React.Component {
  state = {
    activeIndex: -1
  }

  truncateString = str => {
    if (str.length >= 25) {
      const shortString = str.slice(0, 25) + '...'
      return shortString
    } else {
      return str
    }
  }

  renderActiveShape = props => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, value, showInstanceCount } = props

    let { name } = props
    name = this.truncateString(name)

    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 5) * cos
    const sy = cy + (outerRadius + 5) * sin
    const mx = cx + (outerRadius + 10) * cos
    const my = cy + (outerRadius + 10) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 2}
          outerRadius={outerRadius + 4}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={Wings.TEXT_COLOR}>
          {name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={Wings.TEXT_COLOR}>
          {showInstanceCount && `${value} instance${Utils.pluralize(value)}`}
        </text>
      </g>
    )
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index
    })
  }

  onPieLeave = (data, index) => {
    this.setState({
      activeIndex: -1
    })
  }

  render = () => {
    const { pieChartProps, pieProps } = this.props
    let showInstanceCount = true
    let dataToDisplay = null

    // If there is no data, create dummy data to allow the chart to display 1 segment,
    // but hide the instances count label.
    if (!pieProps.data || pieProps.data.length === 0) {
      const dummyData = {}
      dummyData[pieProps.nameKey] = 'no active instances'
      dummyData[pieProps.dataKey] = 1
      dataToDisplay = [dummyData]
      showInstanceCount = false
    } else {
      dataToDisplay = pieProps.data
    }

    const extraPieProps = {
      data: dataToDisplay,
      activeIndex: this.state.activeIndex,
      activeShape: this.renderActiveShape
    }

    return (
      <div className={css.main}>
        <PieChart {...pieChartProps}>
          <Pie {...pieProps} {...extraPieProps}>
            {dataToDisplay.map((entry, index) => (
              <Cell
                showInstanceCount={showInstanceCount}
                key={index}
                fill={pieProps.colors[index % pieProps.colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/DonutChart/DonutChart.js