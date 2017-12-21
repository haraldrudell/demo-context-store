// @flow
import React, { Component } from 'react';
import type { ColumnId, Id } from '@sigmacomputing/sling';
import { css } from 'react-emotion';

import type { SortDef, FuncDef, FieldDef } from 'utils/chart/Chart';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  Radio,
  TextSpan,
  ComboBox,
  Menu
} from 'widgets';

const RadioGroup = Radio.Group;
const { MenuItem } = Menu;

const radioStyle = css`
  display: block;
`;

function getField(fieldMap: { [Id]: FieldDef }, sort: ?SortDef): ?FieldDef {
  return sort && sort.fieldId ? fieldMap[sort.fieldId] : null;
}

function getAggregate(fieldMap: { [Id]: FieldDef }, sort: ?SortDef) {
  const f = getField(fieldMap, sort);
  return f && f.type === 'field' ? f.func : null;
}

function getSortOrder(sort: ?SortDef) {
  return sort ? sort.isAsc : true;
}

export type SortFields = Array<{ columnId: ColumnId, label: string }>;

function generateFieldOptions(fields: SortFields) {
  return fields.map(({ columnId, label }) => {
    return <MenuItem key={columnId} id={columnId} name={label} />;
  });
}

type SortByType = 'natural' | 'field' | 'count';

export type SortInfo = {
  sortOrder: boolean,
  sortBy: SortByType,
  field: ColumnId,
  func: FuncDef,
  fieldOptions: Array<React$Element<*>>
};

type Props = {
  fields: SortFields,
  onSubmitSort: SortInfo => void,
  fieldMap: { [Id]: FieldDef },
  initialSort: ?SortDef,
  onClose: () => void,
  columnName: string
};

export default class OptionsModal extends Component<Props, SortInfo> {
  constructor(props: Props) {
    super(props);
    const field = getField(props.fieldMap, props.initialSort);

    this.state = {
      sortOrder: getSortOrder(props.initialSort),
      sortBy: field ? 'field' : 'natural',
      field:
        (field && field.type === 'field' && field.columnId) ||
        props.fields[0].columnId,
      func: getAggregate(props.fieldMap, props.initialSort) || 'sum',
      fieldOptions: generateFieldOptions(props.fields)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.fields !== this.props.fields) {
      this.setState({
        fieldOptions: generateFieldOptions(nextProps.fields)
      });
    }
  }

  onSubmit = () => {
    const { onSubmitSort } = this.props;

    onSubmitSort(this.state);
  };

  onChangeAsc = (e: { target: { value: boolean } }) => {
    this.setState({
      sortOrder: e.target.value
    });
  };

  onChangeSortBy = (e: { target: { value: SortByType } }) => {
    this.setState({
      sortBy: e.target.value
    });
  };

  onSelectField = (columnId: string) => {
    this.setState({
      field: columnId
    });
  };

  onSelectAgg = (func: FuncDef) => {
    this.setState({
      func
    });
  };

  renderFooter() {
    const { onClose } = this.props;

    return [
      <Button key="cancel" type="secondary" onClick={onClose}>
        Cancel
      </Button>,
      <Button key="confirm" type="primary" onClick={this.onSubmit}>
        OK
      </Button>
    ];
  }

  renderFields() {
    const { field, fieldOptions } = this.state;

    return (
      <ComboBox
        selected={field}
        width="200px"
        setSelection={this.onSelectField}
        doNotLayer
      >
        {fieldOptions}
      </ComboBox>
    );
  }

  renderAggregate() {
    const { func } = this.state;
    return (
      <ComboBox
        selected={func}
        width="200px"
        setSelection={this.onSelectAgg}
        doNotLayer
      >
        <MenuItem id="sum" name="Sum" />
        <MenuItem id="avg" name="Average" />
        <MenuItem id="median" name="Median" />
        <MenuItem id="min" name="Minimum" />
        <MenuItem id="max" name="Maximum" />
      </ComboBox>
    );
  }

  renderContent() {
    const { sortOrder, sortBy } = this.state;

    return (
      <Box>
        <TextSpan font="header4">Sort Order</TextSpan>
        <Box>
          <RadioGroup onChange={this.onChangeAsc} value={sortOrder}>
            <Box>
              <Radio className={radioStyle} value={true}>
                <TextSpan font="bodyMedium">Ascending</TextSpan>
              </Radio>
            </Box>
            <Radio className={radioStyle} value={false}>
              <TextSpan font="bodyMedium">Descending</TextSpan>
            </Radio>
          </RadioGroup>
        </Box>
        <Divider my={3} color="darkBlue5" />
        <TextSpan font="header4">Sort By</TextSpan>
        <Box>
          <RadioGroup
            css={`width: 100%;`}
            value={sortBy}
            onChange={this.onChangeSortBy}
          >
            <Box>
              <Radio value="natural">
                <TextSpan font="bodyMedium">Data source order</TextSpan>
              </Radio>
            </Box>
            <Box mb={4}>
              {this.props.fields.length > 0 && (
                <Radio value="field">
                  <span css={`position: relative;`}>
                    <div css={`position: absolute; display: inline-block;`}>
                      <Flex>
                        <Flex column mr={3}>
                          <TextSpan font="bodyMedium">Field</TextSpan>
                          {this.renderFields()}
                        </Flex>
                        <Flex column>
                          <TextSpan font="bodyMedium">Aggregate</TextSpan>
                          {this.renderAggregate()}
                        </Flex>
                      </Flex>
                    </div>
                  </span>
                </Radio>
              )}
            </Box>
          </RadioGroup>
        </Box>
      </Box>
    );
  }

  render() {
    const { columnName, onClose } = this.props;
    return (
      <Modal
        visible
        onClose={onClose}
        title={<TextSpan font="header3">Sort ({columnName})</TextSpan>}
        footer={this.renderFooter()}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/format/OptionsModal.js