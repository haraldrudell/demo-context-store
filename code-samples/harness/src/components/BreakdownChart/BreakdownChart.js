import React from 'react'
import css from './BreakdownChart.css'

function getCoordinatesForPercent (percent) {
  const x = Math.cos(2 * Math.PI * percent)
  const y = Math.sin(2 * Math.PI * percent)
  return [x, y]
}

function renderDefs (id, status, icon) {
  status = status.toLowerCase()

  return (
    <defs>
      <mask id={`breakdown-chart-mask-${id}`}>
        <circle cx="0" cy="0" r="50%" fill="white" />
        <circle cx="0" cy="0" r="35%" fill="black" />
      </mask>
    </defs>
  )
}

export default function BreakdownChart ({ status, icon, breakdown, title, width = 90, height = 90, onClick }) {
  let cumulativePercent = 0.3 / 2 + 0.2 // .2 for transparent pie
  const id = +new Date()

  return (
    <svg className={css.main} viewBox="-1 -1 2 2" width={width} height={height} onClick={onClick}>
      <title>{title}</title>
      {renderDefs(id, status, icon)}
      {breakdown &&
        breakdown.map((slice, index) => {
          const [startX, startY] = getCoordinatesForPercent(cumulativePercent)
          const percent = slice.count / slice.total * 0.8 // subtract .2 for transparent pie

          cumulativePercent += percent

          const [endX, endY] = getCoordinatesForPercent(cumulativePercent)

          // if the slice is more than 50%, take the large arc (the long way around)
          const largeArcFlag = percent > 0.5 ? 1 : 0

          const pathData = [
            `M ${startX} ${startY}`, // Move
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
            'L 0 0' // Line
          ].join(' ')

          return (
            <path key={index + 1} d={pathData} fill={slice.color} mask={`url(#breakdown-chart-mask-${id})`}>
              <title>{slice.title}</title>
            </path>
          )
        })}
    </svg>
  )
}



// WEBPACK FOOTER //
// ../src/components/BreakdownChart/BreakdownChart.js