import React from 'react'
import SetupAsCodeEditor from './SetupAsCodeEditor'
import SetupAsCodeTree from './SetupAsCodeTree'
import css from './SetupAsCodePanel.css'
import 'split-view'

class SetupAsCodePanel extends React.Component {
  state = {
    selectedNode: null
  }
  treeRef

  componentWillMount () {}

  onSelectNode = node => {
    this.setState({ selectedNode: node })
  }

  onNodeChange = async () => {
    await this.treeRef.refreshData()
  }

  render () {
    const popoverMainCss = this.props.selectId ? ' ' + css.popoverMain : ''

    return (
      <section className={css.main + ' ' + this.props.className + popoverMainCss}>
        <split-view vertical>
          <SetupAsCodeTree
            {...this.props}
            ref={ref => (this.treeRef = ref)}
            className={css.tree}
            selectId={this.props.selectId}
            onSelectNode={this.onSelectNode}
            onNodeChange={this.onNodeChange}
          />
          <split-divider />

          <SetupAsCodeEditor
            {...this.props}
            selectId={this.props.selectId}
            selectedNode={this.state.selectedNode}
            onNodeChange={this.onNodeChange}
          />
        </split-view>
      </section>
    )
  }
}

export default SetupAsCodePanel



// WEBPACK FOOTER //
// ../src/containers/SetupAsCode/SetupAsCodePanel.js