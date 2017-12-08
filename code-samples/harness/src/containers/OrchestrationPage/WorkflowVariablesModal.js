import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal } from 'components'
import css from './WorkflowVariablesModal.css'

import { Table, Column, Cell, SelectionModes, RowHeaderCell } from '@blueprintjs/table'
import { Position, Tooltip } from '@blueprintjs/core'

import { MentionsType } from '../../utils/Constants'
import { MentionUtils } from 'utils'

const ENTITY_VALUE = 'ENTITY'
const VARIABLE_PROPERTY_NAMES = ['name', 'type', 'value', 'mandatory', 'fixed', 'description']
const PLACE_HOLDERS = ['Variable Name', 'type', 'Default Value', 'mandatory', 'fixed', 'Description']
const DEFAULT_VARIABLE_PROPERTIES = { type: 'TEXT', mandatory: false }

const calcTabIndex = (row, col) => 5 * row + col
// Create a representation of an empty variable data representation (for empty table row)
const newEmptyVariable = () => ({ _empty: true })
// Predicate to determine if a variable is a representation of an empty variable
const isEmptyVariable = v => typeof v === 'undefined' || v._empty
const convertIfEmptyVariable = v => {
  // Convert empty variable to use a real variable
  if (isEmptyVariable(v)) {
    delete v._empty
    Object.assign(v, DEFAULT_VARIABLE_PROPERTIES)
  }
}
export default class WorkflowVariablesModal extends React.Component {
  state = {
    initialized: false,
    tableRows: 0,
    variables: [],
    submitting: false
  }

  componentWillReceiveProps (newProps) {
    if (this.state.submitting) {
      return
    }

    const initialized = this.state.initialized

    const variableData = (newProps.data && newProps.data.variables) || []

    const propsChanged = JSON.stringify(this.props) !== JSON.stringify(newProps)

    if ((!initialized && variableData.length) || propsChanged) {
      const variables = []
      const totalSlots = variableData.length + 1

      // Expand number of slots to fill view
      for (let slot = 0; slot < totalSlots; slot++) {
        variables.push(variableData[slot] || newEmptyVariable())
      }

      this.setState({ initialized: true, variables })
    }

    if (newProps.show) {
      this.setupMentions(newProps)
    } else {
      MentionUtils.unregister(MentionsType.WORKFLOW_VARIABLES)
    }
  }

  setupMentions (props) {
    const { appId, workflowId: entityId, serviceId, show } = props

    if (show) {
      MentionUtils.registerForType({
        type: MentionsType.WORKFLOW_VARIABLES,
        args: {
          appId,
          serviceId,
          entityType: 'WORKFLOW',
          entityId
        }
      })
    }
  }

  render () {
    const rows = this.state.variables.length
    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Workflow Variables</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table
            numRows={rows}
            renderRowHeader={this.renderRowHeaderCell}
            columnWidths={[210, 85, 160, 66, 66, 190, 25]}
            allowMultipleSelection={false}
            selectionModes={SelectionModes.NONE}
            loading={true}
            defaultRowHeight={44}
            ref={t => (this.varTable = t)}
          >
            <Column name="Variable Name" renderCell={this.renderInputLineCell} />
            <Column name="Type" renderCell={this.renderSelectTypeCell} />
            <Column name="Default Value" renderCell={this.renderInputLineCell} />
            <Column name="Required" renderCell={this.renderCheckboxCell} />
            <Column name="Fixed" renderCell={this.renderCheckboxCell} />
            <Column name="Description" renderCell={this.renderInputLineCell} />
            <Column name="" renderCell={this.renderDeleteCell} />
          </Table>
          <form-buttons>
            <button type="button" className="save-variables" onClick={this.onSaveVariables}>
              Save
            </button>
            <button type="button" className="add-variable" onClick={this.onAddRow}>
              + Add Row
            </button>
          </form-buttons>
        </Modal.Body>
      </WingsModal>
    )
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.variables.length > prevState.variables.length) {
      this.scrollToBottom()
    }
  }

  getVariablePropertyForTable (row, col) {
    if (this.state.variables.length <= row || col >= VARIABLE_PROPERTY_NAMES.length) {
      return ''
    }

    const variable = this.state.variables[row]
    const property = VARIABLE_PROPERTY_NAMES[col]

    if (isEmptyVariable(variable) || typeof variable[property] === 'undefined') {
      return ''
    }

    return variable[property]
  }

  setVariablePropertyFromTable (row, col, value) {
    const variables = this.state.variables.slice()

    const variable = variables[row]
    const propertyName = VARIABLE_PROPERTY_NAMES[col]

    convertIfEmptyVariable(variable)

    variable[propertyName] = value

    this.setState({ variables: variables })
  }

  deleteVariableFromTable (row) {
    const variables = this.state.variables.slice()
    variables.splice(row, 1)
    this.setState({ variables: variables })
  }

  generateOnChange (row, col, property = 'value') {
    return event => {
      this.setVariablePropertyFromTable(row, col, event.target[property])
    }
  }

  renderRowHeaderCell = row => {
    // const name = (row + 1) + '.'
    const name = ''
    return <RowHeaderCell rowIndex={row} name={name} />
  }

  renderInputLineCell = (row, col) => {
    const isReadOnly = this.isFieldReadOnly(row)
    const mentionAttrs = {}

    if (col === 2) {
      mentionAttrs['data-mentions'] = MentionsType.WORKFLOW_VARIABLES
      mentionAttrs.autoComplete = 'off'
    }

    return (
      <Cell>
        <input
          type="text"
          {...mentionAttrs}
          placeholder={PLACE_HOLDERS[col]}
          value={this.getVariablePropertyForTable(row, col) || ''}
          tabIndex={calcTabIndex(row, col)}
          onChange={this.generateOnChange(row, col)}
          readOnly={isReadOnly}
        />
      </Cell>
    )
  }
  /*
    If the value is entity
    Then make it readonly
  */
  isFieldReadOnly = row => {
    const value = this.getVariablePropertyForTable(row, 1)
    const readOnly = value === ENTITY_VALUE ? true : false
    if (readOnly) {
      return true
    } else {
      return false
    }
  }
  renderCheckboxCell = (row, col) => {
    const value = this.getVariablePropertyForTable(row, col)
    const isReadOnly = this.isFieldReadOnly(row)
    return (
      <Cell>
        <input
          type="checkbox"
          checked={!!value}
          value={true}
          tabIndex={calcTabIndex(row, col)}
          onChange={this.generateOnChange(row, col, 'checked')}
          disabled={isReadOnly}
        />
      </Cell>
    )
  }

  renderSelectTypeCell = (row, col) => {
    const value = this.getVariablePropertyForTable(row, col)
    const isReadOnly = this.isFieldReadOnly(row)
    return (
      <Cell>
        <select
          placeholder={!value ? '' : null}
          value={value || 'Text'}
          tabIndex={calcTabIndex(row, col)}
          onChange={this.generateOnChange(row, col)}
          disabled={isReadOnly}
        >
          <option value="TEXT">Text</option>
          <option value="NUMBER">Number</option>
          <option value="EMAIL">Email</option>
          {value === ENTITY_VALUE && <option value="ENTITY">ENTITY</option>}
        </select>
      </Cell>
    )
  }
  /*
   Dont show the delete icon for entity type variables
  */
  renderDeleteCell = (row, col) => {
    const variableType = this.getVariablePropertyForTable(row, 1)
    if (variableType !== ENTITY_VALUE) {
      return (
        <Cell>
          <Tooltip content="Delete" inline={true} position={Position.BOTTOM}>
            <i className="icons8-delete" onClick={e => this.deleteVariableFromTable(row)} />
          </Tooltip>
        </Cell>
      )
    } else {
      return <Cell />
    }
  }

  scrollToBottom () {
    if (!this.varTable || this.state.submitting) {
      return
    }

    const table = this.varTable.bodyElement
    setTimeout(() => (table.scrollTop = table.scrollHeight), 1)
  }

  onAddRow = () => {
    this.setState(prevState => ({
      variables: prevState.variables.slice().concat(newEmptyVariable())
    }))
  }

  onSaveVariables = () => {
    this.setState({ submitting: true })
    const validateVariables = v => !isEmptyVariable(v) && v.name && v.name.trim() !== ''

    const variables = this.state.variables.filter(validateVariables)

    this.props.onSave && this.props.onSave(variables)
    setTimeout(() => this.setState({ submitting: false }), 1200)
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/WorkflowVariablesModal.js