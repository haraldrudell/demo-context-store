import React from 'react'
import Select from 'react-select'
import Utils from '../Utils/Utils'
import CompUtils from '../Utils/CompUtils'

class SearchableSelect extends React.Component {
  static displayName = 'SearchableSelectField'
  static propTypes = {
    label: React.PropTypes.string
  }
  state = {}

  isValueACustomValue = (value, options) => !options.find(opt => opt.value === value)

  getOptions (props) {
    let options = []

    if (props) {
      if (props.data) {
        options = props.data
      } else if (this.isCustomValueAllowed) {
        if (props.schema && props.schema.data) {
          // This is a hack for custom-value-allowed select
          // props.value is passed value (uuid is too specific)
          options = props.schema.data.map(entry => ({ label: entry.name, value: entry.uuid }))

          // If passing value is a custom value, options needs to be updated to contain it
          const { value } = props
          if (value && this.isValueACustomValue(value, options)) {
            options = [{ label: value, value: value }].concat(options)
          }
        }
      } else if (props.schema && props.schema['custom:options']) {
        return props.schema['custom:options']
      } else if (props.schema && props.schema.enum && props.schema.enumNames) {
        options = Utils.enumArrToSelectArr(props.schema.enum, props.schema.enumNames)
      }

      if (!props.schema['custom:ordering']) {
        options = Utils.sortDataByKey(options.slice(), 'label', 'ASC')
      }
    }

    return options
  }

  get isCustomValueAllowed () {
    return this.props.schema && this.props.schema['custom:allowCustomValue']
  }

  getRenderedOptions (props) {
    return this.isCustomValueAllowed && this.state.customOptions ? this.state.customOptions : this.getOptions(props)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.disabled === true) {
      this.props.onChange()
    }
  }
  /*
   This is to show incomplete status on workflows in a different color
  */
  renderOption = option => {
    const optionText = option.label
    const subStr = ' - Incomplete' // detect if rendering Workflow list
    if (optionText.includes(subStr) || option.incomplete) {
      return CompUtils.renderWorkflowDropdownOption(option)
    } else {
      return option.label
    }
  }

  onInputChange = value => {
    if (this.isCustomValueAllowed) {
      const options = this.getOptions(this.props)

      if (value && options && !options.find(opt => opt.value === value)) {
        this.setState({ customOptions: [{ label: 'Use custom: ' + value, value }].concat(options) })
      } else {
        this.setState({ customOptions: null })
      }
    }

    return value
  }

  render () {
    const schema = this.props.schema || {}
    const options = this.getRenderedOptions(this.props)
    const placeholder = schema.loading ? 'Loading...' : this.props.placeholder

    return (
      <div id={this.props.id} className="control-widget">
        <Select
          simpleValue
          value={this.props.value}
          placeholder={placeholder || 'Select an option'}
          disabled={this.props.disabled}
          options={options}
          optionRenderer={this.renderOption}
          onChange={this.handleSelectChange}
          onInputChange={value => this.onInputChange(value, options)}
        />
      </div>
    )
  }

  handleSelectChange = value => {
    const { props } = this

    let { state: { customOptions } } = this
    const options = this.getOptions(props)

    if (this.isCustomValueAllowed && customOptions) {
      if (options.find(opt => opt.value === value)) {
        customOptions = null
      } else {
        value = customOptions[0].value
        customOptions = [{ label: value, value }].concat(options)

        const { schema } = props

        if (schema && schema.enum) {
          if (!schema.enum.includes(value)) {
            schema.enum.push(value)
            schema.enumNames.push(value)
          }
        }
      }

      this.setState({ customOptions })
    }

    this.props.onChange(value)
  }
}

export default SearchableSelect



// WEBPACK FOOTER //
// ../src/components/SearchableSelect/SearchableSelect.js