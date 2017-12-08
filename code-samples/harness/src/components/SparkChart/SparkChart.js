import React, { PropTypes } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import css from './SparkChart.css'
import moment from 'moment'

export default class SparkChart extends React.Component {
  state = { msg: 'Loading' }
  data = []
  dataField = null
  max = 1
  tooltipDataElement = null

  static propTypes = {
    data: PropTypes.array.isRequired,
    dataField: PropTypes.string.isRequired,
    activeElement: PropTypes.number,
    selectedElement: PropTypes.number,
    setActive: PropTypes.func,
    setSelectedActive: PropTypes.func,
    onDateClick: PropTypes.func
  }

  static defaultProps = {
    activeElement: 0,
    selectedElement: 0,
    setActive: d => {},
    setSelectedActive: d => {},
    onDateClick: d => {}
  }

  componentWillMount () {
    this.initData(this.props)
  }

  componentWillReceiveProps (newProps) {
    if (newProps && newProps.data) {
      this.initData(newProps)
    } else {
      this.setState({ msg: 'No Recent Deployments' })
    }
  }

  initData (props) {
    this.max = 1
    this.data = props.data
    this.dataField = props.dataField
    if (Array.isArray(props.data) && props.data.length > 0) {
      let dataToUseToSetChartHeight = 'totalCount'

      switch (this.dataField) {
        case 'totalCount':
          dataToUseToSetChartHeight = 'totalCount'
          break
        case 'failedCount':
          dataToUseToSetChartHeight = 'totalCount'
          break
        case 'instancesCount':
          dataToUseToSetChartHeight = 'instancesCount'
          break
      }

      this.data.map(d => {
        this.max = Math.max(d[dataToUseToSetChartHeight], this.max)
      })
    }
    this.setState({ msg: null, __update: Date.now() })
  }

  formatDate = dataElement => {
    return moment(dataElement.date).format('MMM Do')
  }

  onMoreClick = (e, dataElement) => {
    this.setState({ showToolTip: false, target: null })
    this.props.onDateClick(dataElement)
  }

  onClick = (e, dataElement) => {
    this.props.onDateClick(dataElement)
  }

  onOverlayExited = e => {
    this.props.setSelectedActive(0)
  }

  onMouseOver = (e, dataElement) => {
    this.props.setActive(dataElement)
  }

  onMouseOut = e => {
    setTimeout(() => {
      this.props.setActive(0)
    }, 500)
  }

  toolTip = dataElement => (
    <Tooltip id="tooltip">{`${this.formatDate(dataElement)}:
     ${dataElement[this.dataField]}`}</Tooltip>
  )

  render () {
    if (!this.data || this.data.length <= 0) {
      const dummyData = Array.from(Array(30).keys())
      return (
        <div className={`${css.main}`}>
          <div className="container vertical rounded">
            {dummyData.map((item, idx) => (
              <div key={idx} className={'progress-bar'}>
                <div className="progress-track" />
              </div>
            ))}
          </div>
        </div>
      )
    }
    return (
      <div className={css.main} onMouseLeave={this.onMouseOut}>
        <div className="container vertical rounded">
          {this.data.map(item => {
            const percent = item[this.dataField] / this.max * 100
            const className =
              this.props.activeElement === item.date || this.props.selectedElement === item.date ? 'active' : ''
            return (
              <OverlayTrigger key={item.date} placement="top" overlay={this.toolTip(item)}>
                <div
                  className={`progress-bar ${item.date} ${className}`}
                  onClick={e => this.onClick(e, item)}
                  onMouseOver={e => this.onMouseOver(e, item)}
                >
                  <div className="progress-track">
                    <div className={'progress-fill ' + this.dataField} style={{ height: percent + '%' }} />
                  </div>
                </div>
              </OverlayTrigger>
            )
          })}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/SparkChart/SparkChart.js