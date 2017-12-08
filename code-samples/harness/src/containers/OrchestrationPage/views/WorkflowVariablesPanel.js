import React from 'react'
import css from './SettingPanel.css'

export default class WorkflowVariablesPanel extends React.Component {
  state = {
    shouldExpand: false
  }

  toggleSettingBox = () => {
    this.setState(prevState => {
      return { shouldExpand: !prevState.shouldExpand }
    })
  }

  onManage = () => {
    this.props.onManage && this.props.onManage()
  }

  render () {
    const togglerClass = this.state.shouldExpand ? '__expanded' : '__collapsed'
    const variables = this.props.variables || []
    return (
      <section className={css.main}>
        <div className={`__settingBox ${togglerClass}`}>
          <h4 onClick={() => this.toggleSettingBox()}>
            Workflow Variables
            <i onClick={this.onManage} className="edit-workflow-variables icons8-pencil-tip" />
          </h4>

          <div className="__settingContent">
            <div className="workflow-variable">
              <span className="variable-name">
                <strong>Variable Name</strong>
              </span>
              <span className="variable-value">
                <strong>Default Value</strong>
              </span>
            </div>
            {variables.length === 0 && (
              <div className="workflow-variable">
                <span className="variable-name">&#8211;</span>
                <span className="variable-value">&#8211;</span>
              </div>
            )}
            {variables.map((v, i) => {
              return (
                <div className="workflow-variable" key={i}>
                  <span className="variable-name">{v.name}</span>
                  <span className="variable-value">{v.value}</span>
                </div>
              )
            })}

            <div className="__settingFooter">
              {/* <button className="__accent" onClick={this.onManage} disabled={this.props.loadingStatus !== 2}> */}
              {/* <strong>Edit Workflow Variables</strong> */}
              {/* </button> */}
            </div>
          </div>
        </div>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/views/WorkflowVariablesPanel.js