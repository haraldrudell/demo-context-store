// @flow
import * as React from 'react';
import { DropTarget } from 'react-dnd';
import type { ColumnId, ValueType, Id } from '@sigmacomputing/sling';

import type {
  BinDef,
  ClassificationDef,
  FuncDef,
  SortDef,
  FieldDef,
  ResolutionDef
} from 'utils/chart/Chart';
import { Menu, Text } from 'widgets';
import OptionsModal, { type SortInfo, type SortFields } from './OptionsModal';
import ChartField, { Chiclet } from './ChartField';
import ItemTypes from 'const/ItemTypes';

const { MenuItem, SubMenu } = Menu;

export type ResolutionType = 'AxisY' | 'AxisX';

class Dropzone extends React.Component<
  {
    connectDropTarget: (React.Element<any>) => ?React.Element<any>,
    id?: ColumnId,
    fields?: SortFields,
    setColumn: (number, ?string) => void,
    onUpdateFunc: (index: number, func?: FuncDef) => void,
    onUpdateBin: (index: number, bin?: BinDef) => void,
    onUpdateClassification: (
      index: number,
      classification?: ClassificationDef
    ) => void,
    onUpdateSort: (index: number, sort: SortInfo) => void,
    onUpdateResolution: (index: number, resolution: ResolutionDef) => void,
    fieldMap: { [Id]: FieldDef },
    type?: ValueType,
    func?: FuncDef,
    bin?: BinDef,
    classification?: ClassificationDef,
    sort?: SortDef,
    resolution?: ResolutionDef,
    resolutionType?: ResolutionType,
    index: number,
    label?: string,
    isOver: boolean
  },
  {
    showOptions: boolean
  }
> {
  static defaultProps = {
    setColumn: (() => {}: (number, ?string) => void)
  };

  constructor(props) {
    super(props);

    this.state = {
      showOptions: false
    };
  }

  removeField = () => {
    const { index, setColumn } = this.props;
    setColumn(index);
  };

  onSubmitSort = (s: SortInfo) => {
    const { onUpdateSort, index } = this.props;

    onUpdateSort(index, s);
    this.onClose();
  };

  onClose = () => {
    this.setState({
      showOptions: false
    });
  };

  onMenuAction = (
    action:
      | FuncDef
      | ResolutionDef
      | BinDef
      | ClassificationDef
      | 'sort'
      | 'none'
      | 'bin_none'
  ) => {
    const {
      onUpdateFunc,
      onUpdateBin,
      onUpdateResolution,
      onUpdateClassification,
      index
    } = this.props;

    if (action === 'sort') {
      this.setState({
        showOptions: true
      });
    } else if (action === 'primary' || action === 'secondary') {
      onUpdateResolution(index, action);
    } else if (action === 'continuous' || action === 'discrete') {
      onUpdateClassification(index, action);
    } else {
      switch (action) {
        case 'year':
        case 'month':
        case 'day':
        case 'hour':
        case 'minute':
        case 'second':
          onUpdateBin(index, action);
          break;
        case 'bin_none':
          onUpdateBin(index);
          break;
        default:
          onUpdateFunc(index, action !== 'none' ? action : undefined);
          break;
      }
    }
  };

  renderColumn(label: string) {
    const {
      id,
      classification,
      func,
      bin,
      index,
      isOver,
      type,
      onUpdateFunc,
      resolutionType
    } = this.props;

    let agg;
    let unit;
    let res;
    let cls;
    switch (type) {
      case 'number':
        agg = (
          <SubMenu id="aggregation" name="Aggregation">
            <MenuItem id="none" name="None" />
            <MenuItem id="sum" name="Sum" />
            <MenuItem id="avg" name="Avg" />
            <MenuItem id="median" name="Median" />
            <MenuItem id="min" name="Minimum" />
            <MenuItem id="max" name="Maximum" />
          </SubMenu>
        );
        break;
      case 'datetime':
        unit = (
          <SubMenu id="unit" name="Time Unit">
            <MenuItem id="bin_none" name="None" />
            <MenuItem id="year" name="Year" />
            <MenuItem id="month" name="Month" />
            <MenuItem id="day" name="Day" />
            <MenuItem id="hour" name="Hour" />
            <MenuItem id="minute" name="Minute" />
            <MenuItem id="second" name="Second" />
          </SubMenu>
        );
        break;
      default:
        break;
    }

    if (!func && (type === 'number' || type === 'datetime')) {
      cls = (
        <SubMenu id="cls" name="Axis">
          <MenuItem
            id="continuous"
            name="Continuous"
            iconType={
              !classification || classification === 'continuous' ? 'check' : ' '
            }
          />
          <MenuItem
            id="discrete"
            name="Discrete (Even Spacing)"
            iconType={classification === 'discrete' ? 'check' : ' '}
          />
        </SubMenu>
      );
    }

    if (resolutionType) {
      const resolution = this.props.resolution || 'primary';
      res = (
        <SubMenu id="resolution" name="Axis Position">
          <MenuItem
            id="primary"
            iconType={resolution === 'primary' ? 'check' : ' '}
            name={resolutionType === 'AxisX' ? 'Bottom' : 'Left'}
          />
          <MenuItem
            id="secondary"
            iconType={resolution === 'secondary' ? 'check' : ' '}
            name={resolutionType === 'AxisX' ? 'Top' : 'Right'}
          />
        </SubMenu>
      );
    }

    return (
      <ChartField
        id={id}
        menu={
          <Menu
            mode="vertical"
            onMenuItemClick={this.onMenuAction}
            selected={func}
          >
            <MenuItem id="sort" name="Sort Order" />
            {agg}
            {unit}
            {cls}
            {res}
          </Menu>
        }
        onUpdateFunc={onUpdateFunc}
        removeField={this.removeField}
        type={type}
        func={func}
        bin={bin}
        index={index}
        label={label}
        isOver={isOver}
      />
    );
  }

  renderPlaceholder() {
    const { index, isOver } = this.props;
    return (
      <Chiclet color="darkBlue3" index={index} isOver={isOver}>
        <Text font="bodyMedium">Drag field here</Text>
      </Chiclet>
    );
  }

  render() {
    const { connectDropTarget, label, sort, fields, fieldMap } = this.props;
    const { showOptions } = this.state;
    return (
      <div>
        {showOptions &&
          fields &&
          label && (
            <OptionsModal
              fields={fields}
              initialSort={sort}
              fieldMap={fieldMap}
              onClose={this.onClose}
              onSubmitSort={this.onSubmitSort}
              columnName={label}
            />
          )}
        {connectDropTarget(
          <div>
            {label ? this.renderColumn(label) : this.renderPlaceholder()}
          </div>
        )}
      </div>
    );
  }
}

function collectCol(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
  };
}

const keyTarget = {
  canDrop(props, monitor) {
    const fromProps = monitor.getItem();
    return props.id !== fromProps.id || props.func !== fromProps.func;
  },

  drop(props, monitor) {
    const { id, func } = monitor.getItem();
    const { index, setColumn, onUpdateFunc } = props;

    setColumn(index, id);
    if (func) {
      onUpdateFunc(index, func);
    }
  }
};

export default DropTarget(
  [ItemTypes.COLUMN_HEADER, ItemTypes.COLUMN, ItemTypes.CHART],
  keyTarget,
  collectCol
)(Dropzone);



// WEBPACK FOOTER //
// ./src/components/ChartInspector/format/Dropzone.js