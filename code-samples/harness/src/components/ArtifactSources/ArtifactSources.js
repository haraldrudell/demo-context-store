import React from 'react'
import css from './ArtifactSources.css'
import { TruncateText } from '../TruncateText/TruncateText'

export default class ArtifactSources extends React.Component {
  renderArtifactSourceName = data => {
    let infoClass
    if (this.props.isDetailPage) {
      infoClass = 'wings-text-link pointer'
    } else if (this.props.showEditAction) {
      infoClass = 'autoTriggerText'
    } else {
      infoClass = 'wings-text-link pointer'
    }
    const handleClick = () => {
      if (this.props.isDetailPage) {
        //  From the detail page, show modal on click
        return this.props.params.onArtifactStreamAddEdit.bind(this, data)
      } else if (!this.props.isDetailPage && !this.props.showEditAction) {
        //  From the card view page, redirect and show modal on click
        return this.props.params.redirectToServiceDetail.bind(this, data)
      }
    }

    return (
      <artifact-source-name class={`${infoClass} `} onClick={handleClick()}>
        <TruncateText inputText={data.sourceName} />
      </artifact-source-name>
    )
  }

  renderArtifactActions = data => {
    if (this.props.isDetailPage) {
      return (
        <action-icons>
          <edit-icon class="harness-icon" onClick={this.props.params.onArtifactStreamAddEdit.bind(this, data)} />
          <delete-icon
            class="harness-icon"
            onClick={event => {
              this.props.params.onDeleteArtifact.call(this, data)
            }}
          />
        </action-icons>
      )
    } else if (this.props.showEditAction) {
      return (
        <edit-icon
          class="harness-icon"
          onClick={() => this.props.params.onArtifactStreamAddEdit.call(this, data, this.props.service)}
        />
      )
    }
  }

  renderMoreButton = () => {
    const artifactSourceCls = `wings-text-link __artifact-add-button ${addCls}`
    const addCls =
      this.props.hasOwnProperty('appStackCls') && this.props.appStackCls === '__hide' ? 'dockerCls' : 'non-dockerCls'
    if (this.props.isDetailPage && !this.props.hideAddButton) {
      return (
        <add-artifact-button
          class={artifactSourceCls}
          data-name="add-artifact-source-to-service"
          onClick={this.props.params.onArtifactStreamAddEdit.bind(this, null)}
        >
          <add-icon /> Add Artifact Source
        </add-artifact-button>
      )
    }
  }

  renderNoArtifactSource = () =>
    <span className="no-artifact-source">
      <i className="icons8-error-filled" />&nbsp;No Artifact Source
    </span>

  render () {
    if (!this.props.isDetailPage && this.props.artifactStreams.length <= 0) {
      return this.renderNoArtifactSource()
    }

    return (
      <div className={css.main}>
        <artifact-list>
          {this.props.artifactStreams !== null &&
            this.props.artifactStreams.map((data, index) =>
              <artifact-item key={index}>
                {this.renderArtifactSourceName(data)}
                {this.renderArtifactActions(data)}
              </artifact-item>
            )}
          {this.renderMoreButton()}
        </artifact-list>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/ArtifactSources/ArtifactSources.js