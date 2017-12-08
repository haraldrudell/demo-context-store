import React from 'react'
import Select from 'react-select'
import Utils from '../Utils/Utils'
import CompUtils from '../Utils/CompUtils'

class CreatableMultiSelect extends React.Component {
  static displayName = 'CreatableMultiSelectField'
  static propTypes = {
    label: React.PropTypes.string
  }
  state = {
    value: null,
    options: []
  }
  valueArr = null

  getOptions (props) {
    let optionsArr = []
    if (!props) {
      return optionsArr
    }

    if (props.data) {
      optionsArr = props.data
    }

    if (props.schema && props.schema.enum && props.schema.enumNames) {
      optionsArr = Utils.enumArrToSelectArr(props.schema.enum, props.schema.enumNames)
    }

    // for Jenkins Artifact Path case: (props.schema.data is an array of strings, ex: ['path1', 'path2'] )
    const schemaData = props.schema.data
    if (schemaData && Array.isArray(schemaData)) {
      optionsArr = schemaData.map(item => {
        return { label: item, value: item }
      })
    }

    // HACK: if value is an array, keep it at "this.valueArr"
    if (!this.valueArr && Array.isArray(props.value)) {
      this.valueArr = props.value
    }
    // add any Custom Value (from schemaData.value) to optionsArr
    // so it can re-populate custom value back (Edit case)
    if (this.valueArr && optionsArr.length > 0) {
      for (const val of this.valueArr) {
        if (optionsArr.indexOf(val) < 0) {
          optionsArr.push({ label: val, value: val })
        }
      }
    }
    return optionsArr
  }

  componentWillReceiveProps (newProps) {
    let value = newProps.value
    // if (newProps.disabled === true) {
    //   value = undefined
    //   this.props.onChange(value)
    // }
    if (this.valueArr && Array.isArray(this.valueArr)) {
      // convert from Array to string
      value = this.valueArr.join(',')
      // this.props.onChange(value)
      this.setState({ value }, () => {
        this.valueArr = null // reset
      })
    }
    console.log('--- newProps.value: ', value)
    console.log(newProps)
  }

  renderOption (option) {
    const optionText = option.label
    const subStr = ' - Incomplete' // detect if rendering Workflow list
    if (optionText.includes(subStr)) {
      return CompUtils.renderWorkflowDropdownOption(option)
    } else {
      return option.label
    }
  }

  handleSelectChange = value => {
    // for MultiSelect (with simpleValue={false}), value is an Array of { value: '', label: '' }
    if (value === null) {
      value = undefined
    }
    this.setState({ value })

    let valueStr = value
    if (Array.isArray(value)) {
      valueStr = value.map(item => item.value).join(',')
    }
    this.props.onChange(valueStr)
  }

  render () {
    const schema = this.props.schema || {}
    // Alphabetically Sort Dropdowns by default
    let options = this.getOptions(this.props)

    if (!schema['custom:ordering']) {
      options = Utils.sortDataByKey(options.slice(), 'label', 'ASC')
    }

    const placeholder = schema.loading ? 'Loading...' : this.props.placeholder

    return (
      <div id={this.props.id} className="control-widget">
        <Select.Creatable
          multi={true}
          value={this.state.value}
          placeholder={placeholder || 'Select an option'}
          disabled={this.props.disabled}
          options={options}
          optionRenderer={this.renderOption}
          onChange={this.handleSelectChange}
        />
      </div>
    )
  }
}

export default CreatableMultiSelect



// WEBPACK FOOTER //
// ../src/components/CreatableMultiSelect/CreatableMultiSelect.js