import React from 'react'
import css from './EnvironmentCardView.css'
import { ActionButtons } from 'components'
import SetupAsCodePanel from '../../SetupAsCode/SetupAsCodePanel.js'
import { Popover, Position } from '@blueprintjs/core'

export default class EnvironmentCardView extends React.Component {
  // onServiceTemplateNameClick = (serviceTemplate, env) => {
  //   Utils.redirect({ appId: env.appId, envId: env.uuid, serviceTemplateId: serviceTemplate.uuid, page: 'detail' })
  // }

  getComputeProviderName = computeProviderSettingId => {
    const obj = this.props.params.objComputeProviders
    return obj[computeProviderSettingId] ? obj[computeProviderSettingId].name : null
  }

  getInfrastructureMappings (env, limit = 2) {
    const __objInfraServiceMap = {}

    if (Array.isArray(env.serviceTemplates)) {
      env.serviceTemplates.forEach(st => {
        st.infrastructureMappings.forEach(im => {
          if (!__objInfraServiceMap[im.computeProviderSettingId]) {
            __objInfraServiceMap[im.computeProviderSettingId] = []
          }
          __objInfraServiceMap[im.computeProviderSettingId].push(st.name)
        })
      })
    }
    const __length = Object.keys(__objInfraServiceMap).length

    if (__length <= 0) {
      return (
        <span className="__orange">
          <i className="icons8-error-filled" />&nbsp;Setup Required
        </span>
      )
    }

    const __keys = Object.keys(__objInfraServiceMap).slice(0, limit)

    return (
      <span>
        {__keys.map((imUuid, index) => (
          <span key={index}>
            <span>{this.getComputeProviderName(imUuid)}</span>
            &nbsp; ({__objInfraServiceMap[imUuid].map((service, stindx) => (
              <span key={stindx}>
                <span className="wings-text-link" onClick={this.props.params.onNameClick.bind(this, env)}>
                  {service}
                </span>
                {stindx < __objInfraServiceMap[imUuid].length - 1 ? ', ' : ''}
              </span>
            ))})
            {index < __keys.length - 1 ? ', ' : ''}
          </span>
        ))}
        {__keys.length < __length ? ` and ${__length - __keys.length} more` : ''}
      </span>
    )
  }

  getServiceTemplateConfigs = env => {
    return (
      <span>
        {env.serviceTemplates.map((item, index) => (
          <span key={item.uuid}>
            <span className="wings-text-link" onClick={this.props.params.onNameClick.bind(this, env)}>
              {item.name}
            </span>
            <span className="__lightText"> ({item.configFiles.length})</span>
            {index < env.serviceTemplates.length - 1 ? ', ' : ''}
          </span>
        ))}
      </span>
    )
  }

  renderActionButtons = ({ item }) => {
    const selectId = item.uuid
    const buttons = {
      cloneFunc: this.props.params.onClone.bind(this, item),
      deleteFunc: this.props.params.onDelete.bind(this, item.uuid)
    }

    const setUpAsCode = (
      <Popover
        position={Position.LEFT_TOP}
        useSmartArrowPositioning={true}
        content={<SetupAsCodePanel {...this.props} selectId={selectId} />}
      >
        <i className="icons8-source-code" />
      </Popover>
    )

    return (
      <action-buttons>
        <ui-card-actions>
          {setUpAsCode}
          <ActionButtons buttons={buttons} />
        </ui-card-actions>
      </action-buttons>
    )
  }

  renderKvPairs = item => (
    <kv-pairs>
      <kv-pair>
        <kv-pair-key>Type</kv-pair-key>
        <kv-pair-value>
          <span className="wings-text-link" onClick={this.props.params.onNameClick.bind(this, item)}>
            {item.environmentType}
          </span>
        </kv-pair-value>
      </kv-pair>
      <kv-pair>
        <kv-pair-key>Service Infrastructure</kv-pair-key>
        <kv-pair-value>{this.getInfrastructureMappings(item)}</kv-pair-value>
      </kv-pair>
    </kv-pairs>
  )

  render = () => (
    <div className={css.main + ' row wings-card-row'}>
      {this.props.params.data.map(item => (
        <ui-card key={item.uuid} data-name={item.name}>
          <header>
            <card-title>
              <item-name
                class={`wings-text-link ${item.environmentType}`}
                onClick={this.props.params.onNameClick.bind(this, item)}
              >
                {item.name}
              </item-name>
              <item-description data-name="environment-description">{item.description}</item-description>
            </card-title>

            {this.renderActionButtons({ item })}
          </header>
          <main>{this.renderKvPairs(item)}</main>
        </ui-card>
      ))}
    </div>
  )
}



// WEBPACK FOOTER //
// ../src/containers/EnvironmentPage/views/EnvironmentCardView.js