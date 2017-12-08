import React from 'react'
import css from './ConfigTableView.css'
import { TooltipOverlay } from 'components'
import { Utils } from 'components'
import apis from 'apis/apis'

export default class ConfigTableView extends React.Component {
  downloadFile = (e, config) => {
    e.preventDefault()
    Utils.downloadFile(apis.getConfigDownloadUrl(Utils.appIdFromUrl(), config.uuid), config.fileName)
  }

  isDocker = () => {
    const service = Utils.getJsonValue(this, 'props.serviceData') || {}
    return service.artifactType ? service.artifactType === 'DOCKER' : false
  }

  returnRow = item => (
    <div key={item.uuid} className="key-value-row">
      <span className="key"> {item.name} </span>
      <span className="value">{Utils.getValueForConfig(item)}</span>
      <span className="action-icons">
        <i className="icons8-pencil-tip" title="Edit" onClick={this.props.onEditConfigVarClick.bind(this, item)} />
        <i className="icons8-delete" title="Delete" onClick={this.props.onDeleteConfigVarClick.bind(this, item.uuid)} />
      </span>
    </div>
  )

  returnHeader = headerProps => (
    <header>
      <title>{headerProps.title}</title>
      <span className="action-button wings-text-link">
        <span className="action-button-items" onClick={headerProps.onClick.bind(this, null)}>
          <i className="icons8-plus-math action-button-item" />
          <span className="action-button-item">{headerProps.buttonLabel}</span>
        </span>
      </span>
    </header>
  )

  getRelativeFilePath = item => {
    return item.encrypted ? item.secretFileName : item.relativeFilePath
  }

  renderConfigFiles () {
    const configHeader = {
      title: 'Config Files',
      onClick: this.props.onAdd,
      buttonLabel: 'Add File'
    }

    if (this.isDocker()) {
      return
    }

    return (
      <div className="sub-section">
        {this.returnHeader(configHeader)}

        {this.props.configFiles.map(item => (
          <div key={item.uuid} className="key-value-row">
            <span className="key">{item.relativeFilePath}</span>
            <span className="action-icons">
              <i
                className="icons8-checked"
                title="Manage Version"
                onClick={this.props.onManageVersion.bind(this, item)}
              />
              {!item.encrypted && (
                <i className="icons8-installing-updates-2" title="Download" onClick={e => this.downloadFile(e, item)} />
              )}
              <i className="icons8-pencil-tip" title="Edit" onClick={this.props.onEdit.bind(this, item)} />
              <i className="icons8-delete" title="Delete" onClick={this.props.onDelete.bind(this, item.uuid)} />
            </span>
          </div>
        ))}
      </div>
    )
  }

  renderConfigVars () {
    const configHeader = {
      title: 'Config Variables',
      onClick: this.props.onAddConfigVarClick,
      buttonLabel: 'Add Variable'
    }

    return (
      <div className="sub-section">
        {this.returnHeader(configHeader)}
        {this.props.configVars.map(
          item =>
            item.type === 'ENCRYPTED_TEXT' ? (
              <TooltipOverlay placement="left" tooltip="This field is encrypted.">
                {this.returnRow(item)}
              </TooltipOverlay>
            ) : (
              this.returnRow(item)
            )
        )}
      </div>
    )
  }

  render () {
    return (
      <div className={`wings-card ${css.main}`}>
        <div className="box-header with-border">
          <div className="wings-card-header">
            <div>Configuration</div>
          </div>
          <div className="wings-card-actions">
            <span>
              <i className="icons8-past-2" onClick={this.props.onHistoryClick} />
            </span>
          </div>
        </div>

        <div className="body">
          {this.renderConfigVars()}
          {this.renderConfigFiles()}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ConfigPage/views/ConfigTableView.js