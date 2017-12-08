import React from 'react'
import Select from 'react-select'

/* --------- DEPRECATED !!! => use MultiSelectDropdown ---------*/

const MultiSelect = React.createClass({
  displayName: 'MultiSelectField',
  propTypes: {
    label: React.PropTypes.string
  },
  getInitialState () {
    const options = this.props.data
    return {
      options,
      value: []
    }
  },
  componentWillReceiveProps (newProps) {
    if (newProps.disabled === true) {
      const value = ''
      this.setState({ value })
      this.props.onChange( value )
    } else {
      this.setState({
        options: newProps.data,
        value: newProps.value
      })
    }
  },
  handleSelectChange (value) {
    if (value === null) {
      value = ''
    }
    this.setState({ value })
    this.props.onChange( value )
  },
  render () {
    return (
      <Select multi simpleValue
        value={this.props.value} /* --------- This is not correct => use MultiSelectDropdown ---------*/
        placeholder={this.props.description}
        disabled={this.props.disabled}
        options={this.state.options}
        optionRenderer={this.props.optionRenderer}
        onChange={this.handleSelectChange}>
      </Select>
    )
  }
})

export default MultiSelect



// WEBPACK FOOTER //
// ../src/components/MultiSelect/MultiSelect.js