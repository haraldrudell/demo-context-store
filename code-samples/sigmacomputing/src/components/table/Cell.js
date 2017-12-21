// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import urlRegex from 'urlregex';
import { Popover, Icon, TextSpan } from 'widgets';

import type { Id } from 'types';
import styles from './Cell.less';
const cx = classnames.bind(styles);

const isUrl = urlRegex();

export default class Cell extends PureComponent<{
  columnId: Id,
  levelId: Id,
  noBorders: boolean,
  isSelected: boolean,
  isLastInLevel: boolean,
  isMulti?: boolean,
  rightAlign?: boolean,
  className?: any,
  flatOffset: number,
  value: ?string
}> {
  render() {
    const {
      value,
      noBorders,
      columnId,
      levelId,
      isLastInLevel,
      isMulti,
      isSelected,
      rightAlign,
      flatOffset,
      className = ''
    } = this.props;

    // avoid the regex test unless looks like url
    const isLink = value && value.startsWith('http') && isUrl.test(value);

    const cell = (
      <div
        className={cx('cell', className, {
          noBorders,
          isLastInLevel,
          isSelected,
          isLink,
          isMulti,
          rightAlign: !isMulti && rightAlign
        })}
        data-type="cell"
        data-columnId={columnId}
        data-levelId={levelId}
        data-flatOffset={flatOffset}
        title={value}
      >
        {value}
      </div>
    );

    if (isLink) {
      return (
        <Popover
          content={
            <div>
              <a href={value} target="_blank">
                <TextSpan font="bodySmall" truncate>
                  {value}
                </TextSpan>
                <Icon ml={2} mb={0.5} type="expand" />
              </a>
            </div>
          }
          placement="bottomLeft"
        >
          {cell}
        </Popover>
      );
    }
    return cell;
  }
}



// WEBPACK FOOTER //
// ./src/components/table/Cell.js