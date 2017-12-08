import React from 'react'
// import PipelineWorkflowView from '../../WorkflowView/PipelineWorkflowView'
import css from './PipelineNewCardView.css'

export default class PipelineNewCardView extends React.Component {
  state = {}

  componentWillReceiveProps (newProps) {}

  render () {
    return (
      <div className={`row wings-card-row ${css.main}`}>
        {this.props.params.data.map(item => {
          const pipelineStages = item.pipelineStages

          return (
            <div key={item.uuid} data-name={item.name} className="col-md-12 wings-card-col">
              <div className="box-solid wings-card">
                <div className="box-header">
                  <div className="wings-card-header">
                    <div className="wings-text-link" onClick={this.props.params.onEdit.bind(this, item)}>
                      {item.name}
                    </div>
                    <span className="light">
                      {item.description}
                    </span>
                  </div>
                  <div className="wings-card-actions">
                    <span>
                      <i className="icons8-copy-2" onClick={this.props.params.onClone.bind(this, item)} />
                    </span>
                    <span>
                      <i className="icons8-pencil-tip" onClick={this.props.params.onEdit.bind(this, item)} />
                    </span>
                    <span>
                      <i className="icons8-waste" onClick={this.props.params.onDelete.bind(this, item)} />
                    </span>
                  </div>
                </div>
                <div className="box-body" />
                <div className="box-footer">
                  <div className="__pipes">
                    <div>
                      <div className="__col">
                        <div />
                      </div>

                      {pipelineStages.map((stage, idx) => {
                        let pipeEndEl
                        let addNextPipeEl
                        if (idx === pipelineStages.length - 1) {
                          pipeEndEl = <div className="__pipeEnd" />
                        } else {
                          addNextPipeEl = (
                            <div className="__addStageIcon __addNextPipeEl" onClick={() => this.onAddStageClick(idx)}>
                              <i className="icons8-plus-filled" />
                            </div>
                          )
                        }

                        return (
                          <div className="__col" key={idx}>
                            {addNextPipeEl}

                            <div className="__pipe">
                              Stage {idx + 1}
                              <span className="__deleteStage" onClick={() => this.onStageDeleteClick(idx)}>
                                <i className="icons8-delete" />
                              </span>
                            </div>
                            {pipeEndEl}

                            <div>
                              {stage.pipelineStageElements.map(stageElement => {
                                const activeClass = ''
                                return (
                                  <div className={`__stageEl ${activeClass}`} key={stageElement.name}>
                                    {stageElement.name}
                                    <span
                                      className="__deleteEnv"
                                      onClick={() => this.onDeleteElementClick(idx, stageElement)}
                                    >
                                      <i className="icons8-delete" />
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}

                      <div className="__col">
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/PipelinePage/views/PipelineNewCardView.js