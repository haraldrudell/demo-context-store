import React from 'react'
import Autosuggest from 'react-autosuggest'

function getSuggestionValue (suggestion) { // when suggestion selected, this function tells
  return suggestion.name // what should be the value of the input
}

function renderSuggestion (suggestion) {
  return (
    <span>{suggestion.name}</span>
  )
}

export default class AutoComplete extends React.Component {
  constructor () {
    super()
    this.state = {
      value: '',
      suggestions: []
    }
    this.onChange = this.onChange.bind(this)
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this)
  }

  componentWillMount () {
    this.setState({
      value: this.props.value,
      suggestions: this.props.getSuggestions()
    })
  }
  onSuggestionsFetchRequested = ({ value }) => {
  }

  onSuggestionsClearRequested = () => {

  }

  onChange (event, { newValue }) {
    this.props.onChange(event, { newValue })
    this.setState({
      value: newValue
    })
  }

  onSuggestionsUpdateRequested ({ value }) {
    this.setState({
      suggestions: this.props.getSuggestions(value)
    })
  }

  onSuggestionSelected = (event, { suggestion, suggestionValue, sectionIndex, method }) => {
    event.preventDefault() // to prevent 'Enter' from submitting the form
  }

  shouldRenderSuggestions = (value) => {
    return true
  }

  render () {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange
    }
    return (
      <Autosuggest suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionSelected={this.onSuggestionSelected}
        tabToSelect={true}
      />
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AutoComplete/AutoComplete.js