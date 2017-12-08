import React from 'react'
// import Select from 'react-select'
import { Utils } from 'components'
import css from './SettingPanel.css'

export default class PhaseRollbackStrategyPanel extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  // static propTypes = {} // React.PropTypes
  state = {
    togglerClass: '__collapsed',
    variables: []
  }
  appIdFromUrl = Utils.appIdFromUrl()
  idFromUrl = Utils.getIdFromUrl()

  componentWillMount () {
    Utils.loadCatalogsToState(this)
  }

  componentWillReceiveProps (newProps) {
    this.setState({ variables: newProps.variables })
  }

  toggleSettingBox = () => {
    const newClass = this.state.togglerClass === '__expanded' ? '__collapsed' : '__expanded'
    this.setState({ togglerClass: newClass })
  }

  render () {
    const workflowData = this.props.workflowData || {}
    const rollbackPhase = workflowData.rollbackWorkflowPhaseIdMap[this.idFromUrl]
    if (!rollbackPhase) {
      return null
    }
    const phaseSteps = rollbackPhase.phaseSteps

    return (
      <section className={css.main}>
        <div className={`__settingBox ${this.state.togglerClass}`}>
          <h4 onClick={() => this.toggleSettingBox()}>Rollback Steps</h4>

          <div className="__settingContent">
            {phaseSteps.map((step, index) => {
              return (
                <div key={index}>
                  <div className="__stepHeading">
                    <span>
                      <h4>
                        {index + 1}. {step.name}
                      </h4>
                    </span>
                  </div>
                  <div className="__stepDetails">
                    {this.props.renderStepDetails(step, this.props.service, rollbackPhase)}
                  </div>
                </div>
              )
            })}

            <div className="__settingFooter" />
          </div>
        </div>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/views/PhaseRollbackStrategyPanel.js