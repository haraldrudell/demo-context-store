import React from 'react'
import 'split-view'
import MonacoEditor from 'react-monaco-editor'
import { UIButton, TooltipOverlay, Confirm, Utils } from 'components'
import { SetupAsCodeService } from 'services'
import { Popover, Position } from '@blueprintjs/core'
import SetupAsCodeHistory from './SetupAsCodeHistory'
import SetupAsCodeGitSyncModal from './SetupAsCodeGitSyncModal'
import css from './SetupAsCodeEditor.css'

class SetupAsCodeEditor extends React.Component {
  state = {
    nodeData: null,
    content: '',
    confirmDeleteShow: false,
    gitSyncShow: false,
    gitSyncData: null,
    selectedVersion: 0
  }
  updateNodeDataArgs = null
  editorRef = null

  async componentWillReceiveProps (newProps) {
    const selectedNode = newProps.selectedNode
    // console.log('selectedNode: ', selectedNode)
    if (selectedNode && !Utils.isFolderSetupNode(selectedNode)) {
      await this.loadNode(selectedNode)
      if (this.editorRef && this.editorRef.editor) {
        this.editorRef.editor.setScrollPosition({ scrollTop: 0 })
      }
    }
  }

  loadNode = async node => {
    const { accountId } = this.props.urlParams
    const { nodeData, error } = await SetupAsCodeService.getNodeData({ accountId, node })
    if (error) {
      this.setState({ nodeData, content: '', selectedVersion: 0 })
    } else {
      this.setState({ nodeData, content: nodeData.yaml, selectedVersion: 0 })
    }
  }

  onSaveClick = async () => {
    const { accountId } = this.props.urlParams
    const { selectedNode } = this.props
    const { content } = this.state
    console.log('selectedNode: ', selectedNode)
    this.updateNodeDataArgs = {
      accountId,
      node: selectedNode,
      content
    }
    const { error } = await SetupAsCodeService.updateNodeData(this.updateNodeDataArgs)
    if (error && error.code === 'NON_EMPTY_DELETIONS') {
      this.setState({ confirmDeleteShow: true })
    } else if (!error) {
      this.props.toaster.show({ message: 'Saved successfully.' })
      await this.props.onNodeChange()
    }
    this.setState({ selectedVersion: 0 }) // reset selectedVersion after saving.
  }

  onChange = (newValue, e) => {
    this.setState({ content: newValue })
  }

  onDeleteConfirmed = async () => {
    this.setState({ confirmDeleteShow: false })
    const args = {
      ...this.updateNodeDataArgs,
      deleteEnabled: true
    }
    await SetupAsCodeService.updateNodeData(args)
    await this.loadNode(this.updateNodeDataArgs.node)
    await this.props.onNodeChange()
  }

  onDeleteCancelled = async () => {
    this.setState({ confirmDeleteShow: false })
    await this.loadNode(this.updateNodeDataArgs.node)
  }

  showGitSync = () => {
    const gitSyncData = Utils.getJsonValue(this, 'state.nodeData.gitSync')
    this.setState({ gitSyncShow: true, gitSyncData })
  }

  getEditorConfigs = () => {
    const requireConfig = {
      // url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      // paths: {
      //   vs: 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs'
      // }
      url: '/libs/require.js',
      paths: {
        vs: '/libs/monaco-editor/min/vs'
      }
    }
    const editorConfig = {
      // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
      // fontSize: 14, => NOTE: This causes an issue when clicking on a row,
      //   the caret always goes to the beginning of the line.
      lineNumbers: 'off',
      minimap: { enabled: false }
      // readOnly: true
    }
    return { requireConfig, editorConfig }
  }

  onSubmitGitSync = async ({ formData }) => {
    const { selectedNode } = this.props
    const { accountId } = this.props.urlParams
    const { response, error } = await SetupAsCodeService.updateGitSync({
      accountId,
      node: selectedNode,
      data: formData
    })
    if (!error) {
      // refresh state data (for next Edit)
      const { nodeData } = this.state
      nodeData.gitSync = response.resource
      this.setState({ nodeData, gitSyncShow: false })
    }
  }

  onSelectVersion = async verData => {
    const { selectedNode } = this.props
    console.log('onSelectVersion: ', verData)
    const { nodeData } = this.state

    // TODO: load version details
    const { accountId, entityId, uuid } = verData
    const { data } = await SetupAsCodeService.getVersion({
      accountId,
      entityId,
      type: selectedNode.yamlVersionType,
      versionId: uuid
    })
    nodeData.yaml = data.yaml // verData.yaml
    this.setState({ nodeData, content: nodeData.yaml, selectedVersion: data.version })
  }

  render () {
    const { selectedNode, urlParams } = this.props
    const { nodeData, selectedVersion } = this.state
    const { requireConfig, editorConfig } = this.getEditorConfigs()
    const ver = selectedVersion ? ` (version: ${selectedVersion})` : ''

    // const isGitSyncEnabled = nodeData && nodeData.gitSync && nodeData.gitSync.enabled === true ? true : false
    console.log('nodeData: ', nodeData)

    let btn = (
      <div className={css.toolbar}>
        <TooltipOverlay tooltip="Version History (Coming soon)">
          <span className="icon">History</span>
        </TooltipOverlay>
        <UIButton type="submit" disabled>
          Save
        </UIButton>
      </div>
    )

    // TODO:  DEV ONLY! => ENABLE FOR HARNESS ACCOUNTS ONLY: CI, QA, PROD
    if (selectedNode && Utils.isYamlEnabled(urlParams.accountId)) {
      btn = (
        <div className={css.toolbar}>
          <Popover
            position={Position.LEFT_TOP}
            useSmartArrowPositioning={true}
            content={
              <SetupAsCodeHistory
                {...this.props}
                selectedNode={selectedNode}
                entityId={selectedNode.uuid}
                onSelect={this.onSelectVersion}
              />
            }
          >
            <span className="wings-text-link">History</span>
          </Popover>
          {/* <span className="wings-text-link" onClick={this.showGitSync}>
          {isGitSyncEnabled && <i className="icons8-checkmark icon" />}
          Git Sync
        </span> */}
          <UIButton type="submit" onClick={this.onSaveClick}>
            Save
          </UIButton>

          {/* <TooltipOverlay tooltip="Version History (Coming soon)">
          <span className="icon">History</span>
        </TooltipOverlay>
        <Button onClick={this.onSaveClick} disabled>
          Save
        </Button> */}
        </div>
      )
    }
    const popoverHeaderCss = this.props.selectId ? ' ' + css.popoverHeader : ''
    return (
      <section className={css.main} fill>
        <div className={css.headerBar + popoverHeaderCss}>
          <div className={css.name}>
            {selectedNode ? selectedNode.name : ''}
            {ver}
          </div>
        </div>
        <div className={css.buttonBar}>{this.props.selectedNode && btn}</div>

        <div className={css.editor}>
          <MonacoEditor
            ref={ref => (this.editorRef = ref)}
            requireConfig={requireConfig}
            options={editorConfig}
            language="yaml"
            value={this.state.content}
            onChange={this.onChange}
          />
        </div>

        {this.state.gitSyncShow && (
          <SetupAsCodeGitSyncModal
            {...this.props}
            data={this.state.gitSyncData}
            onHide={() => this.setState({ gitSyncShow: false })}
            onSubmit={this.onSubmitGitSync}
          />
        )}

        <Confirm
          visible={this.state.confirmDeleteShow}
          onConfirm={this.onDeleteConfirmed}
          onClose={this.onDeleteCancelled}
          body="This operation will delete objects. Do you want to proceed?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </section>
    )
  }
}

export default SetupAsCodeEditor



// WEBPACK FOOTER //
// ../src/containers/SetupAsCode/SetupAsCodeEditor.js