import React from 'react'
// import ReactDataGrid from 'react-data-grid'
import {
  DataGrid,
  Pills,
  TooltipOverlay,
  TruncateText,
  InlineEditableText,
  LabellingDropdown,
  DropdownMenu,
  NameValueList,
  UITimeAgo,
  UIButton,
  CollapsiblePanel,
  SearchInput,
  Utils
} from 'components'
import { Position, Popover } from '@blueprintjs/core'
import { MenuItem, Dropdown } from 'react-bootstrap'
import * as Icons from 'styles/icons'
import css from './TestComponents.css'

const data = [
  { name: 'Scope 2', description: 'Descr 2', uuid: 'uuid2', createdAt: 1109137329933 },
  { name: 'Scope 1', description: 'Descr 1', uuid: 'bhbxIRyhTVyKMZDvE-xZ4g', createdAt: 1209117329933 },
  { name: 'Scope 3', description: 'Descr 3', uuid: 'uuid3', createdAt: 1309137329933 }
]
const log = s => console.log(s)
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sollicitudin ullamcorper velit,
  sed auctor dolor mollis eu. Ut orci erat, accumsan vitae vestibulum vel, auctor eget massa.
  Etiam mattis vitae nibh id luctus. Nulla blandit eleifend felis a egestas. Sed vel fermentum leo.
  Curabitur aliquam, augue vel volutpat pulvinar, lorem nisl elementum orci, nec viverra diam magna
  sit amet elit. In commodo quam et vehicula luctus.`
const wrap = (name, comp) => (
  <div>
    <h4 style={{ marginTop: 30, color: 'var(--color-grey)' }}>{name}</h4>
    {comp}
  </div>
)

/* --------- Demonstrate Harness Components --------- */

class TestComponents extends React.Component {
  state = {
    editableText: 'Click to Edit me.',
    popoverShow: false,
    gridData: data
  }

  renderColors = () => {
    const colors = [
      'blue',
      'blue-light',
      'green',
      'green-light',
      'yellow',
      'yellow-light',
      'red',
      'red-light',
      'black',
      'dark-grey',
      'dark-grey-50',
      'grey',
      'grey-50',
      'grey-light',
      'grey-light-50',
      'white'
    ]
    return wrap(
      'Colors',
      <div className={css.inline}>
        {colors.map(colorName => {
          return (
            <span key={colorName} className={css.colorBox} style={{ backgroundColor: `var(--color-${colorName})` }}>
              {colorName}
            </span>
          )
        })}
      </div>
    )
  }

  renderUiCard () {
    return wrap(
      'UI Card',
      <ui-card>
        <header>
          <card-title>
            <item-name class="wings-text-link">Test-title</item-name>
            <item-description>Test-Description</item-description>
          </card-title>
          <ui-card-actions>
            <UIButton icon="Edit" />
            <UIButton icon="Trash" />
          </ui-card-actions>
        </header>
        <main>Test-content</main>
      </ui-card>
    )
  }

  renderDropdown () {
    const options = [{ label: 'Menu 1', onClick: () => {} }, { label: 'Menu 2', onClick: () => {}, className: 'bold' }]
    const customContent = (
      <ui-popover-content>
        <header>
          <ui-title>Custom Popover Title</ui-title>
        </header>
        <main>{loremIpsum}</main>
      </ui-popover-content>
    )
    const customButton = <button>Custom Button</button>
    return wrap(
      'Dropdown',
      <div className={css.inline + ' ' + css.widthLarge}>
        <DropdownMenu title="Dropdown Menu" options={options} />
        <DropdownMenu title="Custom Button Class" options={options} buttonClassName={css.bold} />
        <DropdownMenu title="Custom Button" options={options} button={customButton} />
        <DropdownMenu
          title="Custom Content"
          content={customContent}
          caret={false}
          popoverProps={{
            popoverClassName: css.customPopover
          }}
        />
      </div>
    )
  }

  renderDropdownWithLabel () {
    const arr = [{ title: 'A to Z', uuid: 'bhbxIRyhTVyKMZDvE-xZ4g' }, { title: 'Z to A', uuid: 'uuid2' }]
    const menuComp = (
      <Dropdown.Menu bsRole="menu">
        {arr.map((item, idx) => <MenuItem key={item.uuid}>{item.title}</MenuItem>)}
      </Dropdown.Menu>
    )
    return wrap(
      'LabellingDropdown',
      <LabellingDropdown
        width="250px"
        title="Sort By"
        className="apps-dropdown"
        label={<span>{arr[0].title}</span>}
        items={menuComp}
      />
    )
  }

  renderIconButtons () {
    return wrap(
      'Buttons, icons & links',
      <div>
        <div>Font Icons (font-awesome, icons8) are deprecated! Use svg icons in: /src/styles/icons/</div>
        <section className={css.inline + ' ' + css.widthLarge + ' ' + css.addGaps}>
          <div>
            <UIButton>Plain Button (Link)</UIButton>

            <UIButton icon="PlusAccent">Add Var</UIButton>

            <UIButton icon="Add" medium>
              New Item
            </UIButton>
          </div>
          <div>
            <UIButton type="button">Button</UIButton>

            <UIButton type="button" disabled>
              Disabled
            </UIButton>

            <UIButton type="submit">Submit</UIButton>

            <UIButton type="submit" disabled>
              Submit
            </UIButton>
          </div>
          <div>
            <UIButton icon="Plus" />
            <UIButton icon="Cross" />
            <UIButton icon="Trash" tooltip="Delete" />
            <UIButton icon="Setup" />
            <UIButton icon="Setup" medium />
            <UIButton icon="Setup" large />
          </div>
        </section>
        <section className={css.inline + ' ' + css.widthLarge + ' ' + css.addGaps}>
          <div>
            <UIButton type="button" accent>
              Accent
            </UIButton>
            <UIButton type="button" accent disabled>
              Disabled
            </UIButton>
            <UIButton type="button" icon="PlusWhite" accent>
              Accent
            </UIButton>
          </div>
        </section>
      </div>
    )
  }

  renderCollapsiblePanel () {
    return wrap(
      'CollapsiblePanel',
      <div>
        <CollapsiblePanel title="Collapsible Panel 1" isOpen={false}>
          <p>{loremIpsum}</p>
        </CollapsiblePanel>
        <CollapsiblePanel title="Collapsible Panel 2" isOpen={false} summary={<div>Summary Info</div>}>
          <p>{loremIpsum}</p>
        </CollapsiblePanel>
      </div>
    )
  }

  renderInlineEditing () {
    const { editableText } = this.state
    const onChange = newText => this.setState({ editableText: newText })
    return wrap(
      'InlineEditableText',
      <InlineEditableText value={editableText} onChange={onChange}>
        {editableText}
      </InlineEditableText>
    )
  }

  renderSpinner () {
    return wrap('Spinner (for fetching)', <span className="wings-spinner right-gap" />)
  }

  renderTable () {
    const customRenderer = props => <strong>CUSTOM: {props.data.name.toUpperCase()}</strong>
    const columns = [
      { key: 'uuid', name: 'ID', width: 100 },
      { key: 'name', name: 'Name', width: 200 },
      { key: 'description', name: 'Custom', width: 200, renderer: customRenderer },
      { key: 'createdAt', name: 'Created At', renderer: 'TIME_AGO_RENDERER' } // or 'TIME_RENDERER'
    ]
    return wrap(
      'Table',
      <div className="grid-container">
        <DataGrid columns={columns} gridData={this.state.gridData} minHeight={200} />
      </div>
    )
  }

  renderTime () {
    const timeValue = 1509137329933
    return wrap(
      'Time',
      <div>
        <div>Default Format - {Utils.formatDate(timeValue)}</div>
        <div>
          User-friendly - <UITimeAgo value={timeValue} />
        </div>
      </div>
    )
  }

  renderNameValueList () {
    const arr1 = [
      { name: 'Title (dt) 1', value: 'Definition (dd) 1' },
      { name: 'Title (dt) 2', value: 'Definition (dd) 2' }
    ]
    const arr2 = [
      { customName: 'Very long long long long Title (dt) 100', customValue: 'Definition (dd) 100' },
      { customName: 'Very long long long long Title (dt) 200', customValue: 'Definition (dd) 200' }
    ]
    return wrap(
      'Name-Value List (dl)',
      <div className={css.widthMedium}>
        <div>
          List 1
          <NameValueList data={arr1} />
        </div>
        <div>
          List 2
          <NameValueList
            data={arr2}
            headers={['Name', 'Value']}
            customKeys={['customName', 'customValue']}
            customWidths={['20%', '80%']}
            renderName={item => <TruncateText inputText={item.customName} />}
          />
        </div>
      </div>
    )
  }

  renderPills () {
    return wrap(
      'Pills',
      <div>
        <div style={{ marginBottom: 10 }}>
          <Pills data={data} readOnly={true} />
        </div>
        <div>
          <Pills data={data} onAdd={() => log('onAdd')} onEdit={() => log('onEdit')} />
        </div>
      </div>
    )
  }

  renderPopover () {
    const content = (
      <ui-popover-content>
        <header>
          <ui-title>Custom Popover Title</ui-title>
        </header>
        <main>{loremIpsum}</main>
      </ui-popover-content>
    )
    return wrap(
      'Popover',
      <Popover content={content} position={Position.RIGHT}>
        <UIButton>Show Popover</UIButton>
      </Popover>
    )
  }

  renderSearchInput () {
    return wrap('SearchInput', <SearchInput onChange={() => {}} />)
  }

  renderTooltip () {
    return wrap(
      'TooltipOverlay',
      <TooltipOverlay tooltip="Test Tooltip">
        <span>Hover on me</span>
      </TooltipOverlay>
    )
  }

  renderTruncateText () {
    const testArray = [
      'array of strings ',
      'array of strings ',
      'array of strings ',
      'array of strings ',
      'array of strings ',
      'array of strings ',
      'array of strings '
    ]
    return wrap(
      'TruncateText',
      <div style={{ width: 200 }}>
        <TruncateText inputText="Test TruncateText with a very long long long text" />
        <TruncateText inputText="Test TruncateText wth shrt txt" />
        <TruncateText inputText={testArray} isArray />
      </div>
    )
  }

  renderSvgIcons () {
    return wrap('SVG Icons', <Icons.HarnessLogo className="lg-icon" />)
  }

  renderDeprecated () {
    return wrap(
      'Deprecated (Do not use)',
      <div>
        <div>Font Icons (font-awesome, icons8) are deprecated! Use svg icons in: /src/styles/icons/</div>
        <div>Need SVG icons for these Icons8</div>
        <i className="icons8-pencil-tip right-gap" title="icons8-pencil-tip" />
      </div>
    )
  }

  render () {
    return (
      <section className={css.main}>
        <h3>Living Style Guide</h3>

        <div>
          <h4 style={{ marginTop: 30 }}>Form related components</h4>
          <div>Refer to [Simple Form Modal] (TestModal.js)</div>
        </div>

        {this.renderColors()}

        {this.renderUiCard()}

        {this.renderIconButtons()}

        {this.renderCollapsiblePanel()}

        {this.renderDropdown()}

        {this.renderDropdownWithLabel()}

        {this.renderInlineEditing()}

        {this.renderNameValueList()}

        {this.renderPills()}

        {this.renderPopover()}

        {this.renderSearchInput()}

        {this.renderSpinner()}

        {this.renderTable()}

        {this.renderTime()}

        {this.renderTooltip()}

        {this.renderTruncateText()}

        {this.renderSvgIcons()}

        {this.renderDeprecated()}
      </section>
    )
  }
}

export default TestComponents



// WEBPACK FOOTER //
// ../src/containers/TestPage/TestComponents.js