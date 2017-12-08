import React from 'react'
import ReactDataGrid from 'react-data-grid'
import TimeAgo from 'react-timeago'
import Utils from '../Utils/Utils'
import CompUtils from '../Utils/CompUtils'

import { ArtifactService } from 'services'
import css from './ArtifactHistoryTable.css'

class ArtifactHistoryTable extends React.Component {
  state = {
    artifacts: [],
    isLoading: false
  }

  async componentDidMount () {
    await this.fetchData()
  }

  async fetchData () {
    await CompUtils.setComponentState(this, { isLoading: true })
    const { appId, serviceId } = this.props.urlParams
    const { artifacts } = await ArtifactService.fetchArtifacts(appId, null, [serviceId])
    await CompUtils.setComponentState(this, { isLoading: false, artifacts })
  }

  onRefreshClick = async () => {
    await this.fetchData()
  }

  render () {
    const { artifacts } = this.state

    const BuildNoFormatter = props => {
      const data = props.dependentValues
      const buildNo = Utils.getJsonValue(data, 'metadata.buildNo') || ''
      return <span>{buildNo ? 'build# ' + buildNo : ''}</span>
    }
    const TimeFormatter = props => {
      return <TimeAgo date={props.value} title={Utils.formatDate(props.value)} minPeriod={30} />
    }

    const _columns = [
      // { key: 'uuid', name: 'uuid' },
      { key: 'artifactSourceName', name: 'Artifact' },
      { key: 'metadata', name: 'Build', formatter: BuildNoFormatter, getRowMetaData: row => row },
      { key: 'createdAt', name: 'Time', formatter: TimeFormatter },
      { key: 'status', name: 'Status' }
    ]

    return (
      <div className={css.main}>
        <div className={css.header}>
          <h3>Artifact History</h3>
          {this.state.isLoading && <span className="wings-spinner icon" />}
          <button className="icons8-refresh" onClick={this.onRefreshClick} />
        </div>

        {artifacts.length > 0 ? (
          <ReactDataGrid
            columns={_columns}
            rowGetter={i => artifacts[i]}
            rowsCount={artifacts.length}
            minHeight={500}
          />
        ) : (
          <div className={css.noData}>There are no artifacts available.</div>
        )}
      </div>
    )
  }
}

export default ArtifactHistoryTable



// WEBPACK FOOTER //
// ../src/components/ArtifactHistoryTable/ArtifactHistoryTable.js