const INIT_X = 20
const INIT_Y = 30
const DEFAULT_GROUP_PADDING = 17
const DEFAULT_ELEMENT_NODE_WIDTH = 105
const DEFAULT_NODE_WIDTH = 80
const DEFAULT_NODE_HEIGHT = 40
const DEFAULT_ARROW_WIDTH = 50
const DEFAULT_ARROW_HEIGHT = 50
const DEFAULT_ELEMENT_PADDING = 8

export default class WorkflowLayout {
  nodes = []

  paintGroup (group, graph, x, y) {
    group.x = x
    group.y = y
    // group.width = 1

    y += DEFAULT_ARROW_HEIGHT
    let priorElement = null

    for (const node of group.elements) {
      this.paintNode(node, graph, x + DEFAULT_ELEMENT_PADDING, y)
      y += node.height + DEFAULT_ARROW_HEIGHT
      priorElement = node
    }
    if (!priorElement) {
      group.height = 0
    } else {
      group.height = priorElement.y + DEFAULT_NODE_HEIGHT / 2 - group.y
    }
    this.nodes.push(group)
  }

  paintNode (node, graph, x, y) {
    node.x = x
    node.y = y
    // node.width = DEFAULT_NODE_WIDTH
    this.nodes.push(node)
    // if (node.expanded === false) {
    //   return
    // }
    // const adjustY = (node.type === 'REPEAT' || node.type === 'FORK' ? -10 : 0)
    // node.y += adjustY

    const group = node.group
    if (group) {
      if (node.expanded === true) {
        this.paintGroup(group, graph, x + DEFAULT_GROUP_PADDING, y + DEFAULT_NODE_HEIGHT)
      }
    }

    const next = node.next
    if (next) {
      // if (node.type === 'SUB_WORKFLOW') {
      //   next.width = DEFAULT_NODE_WIDTH
      // }

      if (!group || !next.group) {
        if (node.type === 'ELEMENT') {
          this.paintNode(next, graph, x + DEFAULT_ELEMENT_NODE_WIDTH + DEFAULT_ARROW_WIDTH, y)
        } else {
          this.paintNode(next, graph, x + DEFAULT_NODE_WIDTH + DEFAULT_ARROW_WIDTH, y)
        }
      } else {
        if (next.expanded) {
          this.paintNode(next, graph, x + node.width - next.width, y)
        } else {
          // if node.next collapsed, draw it closer to the node.
          this.paintNode(next, graph, x + DEFAULT_NODE_WIDTH + DEFAULT_ARROW_WIDTH, y)
        }
      }
    }
  }

  extrapolateGroupDimension (group) {
    for (const node of group.elements) {
      this.extrapolateNodeDimension(node)
      if (group.width < node.width) {
        group.width = node.width
      }
      group.height = group.height + node.height + DEFAULT_ARROW_HEIGHT
    }
  }

  extrapolateNodeDimension (node) {
    node.width = DEFAULT_NODE_WIDTH
    node.height = DEFAULT_NODE_HEIGHT
    // if (node.expanded === false) {
    //   return
    // }

    const group = node.group
    if (group) {
      if (node.expanded === true) {
        this.extrapolateGroupDimension(group)
        if (node.width < group.width) {
          node.width = group.width
        }
        node.height = node.height + group.height
      } else {
        group.width = 0
      }
    }

    const next = node.next
    if (next) {
      this.extrapolateNodeDimension(next)
      if (node.height < next.height) {
        node.height = next.height
      }
      node.width = node.width + next.width + DEFAULT_ARROW_WIDTH
    }
  }

  setDefaultValues (nodeOrGroup) {
    if (!nodeOrGroup) {
      return
    }
    nodeOrGroup.x = 0
    nodeOrGroup.y = 0
    nodeOrGroup.width = 0
    nodeOrGroup.height = 0
    const group = nodeOrGroup.group
    if (group) {
      this.setDefaultValues(group)
    }
    if (nodeOrGroup.next) {
      this.setDefaultValues(nodeOrGroup.next)
    }
    if (nodeOrGroup.elements) {
      for (const childNode of nodeOrGroup.elements) {
        this.setDefaultValues(childNode)
      }
    }
  }

  paintGraph (execData) {
    this.nodes = []
    this.setDefaultValues(execData.executionNode)
    this.extrapolateNodeDimension(execData.executionNode)
    this.paintNode(execData.executionNode, execData, INIT_X, INIT_Y)
    return this.nodes
  }
}

WorkflowLayout.DEFAULT_NODE_WIDTH = DEFAULT_NODE_WIDTH
WorkflowLayout.DEFAULT_NODE_HEIGHT = DEFAULT_NODE_HEIGHT



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/WorkflowLayout.js