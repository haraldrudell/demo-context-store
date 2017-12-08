import React from 'react'
import SortableTree, { map } from 'react-sortable-tree'
import { SearchInput, UIButton, TooltipOverlay, Utils } from 'components'
import SetupAsCodeGitSyncModal from './SetupAsCodeGitSyncModal'
import { SetupAsCodeService } from 'services'
import * as Icons from 'styles/icons'
import css from './SetupAsCodeTree.css'

class SetupAsCodeTree extends React.Component {
  state = {
    treeData: null,
    selectedNode: null,
    gitSyncShow: false,
    gitSyncData: null,
    // search - example: https://github.com/fritz-c/react-sortable-tree/blob/master/examples/storybooks/search.js
    searchString: '',
    searchFocusIndex: 0,
    searchFoundCount: null
  }
  accountSetupNode = null // reference to the 1st node
  selectNode // default selected Node

  async componentWillMount () {
    await this.refreshData()
    if (this.props.selectId) {
      await this.props.onSelectNode(this.selectNode)
      await this.highlightNode(this.selectNode)
    }
  }

  // fetch tree structure & set to state
  refreshData = async () => {
    const { data, error } = await SetupAsCodeService.getSetupData(this.props.urlParams.accountId)
    if (!error) {
      const treeData = this.transformData({ data })
      this.setState({ treeData })
    }
  }

  // find a node & invoke "nodeHandler" for a specific node by id, "otherNodesHandler" (optional) for other nodes
  changeNode = (nodeId, nodeHandler, otherNodesHandler) => {
    const treeData = map({
      treeData: this.state.treeData,
      callback: ({ node }) => {
        if (node.clientId === nodeId) {
          return nodeHandler(node)
        } else {
          return otherNodesHandler ? otherNodesHandler(node) : node
        }
      },
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: false
    })
    this.setState({ treeData })
  }

  // transform data from API to treeData for SortableTree
  transformData ({ data, expanded = true }) {
    return map({
      treeData: [data],
      callback: ({ node }) => {
        const isFolder = Utils.isFolderSetupNode(node)
        if (isFolder && ['Account'].indexOf(node.shortClassName) >= 0) {
          this.accountSetupNode = node
        }

        let setExpanded = expanded
        if (isFolder && node.appId && node.className === 'software.wings.beans.Application') {
          // by default, force expand Application Folders to have a shorter tree list:
          setExpanded = false
        }
        const newNode = {
          ...node,
          clientId: Utils.generateUuid(), // for client-side use only
          title: node.name,
          expanded: setExpanded
        }
        if (node.uuid === this.props.selectId) {
          this.selectNode = newNode
        }
        return newNode
      },
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: false
    })
  }

  // expand/collapse a folder node
  toggleNode = selectedNode => {
    this.changeNode(selectedNode.clientId, node => {
      return {
        ...node,
        expanded: !selectedNode.expanded
      }
    })
  }

  highlightNode = selectedNode => {
    this.changeNode(
      selectedNode.clientId,
      node => {
        return {
          ...node,
          selected: true
        }
      },
      otherNode => {
        return {
          ...otherNode,
          selected: false
        }
      }
    )
  }

  onNodeClick = node => {
    console.log('clicked: ', node)
    if (Utils.isFolderSetupNode(node)) {
      this.toggleNode(node)
    } else {
      this.highlightNode(node)
      this.props.onSelectNode(node)
    }
    this.setState({ selectedNode: node })
  }

  renderTreeNode = ({ node, path }) => {
    let iconEl = null
    const isFolder = Utils.isFolderSetupNode(node)
    if (isFolder) {
      // iconEl = <i className="icons8-folder icon" />
      iconEl = <Icons.Folder />
    } else {
      // iconEl = <i className="icons8-file icon" />
      iconEl = <Icons.File />
    }
    // const showGitSyncLink = isFolder && ['Account'].indexOf(node.shortClassName) >= 0 ? true : false
    const showGitSyncLink = false

    const sync = node.syncMode
    const hasGitSync = sync && sync.length > 0 && sync !== 'NONE' && node.syncEnabled === true
    const hasGitSyncCss = hasGitSync ? css.hasGitSync : ''

    const selectedClass = node.selected ? css.selected : ''

    return {
      title: (
        <span className={css.name + ' ' + selectedClass} onClick={() => this.onNodeClick(node)}>
          {iconEl}
          {node.name}
          {showGitSyncLink && (
            <span className={css.gitSyncLink + ' ' + hasGitSyncCss} onClick={async () => await this.editGitSync(node)}>
              <TooltipOverlay tooltip="Setup GitSync">
                <i className="icons8-git icon" />
              </TooltipOverlay>
            </span>
          )}
        </span>
      )
    }
  }

  showGitSync = gitSyncData => {
    // const gitSyncData = Utils.getJsonValue(this, 'state.nodeData.gitSync')
    this.setState({ gitSyncShow: true, gitSyncData })
  }

  editGitSync = async node => {
    const { gitSync, error } = await SetupAsCodeService.getGitSync({ accountId: this.props.urlParams.accountId, node })
    if (!error) {
      this.showGitSync(gitSync)
    }
    this.setState({ selectedNode: node })
  }

  onSubmitGitSync = async ({ formData }) => {
    const { selectedNode } = this.state
    const { accountId } = this.props.urlParams
    const { error } = await SetupAsCodeService.updateGitSync({
      accountId,
      node: selectedNode,
      data: formData
    })
    if (!error) {
      // refresh state data (for next Edit)
      // const nodeData = this.state.nodeData
      // nodeData.gitSync = response.resource
      // this.setState({ nodeData, gitSyncShow: false })
      this.setState({ gitSyncShow: false })
      await this.props.onNodeChange()
    }
  }

  hideModal = () => {}

  onChangeSearch = searchString => {
    this.setState({ searchString })
  }

  render () {
    const { treeData } = this.state
    const hiddenCss = this.props.selectId ? ' hidden' : '' // don't show if 'selectId' exists

    // search functions:
    const { searchString, searchFocusIndex, searchFoundCount } = this.state
    const customSearchMethod = ({ node, searchQuery }) =>
      searchQuery && node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1
      })
    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex: searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0
      })

    return (
      <section className={css.main + ' ' + this.props.className + hiddenCss}>
        <header />
        <div className={css.treeToolbar}>
          <UIButton type="button" icon="GitSync" onClick={() => this.editGitSync(this.accountSetupNode)}>
            Sync
          </UIButton>
          <SearchInput className={css.search} onChange={this.onChangeSearch} />
          <div className={css.searchBtns + (this.state.searchString.length === 0 ? ' hidden' : '')}>
            <button type="button" disabled={!searchFoundCount} onClick={selectPrevMatch}>
              &lt;
            </button>
            <button type="submit" disabled={!searchFoundCount} onClick={selectNextMatch}>
              &gt;
            </button>
            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </div>
        </div>

        {!treeData && <span className={'wings-spinner ' + css.spinner} />}
        {treeData && (
          <div className={css.treeContainer}>
            <SortableTree
              treeData={treeData}
              rowHeight={25}
              scaffoldBlockPxWidth={25}
              generateNodeProps={({ node, path }) => this.renderTreeNode({ node, path })}
              onChange={treeData => this.setState({ treeData })}
              searchMethod={customSearchMethod}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              searchFinishCallback={matches =>
                this.setState({
                  searchFoundCount: matches.length,
                  searchFocusIndex: matches.length > 0 ? searchFocusIndex % matches.length : 0
                })
              }
            />
          </div>
        )}

        {this.state.gitSyncShow && (
          <SetupAsCodeGitSyncModal
            {...this.props}
            data={this.state.gitSyncData}
            selectedNode={this.state.selectedNode}
            onHide={() => this.setState({ gitSyncShow: false })}
            onSubmit={this.onSubmitGitSync}
          />
        )}
      </section>
    )
  }
}

export default SetupAsCodeTree



// WEBPACK FOOTER //
// ../src/containers/SetupAsCode/SetupAsCodeTree.js