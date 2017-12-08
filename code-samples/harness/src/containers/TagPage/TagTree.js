import React from 'react'
import Tree, { TreeNode } from 'rc-tree'
import { Utils } from 'components'
import TagModal from './TagModal'
import HostMappingModal from '../ServiceTemplateDetailPage/HostMappingModal'

export default class TagTree extends React.Component {
  state = { showModal: false, modalData: {}, showHostMappingModal: false, hostMappingModalData: null }
  rootNode = null
  allHosts = []
  cmContainer = null
  selectedNode = this.rootNode
  flatTagList = {}

  componentWillReceiveProps (newProps) {
    if (newProps.data.length > 0) {
      this.rootNode = Utils.clone(newProps.data[0])
      this.allHosts = newProps.allHosts
      this.selectedNode = newProps.selectedNode
      if (this.rootNode) {
        this.traverseTagsToAddHosts(this.rootNode)
        this.setState({ __update: Date.now() })
      }
    }
  }

  traverseTagsToAddHosts = tagData => {
    this.flatTagList[tagData.uuid] = tagData // save to flat list
    for (const host of this.allHosts) {
      if (host.configTag && tagData.uuid === host.configTag.uuid) {
        tagData.children = tagData.children || []
        tagData.children.push({
          name: host.hostName,
          nodeType: 'HOST',
          tagType: 'HOST',
          parentTagId: tagData.uuid,
          uuid: host.uuid
        })
      }
    }

    if (tagData.children && tagData.children.length > 0) {
      for (const childTag of tagData.children) {
        this.traverseTagsToAddHosts(childTag)
      }
    }
  }

  getSelectedNode = () => {
    return this.selectedNode ? this.selectedNode : this.rootNode
  }

  onAdd = node => {
    this.setState({ showModal: true, modalData: null })
  }
  onRemove = node => {
    this.props.removeNode(node)
  }
  onRename = node => {
    const modalData = {}
    {
      const { uuid, name, description, autoTaggingRule } = this.selectedNode
      Object.assign(modalData, { uuid, name, description, autoTaggingRule })
    }
    this.setState({ showModal: true, modalData })
  }

  onMapHosts = node => {
    this.setState({ showHostMappingModal: true })
  }

  onSubmitHosts = mappedHosts => {
    this.props.onSubmitHosts(this.getSelectedNode(), mappedHosts)
    this.setState({ showHostMappingModal: false })
  }

  onTagSubmit = (data, isEditing) => {
    this.props.nodeRequest(this.getSelectedNode(), data, isEditing)
    Utils.hideModal.bind(this)()
  }

  onSelect = (selectedKeys, e) => {
    const uuid = Array.isArray(selectedKeys) && selectedKeys.length > 0 ? selectedKeys[0] : this.rootNode.uuid
    const selectedNode = this.flatTagList[uuid] ? this.flatTagList[uuid] : this.rootNode
    this.props.onSelectElement(selectedNode)
  }

  renderToolBar () {
    const node = this.getSelectedNode()

    if (!node) {
      return null
    }

    let hasHosts = false
    if (node.children && node.children.find(child => child.tagType === 'HOST')) {
      hasHosts = true
    }

    const tagType = node.tagType.trim()
    const enableAdd = tagType !== 'HOST' && !hasHosts
    const enableRemove = tagType !== 'ENVIRONMENT' && tagType !== 'UNTAGGED_HOST' && tagType !== 'HOST'
    const enableRename = tagType === 'TAGGED_HOST'
    const enableMapped = tagType === 'TAGGED_HOST'
    return (
      <div className="btn-group" role="group">
        {enableAdd && (
          <button type="button" onClick={this.onAdd.bind(this, node)} className="btn btn-link">
            <i className="icons8-plus-math" />
            <span>Add</span>
          </button>
        )}
        {enableRemove && (
          <button type="button" onClick={this.onRemove.bind(this, node)} className="btn btn-link">
            <i className="icons8-minus-math" />
            <span>Remove</span>
          </button>
        )}
        {enableRename && (
          <button type="button" onClick={this.onRename.bind(this, node)} className="btn btn-link">
            <i className="icons8-pencil-tip" />
            <span>Edit</span>
          </button>
        )}

        {enableMapped && (
          <button type="button" onClick={this.onMapHosts.bind(this, node)} className="btn btn-link">
            <i className="icons8-activity-grid-2-2" />
            <span>Map Hosts</span>
          </button>
        )}
      </div>
    )
  }

  getTitle = node => {
    if (node.tagType === 'ENVIRONMENT') {
      return (
        <span>
          <i className="fa fa-tags" aria-hidden="true" />&nbsp;{node.name}
        </span>
      )
    }

    if (node.tagType === 'HOST') {
      return (
        <span>
          <i className="fa fa-desktop" aria-hidden="true" />&nbsp;{node.name}
        </span>
      )
    }

    return (
      <span>
        <i className="fa fa-tag" aria-hidden="true" />&nbsp;{node.name}
      </span>
    )
  }

  renderNodes () {
    if (!this.rootNode) {
      return null
    }

    const loop = data => {
      return data.map((item, index) => {
        if (item.children) {
          return (
            <TreeNode title={this.getTitle(item)} key={item.uuid}>
              {loop(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode title={this.getTitle(item)} key={item.uuid} isLeaf={true} />
      })
    }

    const treeNodes = loop(this.rootNode.children)
    return (
      <Tree
        defaultExpandedKeys={[this.rootNode.uuid, this.getSelectedNode().uuid]}
        defaultSelectedKeys={[this.getSelectedNode().uuid]}
        showLine
        showIcon={false}
        onSelect={this.onSelect}
      >
        <TreeNode title={this.getTitle(this.rootNode)} key={this.rootNode.uuid} prefixCls="rootClass">
          {treeNodes}
        </TreeNode>
      </Tree>
    )
  }

  render () {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box-solid wings-card">
            <div className="box-header with-border">
              <span>Topology</span>
            </div>
            <div className="box-body">
              {/*  {this.renderToolBar()}*/}
              {this.renderNodes()}
            </div>
          </div>
        </div>
        <TagModal
          data={this.state.modalData}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onTagSubmit}
        />
        <HostMappingModal
          data={this.state.hostMappingModalData}
          allHosts={this.allHosts}
          show={this.state.showHostMappingModal}
          onHide={Utils.hideModal.bind(this, 'showHostMappingModal')}
          onSubmit={this.onSubmitHosts}
        />
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TagPage/TagTree.js