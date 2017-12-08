import React from 'react'
import { Position, Popover } from '@blueprintjs/core'
import UIButton from '../UIButton/UIButton'
import css from './DeploymentNotes.css'
import { ExecutionService } from 'services'

export default class DeploymentNotes extends React.Component {
  state = {
    showPopOver: false,
    deploymentNotes: null
  }

  componentWillMount () {
    const { executionParams } = this.props
    if (executionParams) {
      const { notes } = this.props.executionParams

      this.setState({ deploymentNotes: notes })
    }
  }

  onChange = event => {}

  renderNotesIcon = () => {
    return (
      <Popover
        key="notes-popover"
        position={Position.BOTTOM}
        popoverClassName="pipeline-show-notes-popover"
        isOpen={this.state.showPopOver}
        onClose={this.hidePopOver}
      >
        <UIButton
          data-name="deployment-workflow-notes"
          icon="Note"
          onClick={() => {
            this.setState({ showPopOver: true })
          }}
        />

        <div>{this.renderAddNotesTemplate()}</div>
      </Popover>
    )
  }

  renderAddNotesTemplate = () => {
    return (
      <section className={css.addNotes}>
        <header className={css.header}>Notes </header>
        {this.renderTextArea()}
        <section className={css.btnSection}>
          <UIButton className={css.cancelBtn} onClick={this.hidePopOver}>
            Cancel
          </UIButton>

          <UIButton className={css.saveBtn} onClick={this.submitNotes}>
            Save
          </UIButton>
        </section>
      </section>
    )
    return <div>notes</div>
  }

  hidePopOver = () => {
    this.setState({ showPopOver: false })
  }

  renderTextArea = () => {
    return (
      <textarea
        placeholder="Add New Note"
        className={css.comments}
        value={this.state.deploymentNotes}
        onChange={event => {
          this.onChangeNotes(event.target.value)
        }}
      />
    )
  }

  onChangeNotes = newNotes => {
    this.setState({ deploymentNotes: newNotes })
  }

  submitNotes = () => {
    const notes = this.state.deploymentNotes
    const { execId, appId } = this.props.executionParams
    const notesObj = { notes: notes }
    const { error } = ExecutionService.editNotes({ execId: execId, appId: appId, body: notesObj })

    if (error) {
      return
    }

    this.hidePopOver()
  }

  render () {
    const { className } = this.props
    return <section className={`${css.main} ${className}`}>{this.renderNotesIcon()}</section>
  }
}



// WEBPACK FOOTER //
// ../src/components/DeploymentNotes/DeploymentNotes.js