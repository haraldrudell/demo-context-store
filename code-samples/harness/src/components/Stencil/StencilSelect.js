import React from 'react'
import StencilConfigs from './StencilConfigs'
import Select from 'react-select'
// import css from './FileName.css'

export default class StencilSelect extends React.Component {
  // static propTypes = {} // React.PropTypes
  state = {}

  renderStencilLabel = (stencil) => {
    return (
      <span>
        <span className="badge">
          <i className={StencilConfigs.getNodeIconClass(stencil.type, stencil.name)} />
        </span>
        <span className="__accent"> {stencil.name} </span>
      </span>
    )
  }

  render () {
    const options = []
    const groups = {}
    const stencils = this.props.stencils || []
    const service = this.props.service

    for (const stencil of stencils) {
      if (stencil && stencil.stencilCategory && stencil.stencilCategory.name !== 'CONTROLS') {
        if (!groups[stencil.stencilCategory.name]) {
          groups[stencil.stencilCategory.name] = []
        }
        // filter by "service" (if this.props.service exists)
        let __flag = true
        if (service && Array.isArray(service.serviceCommands) && stencil.type === 'COMMAND') {
          __flag = false
          if (service.serviceCommands.find(sc => sc.name === stencil.name)) {
            __flag = true
          }
        }
        if (this.props.service) {
          if (__flag) {
            groups[stencil.stencilCategory.name].push({
              value: stencil.type + '-' + stencil.name,
              label: this.renderStencilLabel(stencil),
              data: stencil
            })
          }
        } else {
          groups[stencil.stencilCategory.name].push({
            value: stencil.type + '-' + stencil.name,
            label: this.renderStencilLabel(stencil),
            data: stencil
          })
        }
      }
    }
    // add Groups & Stencils to Select2's options:
    for (const groupName in groups) {
      options.push({
        label: groupName,
        value: groupName,
        disabled: true
      })
      for (const ele of groups[groupName]) {
        options.push(ele)
      }
    }

    return (
      <span>
        <Select
          name="form-field-name"
          placeholder={this.props.placeholder}
          value=""
          options={options}
          clearable={false} autosize={true} searchable={false}
          onChange={item => this.props.onChange(item)}
        />
      </span>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Stencil/StencilSelect.js