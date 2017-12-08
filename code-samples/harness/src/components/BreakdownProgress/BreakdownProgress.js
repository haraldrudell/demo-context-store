import React from 'react'
import css from './BreakdownProgress.css'

class BreakdownProgress extends React.Component {
  render () {
    const pct = (num) => Math.min(num, 100)
    const fullWidthPct = 100
    const donePct = pct(this.props.progress.donePct)
    const failedPct = pct(this.props.progress.failedPct)
    const runningPct = pct(this.props.progress.runningPct)
    const sum = Math.round(donePct + failedPct + runningPct)

    // let baseBarCss = { width: fullWidthPct + '%', height: '2px', backgroundColor: '#eee' }
    // if (this.props.status === 'RUNNING') {
    const baseBarCss = { width: fullWidthPct + '%', height: '2px',
      borderStyle: 'dashed', borderColor: '#eee', borderWidth: '1px' }
    // }

    return (
      <div className={`${css.main} ${this.props.className} __progressBar`}>
        <div className="baseProgressBar" style={baseBarCss}></div>
        <div className="progressBar" style={{ width: donePct + '%', height: '2px', backgroundColor: '#5ebc86',
          marginTop: '-2px', float: 'left' }}></div>
        <div className="progressBar" style={{ width: failedPct + '%', height: '2px', backgroundColor: '#ef6e74',
          marginTop: '-2px', float: 'left' }}></div>
        <div className="progressBar" style={{ width: runningPct + '%', height: '2px', backgroundColor: '#fd9941',
          marginTop: '-2px', float: 'left' }}>
          {this.props.hidePct || isNaN(sum) || sum === 0 || sum === 100 ? null : (
            <span style={{ float: 'right', color: '#3a4449', width: '30px', fontSize: '0.9em', paddingTop: '3px' }}>
              {sum} %
            </span>
          )}
        </div>
      </div>
    )
  }
}

export default BreakdownProgress



// WEBPACK FOOTER //
// ../src/components/BreakdownProgress/BreakdownProgress.js