import React from 'react'
import { WindowEventHandler } from 'components'
import Plotly from 'plotly.js/dist/plotly-cartesian'
import createPlotlyComponent from 'react-plotlyjs'

const PlotlyComponent = createPlotlyComponent(Plotly)

const SCALE = 100

const LINE_COLORS = {
  baseline: '#C5CACC',
  anticipated: '#43c5ff',
  anomalous: '#FF7B7B',
  suspicious: '#FFCC7B'
}

const FILL_COLORS = {
  baseline: '#939698',
  anticipated: '#30a2d6',
  anomalous: '#F72F2F',
  suspicious: '#FF9D00'
}

const OPACITIES = {
  baseline: 0.4,
  anticipated: 0.3,
  anomalous: 0.2,
  suspicious: 0.3
}

export default class SplunkChart extends React.Component {

  getEventType (selected) {
    return selected && (
      (selected.baseline) ? 'baseline'
        : (selected.anticipated) ? 'anticipated'
          : (this.props.suspicious) ? 'suspicious' : 'anomalous'
    )
  }

  formatDataSetForPlotly (set) {
    if (!set) {
      return
    }
    const result = { x: [], y: [], text: [], customdata: [] }
    set.forEach( point => {
      if (!point || !point.logText) {
        return
      }
      const lines = point.logText.substr(20, 512).split('\n')
      const heading = '<b>' + lines[0].substr(0, 60) + '</b>'
      const subheading = lines[1] || lines[0].substr(heading.length) || ''

      result.x.push(+point.x * SCALE)
      result.y.push(+point.y * SCALE)
      result.text.push(heading + '<br>' + subheading.substr(0, heading.length - 10) + '...' )
      result.customdata.push(point)
    })
    return result
  }

  newPlot (options) {
    if (options.dataset) {
      if (!options.x) {
        options.x = options.dataset.x
      }
      if (!options.y) {
        options.y = options.dataset.y
      }
      if (!options.text) {
        options.text = options.dataset.text
      }
      if (!options.customdata) {
        options.customdata = options.dataset.customdata
      }
    }
    options.type = options.type || 'scatter'
    options.mode = options.mode || 'markers'
    options.hoverinfo = options.hoverinfo || 'text'
    options.textposition = options.textposition || 'bottom center'
    options.hoverlabel = options.hoverlabel || {
      font: {
        family: 'Source Sans Pro',
        size: 14
      }
    }

    if (!options.marker) {
      options.marker = {}
    }

    options.marker.size = options.marker.size || 13

    options.marker.line = options.marker.line || {}

    options.marker.line.width = options.marker.line.width || 2

    return options
  }

  componentDidMount () {
    document.addEventListener('node-details-toggle-fullscreen', this.onResize)
    document.addEventListener('split-view:stop', this.onResize)
  }

  componentWillUnmount () {
    document.removeEventListener('node-details-toggle-fullscreen', this.onResize)
    document.removeEventListener('split-view:stop', this.onResize)
  }

  shouldComponentUpdate (nextProps, nextState) {

    if (!this.plotlyChart || this.props.isCollapsed !== nextProps.isCollapsed) {
      return true
    }

    if (this.props.selected !== nextProps.selected) {
      Plotly.deleteTraces(this.plotlyChart.container, 0)

      const selected = nextProps.selected

      const selectedType = this.getEventType(selected)

      const plot = this.newPlot({
        name: 'Selected',
        dataset: selected && this.formatDataSetForPlotly([selected]) || [],
        marker: {
          opacity: OPACITIES[selectedType],
          size: 50,
          color: FILL_COLORS[selectedType]
        }
      })

      Plotly.addTraces(this.plotlyChart.container, plot, 0)
    }

    if (nextProps.filters !== this.props.filters) {
      const showBaseline = nextProps.filters.baseline
      const showAnticipated = nextProps.filters.anticipated
      const showUnknown = nextProps.filters.unknown
      const showUnexpected = nextProps.filters.unexpected

      if (showBaseline !== this.props.filters.baseline) {
        Plotly.restyle(this.plotlyChart.container, { opacity: (showBaseline) ? 1 : 0 }, 1)
      } else if (showAnticipated !== this.props.filters.anticipated) {
        Plotly.restyle(this.plotlyChart.container, { opacity: (showAnticipated) ? 1 : 0 }, 2)
      } else if (showUnknown !== this.props.filters.unknown) {
        Plotly.restyle(this.plotlyChart.container, { opacity: (showUnknown) ? 1 : 0 }, 3)
      } else if (showUnexpected !== this.props.filters.unexpected) {
        Plotly.restyle(this.plotlyChart.container, { opacity: (showUnexpected) ? 1 : 0 }, 4)
      }

    }
    return false
  }

  render () {
    const baselineDataset = this.props.data.baseline
    const anticipatedDataset = this.props.data.anticipated
    const unknownDataset = this.props.data.unknown
    const unexpectedDataset = this.props.data.unexpected

    const filters = this.props.filters
    const showBaseline = filters.baseline
    const showAnticipated = filters.anticipated
    const showUnknown = filters.unknown
    const showUnexpected = filters.unexpected

    const selected = this.props.selected

    const selectedType = this.getEventType(selected)

    const plots = [
      this.newPlot({
        name: 'Selected',
        dataset: selected && this.formatDataSetForPlotly([selected]) || [],
        marker: {
          opacity: OPACITIES[selectedType],
          size: 50,
          color: FILL_COLORS[selectedType]
        }
      }),
      this.newPlot({
        name: 'Baseline',
        visible: showBaseline,
        dataset: this.formatDataSetForPlotly(baselineDataset),
        marker: {
          color: FILL_COLORS.baseline,
          line: {
            color: LINE_COLORS.baseline
          }
        }
      }),
      this.newPlot({
        name: 'Anticipated',
        visible: showAnticipated,
        dataset: this.formatDataSetForPlotly(anticipatedDataset),
        marker: {
          color: FILL_COLORS.anticipated,
          line: {
            color: LINE_COLORS.anticipated
          }
        }
      }),
      this.newPlot({
        name: 'Unknown',
        visible: showUnknown,
        dataset: this.formatDataSetForPlotly(unknownDataset),
        marker: {
          size: 19,
          color: FILL_COLORS[ (this.props.suspicious) ? 'suspicious' : 'anomalous'],
          line: {
            color: LINE_COLORS[ (this.props.suspicious) ? 'suspicious' : 'anomalous']
          }
        }
      }),
      this.newPlot({
        name: 'Unexpected Frequency',
        visible: showUnexpected,
        dataset: this.formatDataSetForPlotly(unexpectedDataset),
        marker: {
          size: 19,
          color: FILL_COLORS[ (this.props.suspicious) ? 'suspicious' : 'anomalous'],
          line: {
            color: LINE_COLORS[ (this.props.suspicious) ? 'suspicious' : 'anomalous']
          }
        }
      })
    ]

    const layout = {
      height: 280,
      autosize: true,
      hovermode: 'closest',
      'plot_bgcolor': 'transparent',
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
      },
      legend: {
        orientation: 'h'
      },
      showlegend: false,
      // dragmode: 'pan',
      xaxis: {
        range: [-80, 80],
        showticklabels: false,
        zeroline: false,
        axistext: 'none',
        gridcolor: '#64696e',
        gridwidth: 1
      },
      yaxis: {
        range: [-85, 85],
        showticklabels: false,
        zeroline: false,
        axistext: 'none',
        gridcolor: '#64696e',
        gridwidth: 1
      }
    }

    const config = {
      showLink: false,
      displayModeBar: false,
      scrollZoom: false
    }


    return (
      <div className="splunk-chart" onClick={this.onClickChartPoint}>
        <WindowEventHandler handleResize={this.onResize} />
        <PlotlyComponent ref={r => this.plotlyChart = r} className="plotly-chart"
          data={plots} layout={layout} config={config}
          onClick={this.onClickChartPoint} />

      </div>
    )
  }

  onResize = () => {
    if (this.plotlyChart) {
      this.plotlyChart.resize()
    }
  }

  onClickChartPoint = (data) => {
    this.props.selectPoint && this.props.selectPoint(data)
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/SplunkChart.js