import React from 'react'
import TagsInput from 'react-tagsinput'
import css from './WingsTagsInput.css'

export default class WingsTagInput extends React.Component {
  inputProps = {
    className: 'react-tagsinput-input',
    placeholder: ''
  }

  constructor () {
    super()
    this.state = { tags: [], addKeys: [] }
  }

  componentWillMount () {
    this.setState({ tags: this.props.value })
  }

  componentDidUpdate (prevProps, prevState) {}

  componentWillReceiveProps (newProps) {}

  handleChange = (tags, changed, changedIndexes) => {
    this.setState({ tags })
    this.props.handleChange(tags, changedIndexes[0])
  }

  handleChangeInput = tag => {
    this.setState({ tag })
  }

  defaultRenderTag = props => {
    const { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other } = props
    return (
      <span key={key} {...other} onClick={this.props.onTagClick} disabled={disabled}>
        <span className="tag-content">
          {getTagDisplayValue(tag)}
        </span>

        <a
          className={classNameRemove}
          onClick={e => {
            onRemove(key)
            this.stopPropagation(e)
          }}
        />
      </span>
    )
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  render () {
    return (
      <div className={css.main}>
        <TagsInput
          value={this.state.tags}
          onChange={this.handleChange}
          onChangeInput={this.handleChangeInput}
          addKeys={this.state.addKeys}
          inputProps={this.inputProps}
          renderTag={this.defaultRenderTag}
          disabled="true"
        />
        <button type="button" className={'AddOptionsbtn btn btn-info'} onClick={this.props.addOption} />
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/WingsTagsInput/WingsTagsInput.js