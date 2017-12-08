import React from 'react'
import './StageView.css'
import 'optional-tooltip'

let dragIndex

export default class StageView extends React.Component {
  state = {}

  renderPlaceholder () {
    return (
      <stage-view edit-mode place-holder onClick={this.onClick}>
        <hr />
        <status-circle />
        <section>
          <strong>Click to add Pipeline Stage</strong>
        </section>
      </stage-view>
    )
  }

  onClick = () => {
    const { status, hasQueuedData } = this.props

    if (status && (status.queued || status.pending)) {
      if (!(status.queued && hasQueuedData)) {
        return false
      }
    }

    this.setState({
      selected: !this.state.selected
    })
    this.props.onClick()
  }

  componentWillReceiveProps (newProps) {
    this.setState({ selected: !!newProps.selected })
  }

  componentDidMount () {
    const { view, props: { editMode } } = this

    if (editMode && view && !view.handlersAdded) {
      view.firstElementChild.addEventListener('dragstart', this.dragStart, false)
      view.addEventListener('dragenter', this.dragEnter, false)
      view.addEventListener('dragover', this.dragOver, false)
      view.addEventListener('dragleave', this.dragLeave, false)
      view.addEventListener('drop', this.drop, false)
      view.handlersAdded = true
    }
  }

  componentWillUnmount () {
    const { view, props: { editMode } } = this

    if (editMode && view) {
      view.firstElementChild.removeEventListener('dragstart', this.dragStart)
      view.removeEventListener('dragenter', this.dragEnter)
      view.removeEventListener('dragover', this.dragOver)
      view.removeEventListener('dragleave', this.dragLeave)
      view.removeEventListener('drop', this.drop)
      view.handlersAdded = false
    }
  }

  findStageViewNode = e => {
    let node = e

    while (node && node.nodeName.toLowerCase() !== 'stage-view') {
      node = node.parentNode
    }

    return node
  }

  dragStart = e => {
    const view = this.findStageViewNode(e.target)
    const index = view.getAttribute('index')

    dragIndex = index
  }

  dragEnter = e => {
    const view = this.findStageViewNode(e.target)
    const index = view.getAttribute('index')

    if (index !== dragIndex) {
      view.setAttribute('dropable', true)
      view.setAttribute('drop-direction', dragIndex > index ? 'left' : 'right')
    }

    e.preventDefault()
  }

  dragLeave = e => {
    const view = this.findStageViewNode(e.target)
    const index = view.getAttribute('index')

    if (index !== dragIndex && e.target === view) {
      view.removeAttribute('dropable')
      view.removeAttribute('drop-direction')
    }

    e.preventDefault()
  }

  dragOver = e => {
    if (e.preventDefault) {
      e.preventDefault()
    }

    e.dataTransfer.dropEffect = 'move'

    return false
  }

  drop = e => {
    const view = this.findStageViewNode(e.target)
    const index = view.getAttribute('index')

    if (index !== dragIndex) {
      view.removeAttribute('dropable')
      view.removeAttribute('drop-direction')
      this.props.onDrag({ fromIndex: dragIndex, toIndex: index })
    }

    e.preventDefault()
  }

  render () {
    const { editMode, header, name, description, status, placeholder, parallel, type, index } = this.props
    const selected = !editMode && this.state.selected && { selected: true }
    const edit = editMode && { 'edit-mode': true, index }
    const draggable = editMode && { draggable: true }

    if (placeholder) {
      return this.renderPlaceholder()
    }

    return (
      <stage-view
        {...status}
        {...edit}
        onClick={this.onClick}
        {...selected}
        {...parallel}
        type={type}
        ref={view => (this.view = view)}
      >
        <header {...draggable}>
          <optional-tooltip class="tooltip--bottom tooltip--large" data={header}>
            <span>{header}</span>
          </optional-tooltip>
          {editMode && (
            <button data-delete onClick={this.props.onDelete} className="tooltip--bottom" data-tooltip="Delete" />
          )}
        </header>
        <section>
          <optional-tooltip class="tooltip--bottom tooltip--medium" data={name}>
            <strong>{type === 'APPROVAL' ? 'Approval' : name}</strong>{' '}
            {/* Approval stage is always rendered as 'Approval' */}
          </optional-tooltip>
          {description}
        </section>
        {editMode && (
          <form-buttons>
            <button data-add onClick={this.props.onAdd} className="tooltip--top" data-tooltip="Insert a stage" />
          </form-buttons>
        )}
        <hr />
        <status-circle />
      </stage-view>
    )
  }
}



// WEBPACK FOOTER //
// ../src/pages/pipelines/views/StageView.js