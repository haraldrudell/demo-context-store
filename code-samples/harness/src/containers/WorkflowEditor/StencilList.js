import React from 'react'
import { StencilConfigs, Utils } from 'components'
import Draggable from 'react-draggable'
import css from './StencilList.css'

export default class StencilList extends React.Component {
  state = { stencils: [], menuPos: { x: 0, y: 0 } }

  onDraggableStop = (ev, ui) => {
    this.props.onDrop(ev, ui)
  }

  render () {
    const stencilsData = Utils.getJsonValue(this, 'props.stencils')

    // build Stencil Categories object for grouping. { categoryName: [ Array of stencils ] }
    const categoriesObj = {}
    for (const stencil of stencilsData) {
      const catName = stencil.stencilCategory.displayName
      categoriesObj[catName] = categoriesObj[catName] || []
      categoriesObj[catName].push(stencil)
    }

    return (
      <div>
        {/* Create the tabs */}
        <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
          <li>
            <a href="javascript:;" data-toggle="tab">
              <i className="fa fa-object-ungroup" /> &nbsp;&nbsp; STENCILS
            </a>
          </li>
        </ul>
        {/* Tab panes */}
        <div className="tab-content">
          {Object.keys(categoriesObj).map(categoryName => {
            const categoryStencils = categoriesObj[categoryName]
            return (
              <ul key={categoryName} className={css.list}>
                <li className={`__category __category_${categoryName}`}>
                  {categoryName}
                </li>

                {categoryStencils.map(stencil => {
                  const iconClass = StencilConfigs.getNodeIconClass(stencil.type, stencil.name)
                  return (
                    <Draggable key={stencil.name} position={this.state.menuPos} onStop={this.onDraggableStop}>
                      <li
                        data-type={stencil.type}
                        data-name={stencil.name}
                        className={css.listItem + ' __li_' + categoryName}
                      >
                        <i className={iconClass} /> {stencil.name}
                      </li>
                    </Draggable>
                  )
                })}
              </ul>
            )
          })}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/StencilList.js