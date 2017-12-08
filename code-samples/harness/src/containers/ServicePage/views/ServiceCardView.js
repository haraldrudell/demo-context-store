import React from 'react'
import { Utils, ArtifactSources, ActionButtons, TruncateText } from 'components'
import apis from 'apis/apis'
import css from './ServiceCardView.css'
import SetupAsCodePanel from '../../SetupAsCode/SetupAsCodePanel.js'
import { Popover, Position } from '@blueprintjs/core'

export default class ServiceCardView extends React.Component {
  state = {
    showArtifactStreamModal: false,
    artifactStreamData: null
  }

  downloadFile = (e, config) => {
    e.preventDefault()
    Utils.downloadFile(apis.getConfigDownloadUrl(Utils.appIdFromUrl(), config.uuid), config.fileName)
  }

  onArtifactStreamAddEdit = data => this.setState({ showArtifactStreamModal: true, artifactStreamData: data })

  renderActionButtons = ({ item }) => {
    const selectId = item.uuid
    const setUpAsCode = (
      <Popover
        position={Position.LEFT_TOP}
        useSmartArrowPositioning={true}
        content={<SetupAsCodePanel {...this.props} selectId={selectId} />}
      >
        <i className="icons8-source-code" />
      </Popover>
    )
    const buttons = {
      cloneFunc: this.props.params.onClone.bind(this, item),
      deleteFunc: this.props.params.onDelete.bind(this, item.uuid)
    }

    return (
      <action-buttons>
        <ui-card-actions>
          {setUpAsCode}
          <ActionButtons buttons={buttons} />
        </ui-card-actions>
      </action-buttons>
    )
  }

  renderKvPairs = ({ service, artifactTypeName }) => {
    const params = {
      onArtifactStreamAddEdit: this.onArtifactStreamAddEdit,
      redirectToServiceDetail: this.props.params.redirectToServiceDetail,
      accountId: this.props.params.accountId,
      appId: this.props.params.appId
    }

    return (
      <kv-pairs>
        <kv-pair>
          <kv-pair-key>Artifact Type </kv-pair-key>
          <kv-pair-value>{artifactTypeName}</kv-pair-value>
        </kv-pair>
        <kv-pair>
          <kv-pair-key>Artifact Source </kv-pair-key>
          <kv-pair-value>
            <ArtifactSources
              artifactStreams={service.artifactStreams}
              isDetailPage={false}
              params={params}
              serviceId={service.uuid}
            />
          </kv-pair-value>
        </kv-pair>
        <kv-pair>
          <kv-pair-key>Commands</kv-pair-key>
          <kv-pair-value>
            <service-commands>
              {service.serviceCommands.map(cmd => {
                return (
                  <service-command
                    class="__pill link-style"
                    key={cmd.name}
                    onClick={this.props.params.onCommandClick.bind(this, service, cmd.name)}
                  >
                    <TruncateText inputText={cmd.name} />
                  </service-command>
                )
              })}
            </service-commands>
          </kv-pair-value>
        </kv-pair>
      </kv-pairs>
    )
  }

  render = () => (
    <div className={` ${css.main}`}>
      {this.props.params.data.length > 0 &&
        this.props.params.data.map(service => {
          const artifactTypeName = Utils.getCatalogDisplayText(
            this.props.params.catalogs,
            'ARTIFACT_TYPE',
            service.artifactType
          )

          return (
            <ui-card key={service.uuid} data-name={service.name}>
              <header>
                <card-title>
                  <item-name class="link-style" onClick={this.props.params.onNameClick.bind(this, service)}>
                    {service.name}
                  </item-name>
                  <item-description>{service.description}</item-description>
                </card-title>
                {this.renderActionButtons({ item: service })}
              </header>
              <main>{this.renderKvPairs({ service, artifactTypeName })}</main>
            </ui-card>
          )
        })}
    </div>
  )
}



// WEBPACK FOOTER //
// ../src/containers/ServicePage/views/ServiceCardView.js