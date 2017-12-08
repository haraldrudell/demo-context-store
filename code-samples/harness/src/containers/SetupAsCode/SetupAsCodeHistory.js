import React from 'react'
import { Table } from 'react-bootstrap'
import { Utils } from 'components'
import { SetupAsCodeService } from 'services'
import css from './SetupAsCodeHistory.css'

class SetupAsCodeHistory extends React.Component {
  state = {
    versions: []
  }

  async componentWillMount () {
    const { accountId } = this.props.urlParams
    const { selectedNode, entityId } = this.props
    // TODO: use correct "type"
    const { versions } = await SetupAsCodeService.getVersions({
      accountId,
      entityId: entityId,
      // type: 'SERVICE'
      type: selectedNode.yamlVersionType
    })
    this.setState({ versions })
  }

  onSelect = verData => {
    this.props.onSelect(verData)
  }

  render () {
    // const versions = [{ version: 5, time: 123344 }, { version: 6, time: 123344 }]
    const versions = this.state.versions || []
    const selectedVersion = 6 // TODO: TBD
    return (
      <section className={css.main}>
        <Table responsive>
          <thead>
            <tr>
              <th>Version #</th>
              <th>Timestamp</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {versions.map(ver => {
              const selectedClass = ver.version === selectedVersion ? css.selected : ''
              return (
                <tr key={ver.version} className={selectedClass}>
                  <td>{ver.version}</td>
                  <td>{Utils.formatDate(ver.inEffectStart)}</td>
                  <td>
                    <span className="wings-text-link" onClick={() => this.onSelect(ver)}>
                      Load
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </section>
    )
  }
}

export default SetupAsCodeHistory



// WEBPACK FOOTER //
// ../src/containers/SetupAsCode/SetupAsCodeHistory.js