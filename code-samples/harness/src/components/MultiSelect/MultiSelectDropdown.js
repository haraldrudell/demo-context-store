import React from 'react'
import Select from 'react-select'
import Utils from '../Utils/Utils'

const MultiSelectDropdown = React.createClass({
  displayName: 'MultiSelectField',
  propTypes: {
    label: React.PropTypes.string
  },
  getInitialState () {
    const options = this.props.data
    /*
    to come up with already selected value
    for editing a user - who has a role with applications
    */
    const value = this.props.value
    return {
      options,
      value: value !== undefined ? value : []
    }
  },
  componentWillReceiveProps (newProps) {
    // get data from this.props.data or from schema's enum arrays:
    let data = this.props.data
    if (!data) {
      data = Utils.enumArrToSelectArr(newProps.schema.enum, newProps.schema.enumNames)
    }
    if (newProps.disabled === true) {
      const value = ''
      this.setState({ value })
      this.props.onChange(value)
    } else {
      this.setState({
        options: data,
        value: newProps.value
      })
    }
  },
  handleSelectChange (value) {
    if (value === null) {
      value = ''
    }
    this.setState({ value })
    this.props.onChange(value)
  },
  render () {
    return (
      <Select
        multi
        simpleValue
        value={this.state.value}
        placeholder={this.props.description}
        disabled={this.props.disabled}
        options={this.state.options}
        optionRenderer={this.props.optionRenderer}
        onChange={this.handleSelectChange}
      />
    )
  }
})

export default MultiSelectDropdown



// WEBPACK FOOTER //
// ../src/components/MultiSelect/MultiSelectDropdown.js