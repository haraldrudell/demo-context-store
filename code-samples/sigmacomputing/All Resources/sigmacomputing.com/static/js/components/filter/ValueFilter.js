// @flow

import React, { PureComponent } from 'react';
import Color from 'color';
import Highlighter from 'react-highlight-words';

import { Box, Flex, Icon, IconButton, Text } from 'widgets';
import colors from 'styles/colors';

const BLANK_SEARCH = [''];

export const ValueCount = ({ count }: { count: ?number }) => (
  <Text align="right" font="table">
    {count != null ? count : ''}
  </Text>
);

export const ValueBar = ({ percent }: { percent: ?number }) => (
  <Box
    css={`height: 4px;`}
    bg="blueAccent"
    width={percent ? `${percent * 100}%` : '0%'}
  />
);

export type ValueDesc = {|
  label: string,
  isSelected?: boolean,
  count: ?number,
  percent: ?number
|};

function FilterValue({
  searchTerm,
  value,
  ...rest
}: {
  searchTerm?: ?string,
  value: ValueDesc
}) {
  const searchWords = searchTerm ? [searchTerm] : BLANK_SEARCH;

  return (
    <Flex
      align="center"
      flexGrow
      justify="space-between"
      px={2}
      pt={1}
      pb={2}
      {...rest}
    >
      <Flex column flexGrow>
        <Text truncate mr={2} font="table" title={value.label}>
          <Highlighter
            searchWords={searchWords}
            textToHighlight={value.label}
          />
        </Text>
        <ValueBar percent={value.percent} />
      </Flex>
      <ValueCount count={value.count} />
    </Flex>
  );
}

const INCLUDE_BG = Color(colors.blueAccent)
  .alpha(0.2)
  .string();
const bgColor = isInclude => (isInclude ? INCLUDE_BG : 'darkBlue5');

const SelectedValue = ({
  isInclude,
  value
}: {
  isInclude: boolean,
  value: ValueDesc
}) => <FilterValue bg={bgColor(isInclude)} value={value} />;

const SwitchItem = ({ label, on, ...rest }: { label: string, on: boolean }) => (
  <Box css={`cursor: pointer;`} color={on ? 'blue' : 'darkBlue3'} {...rest}>
    {label}
  </Box>
);

class Switch extends PureComponent<{|
  isX: boolean,
  onChange: ?(boolean) => void,
  xLabel: string,
  yLabel: string
|}> {
  onClick = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const { isX, onChange } = this.props;
    const item = evt.currentTarget.dataset.item;
    if ((item === 'x' && isX) || (item === 'y' && !isX)) return;

    if (onChange) onChange(!isX);
  };

  render() {
    const { isX, xLabel, yLabel } = this.props;
    return (
      <Flex font="header5">
        <SwitchItem
          label={xLabel}
          on={isX}
          onClick={this.onClick}
          data-item="x"
        />
        <Box bg="darkBlue4" mx={1} my="2px" width="1px" />
        <SwitchItem
          label={yLabel}
          on={!isX}
          onClick={this.onClick}
          data-item="y"
        />
      </Flex>
    );
  }
}

export class SelectedValues extends PureComponent<{|
  isInclude: boolean,
  onRemove?: string => void,
  onSetInclude?: boolean => void,
  values: Array<ValueDesc>
|}> {
  onRemove = (evt: SyntheticMouseEvent<HTMLElement>) => {
    // $FlowFixMe: haven't figured out the type wrangling
    const id = evt.currentTarget.dataset.id;
    if (!id) return;

    const { onRemove } = this.props;
    if (onRemove) onRemove(id);
  };

  render() {
    const { isInclude, onSetInclude, values } = this.props;

    return (
      <div>
        <Flex align="center" justify="space-between" py={2}>
          <Text font="header5">
            {`${values.length} value${values.length === 1 ? '' : 's'} selected`}
          </Text>
          <Switch
            isX={isInclude}
            onChange={onSetInclude}
            xLabel="Include"
            yLabel="Exclude"
          />
        </Flex>
        {values.map((value, idx) => (
          <Flex key={value.label} mt={idx === 0 ? 0 : '1px'}>
            <SelectedValue isInclude={isInclude} value={value} />
            <IconButton
              bg={bgColor(isInclude)}
              data-id={value.label}
              ml="1px"
              onClick={this.onRemove}
              size="8px"
              type="close"
              width={4}
            />
          </Flex>
        ))}
      </div>
    );
  }
}

export const ResultValue = ({ value, ...rest }: { value: ValueDesc }) => (
  <FilterValue
    css={`
      cursor: pointer;
      background-color: transparent;
      transition: background-color 200ms ease-in-out;

      &:hover {
        background-color: ${INCLUDE_BG};
      }
    `}
    opacity={value.isSelected ? 0.4 : 1}
    value={value}
    {...rest}
  />
);

export class ResultValues extends PureComponent<{
  onSelect?: string => void,
  values: Array<ValueDesc>,
  searchTerm?: ?string
}> {
  onSelect = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const id = evt.currentTarget.dataset.id;
    if (!id) return;

    const { onSelect } = this.props;
    if (onSelect) onSelect(id);
  };

  render() {
    const { searchTerm } = this.props;
    return (
      <div css={`max-height: 400px; overflow: auto;`}>
        {this.props.values.map(value => (
          <ResultValue
            key={value.label}
            data-id={value.label}
            onClick={this.onSelect}
            value={value}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    );
  }
}

function byValueCmp(a: ValueDesc, b: ValueDesc) {
  if (a.label < b.label) return -1;
  if (a.label > b.label) return 1;
  return 0;
}

function byCountCmp(a: ValueDesc, b: ValueDesc) {
  if (a.count != null && b.count != null) {
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
  }
  return byValueCmp(a, b);
}

function getSortedValues(values: Array<ValueDesc>, sortByValue: boolean) {
  const sortedValues = values.slice();
  sortedValues.sort(sortByValue ? byValueCmp : byCountCmp);
  return sortedValues;
}

type TopValuesProps = {|
  onSelect?: string => void,
  searchTerm?: ?string,
  values: Array<ValueDesc>
|};

export class TopValues extends PureComponent<
  TopValuesProps,
  {|
    displayValues: Array<ValueDesc>,
    sortedByValue: boolean
  |}
> {
  constructor(props: TopValuesProps) {
    super(props);

    const DEFAULT_SORT_BY_VALUE = false;
    this.state = {
      displayValues: getSortedValues(props.values, DEFAULT_SORT_BY_VALUE),
      sortedByValue: DEFAULT_SORT_BY_VALUE
    };
  }

  componentWillUpdate(nextProps: TopValuesProps) {
    if (this.props.values !== nextProps.values) {
      this.setState({
        displayValues: getSortedValues(
          nextProps.values,
          this.state.sortedByValue
        )
      });
    }
  }

  handleSetSort = (sortByValue: boolean) => {
    this.setState({
      displayValues: getSortedValues(this.props.values, sortByValue),
      sortedByValue: sortByValue
    });
  };

  render() {
    const { displayValues } = this.state;
    const { onSelect, searchTerm } = this.props;

    // DBJ: Temporarily Hide value count nvd & label to describe sort method
    return (
      <div>
        {/** <Flex align="center" justify="space-between" py={2}>
          <Text font="header5">{`${displayValues.length} values`}</Text>
          <Switch
            isX={sortedByValue}
            onChange={this.handleSetSort}
            xLabel="A-Z"
            yLabel="Value Count"
          />
        </Flex> **/}

        <ResultValues
          onSelect={onSelect}
          values={displayValues}
          searchTerm={searchTerm}
        />
      </div>
    );
  }
}

export const LoadFailure = ({ title, ...props }: { title: string }) => (
  <Flex align="center" column justify="center" {...props}>
    <Icon color="darkBlue4" size="64px" type="load-failure" />
    <Text font="header3">{title}</Text>
  </Flex>
);



// WEBPACK FOOTER //
// ./src/components/filter/ValueFilter.js