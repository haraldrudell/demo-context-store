import React from 'react'
import ReactDOM from 'react-dom'
import { Button, ButtonGroup } from 'react-bootstrap'
import { TooltipOverlay } from 'components'

const ICONS = {
  baseline: 'Icon_Event_Grey',
  anticipated: 'Icon_Event_Blue',
  unexpected: 'Icon_Unexpected_#',
  unknown: 'Icon_Unknown_#',
  unrecognized: 'Icon_Unknown_#'
}

const LABELS = {
  baseline: 'Baseline Event',
  anticipated: 'Anticipated Event',
  unexpected: 'Unexpected Frequency',
  unknown: 'Unknown Event',
  unrecognized: 'Unrecognized Event'
}

export default class SplunkEventsTable extends React.Component {
  getEventType (cluster) {
    return (
      cluster &&
      (cluster.baseline
        ? 'baseline'
        : cluster.anticipated
          ? 'anticipated'
          : cluster.unexpected ? 'unexpected' : cluster.unknown ? 'unknown' : 'unrecognized')
    )
  }

  componentDidUpdate () {
    const node = ReactDOM.findDOMNode(this)

    if (this.props.selected) {
      node.scrollTop = 0
    }

    if (node.hasChildNodes() && node.childNodes[0].hasChildNodes()) {
      node.childNodes[0].childNodes[0].scrollTop = 0
    }
  }

  renderClusterItem = (clusterData, i) => {
    const clusterType = this.getEventType(clusterData)
    const clusterLabel = LABELS[clusterType]
    const clusterIcon = ICONS[clusterType].replace('#', this.props.suspicious ? 'Orange' : 'Red')

    clusterData.logText = clusterData.logText || '( Empty Log )'
    const heading = clusterData.logText.substr(20, 256).split('\n')[0]
    const date = clusterData.logText.substr(0, 20)
    const details = clusterData.logText.substr(20 + heading.length)

    const isExpanded = !!this.props.selected || clusterData.isExpanded
    const buttonIcon = isExpanded ? 'up' : 'down'
    const detailsClass = isExpanded ? ' expanded' : ''
    const { selected } = this.props
    const { cluster } = clusterData
    const riskLevel = selected ? cluster.riskLevel : clusterData.riskLevel

    return (
      <li className="event-cluster-item" key={i} data-name="event-cluster-item">
        <section className="event-cluster-info">
          <div className="event-cluster-type">
            <img src={`/img/workflow/splunk/${clusterIcon}.png`} />
          </div>
          <h6 className="event-cluster-heading">
            {!(clusterData.unknown || clusterData.unexpected) &&
              <strong>
                {clusterLabel}
              </strong>}

            {(clusterData.unknown || clusterData.unexpected) &&
              <strong>
                {clusterLabel} {`(Risk: ${riskLevel})`}
              </strong>}

            <ButtonGroup style={{ float: 'right' }}>
              {(clusterData.unknown || clusterData.unexpected) &&
                <TooltipOverlay tooltip="Temporarily bypass this warning" delay={1400}>
                  <Button bsStyle="link" onClick={() => this.ignoreEventDetails(clusterData)}>
                    Ignore
                  </Button>
                </TooltipOverlay>}
              {(clusterData.unknown || clusterData.unexpected) &&
                <TooltipOverlay tooltip="Prevent from appearing in future" delay={1400}>
                  <Button bsStyle="link" onClick={() => this.dismissEventDetails(clusterData)}>
                    Dismiss
                  </Button>
                </TooltipOverlay>}
              <Button bsStyle="link" onClick={() => this.toggleEventDetails(clusterData)}>
                <span className={'glyphicon glyphicon-menu-' + buttonIcon} />
              </Button>
            </ButtonGroup>
          </h6>
        </section>
        <section className="event-cluster-details-container">
          <pre className={'event-cluster-details' + detailsClass}>
            hosts: {clusterData.hosts} <br />
            {date} <strong>{heading}</strong>
            {details}
          </pre>
        </section>
      </li>
    )
  }

  render () {
    return (
      <div className="event-cluster-table" data-name="event-cluster-table">
        <ol className="event-cluster-list">
          {this.props.selected
            ? this.renderClusterItem(this.props.selected)
            : this.props.clusters.map(this.renderClusterItem)}
        </ol>
      </div>
    )
  }

  clearSelectedEvent = () => {
    this.props.onClear && this.props.onClear()
    this.props.clusters.forEach(c => (c.isExpanded = false))
  }

  toggleEventDetails = clusterData => {
    clusterData.isExpanded = !clusterData.isExpanded
    if (this.props.selected) {
      this.clearSelectedEvent()
    } else {
      this.forceUpdate()
    }
  }

  ignoreEventDetails = clusterData => {
    // TODO To be implemented
  }

  dismissEventDetails = clusterData => {
    // TODO To be implemented
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/SplunkEventsTable.js