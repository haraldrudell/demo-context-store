// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import { Icon, TextSpan } from 'widgets';
import { HEADER_HEIGHT } from 'const/TableConstants';
import Label from 'components/widgets/Label';
import styles from './Header.less';
const cx = classnames.bind(styles);

type Props = {
  id: string,
  width: number,
  label: string,
  isLevelCollapsed: boolean,
  isFirstInLevel: boolean,
  isLastInLevel: boolean,
  isSelected: ?boolean,
  levelId: string,
  setHeaderRef: (id: string, ref: ?Label) => void,
  onRename?: (id: string, label: string) => void
};

type State = {
  isRenaming: boolean
};

export default class ColumnHeader extends PureComponent<Props, State> {
  labelRef: ?Label;

  static defaultProps = {
    isSelected: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isRenaming: false
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    // Update the id --> labelRef mapping when the id changes
    if (nextProps.id !== this.props.id && this.labelRef) {
      nextProps.setHeaderRef(nextProps.id, this.labelRef);
    }
  }

  componentWillUnmount() {
    this.props.setHeaderRef(this.props.id, null);
  }

  onRename = (label: string) => {
    if (this.props.onRename) {
      this.props.onRename(this.props.id, label);
    }
  };

  onToggleEditing = (isRenaming: boolean) => {
    this.setState({ isRenaming });
  };

  setLabelRef = (r: ?Label) => {
    this.labelRef = r;
    this.props.setHeaderRef(this.props.id, r);
  };

  render() {
    const {
      label,
      width,
      isSelected,
      id,
      levelId,
      isFirstInLevel,
      isLastInLevel,
      isLevelCollapsed
    } = this.props;
    const { isRenaming } = this.state;

    return (
      <div
        style={{ height: HEADER_HEIGHT, width }}
        className={cx('header', {
          isLastInLevel,
          isSelected,
          isLevelCollapsed
        })}
        title={label}
        data-type="header"
        data-columnId={id}
        data-levelId={levelId}
      >
        {!isRenaming &&
          isFirstInLevel && (
            <div
              className={cx('collapser')}
              data-type="levelCollapser"
              data-columnId={id}
              data-levelId={levelId}
              data-is-collapsed={isLevelCollapsed}
              title={isLevelCollapsed ? 'Expand Level' : 'Collapse Level'}
            >
              <Icon type={'chevrons-down'} />
            </div>
          )}
        <TextSpan
          align={isRenaming ? 'left' : 'center'}
          className={styles.labelContainer}
          font="header5"
          px={isRenaming ? 0 : 1}
          truncate
        >
          <Label
            ref={this.setLabelRef}
            label={label}
            onRename={this.onRename}
            toggleEditing={this.onToggleEditing}
            className={cx('flex-item', 'label', { isRenaming })}
            inputClassName={cx('input', { isRenaming })}
          />
        </TextSpan>
        {!isRenaming && (
          <div
            className={cx('menuToggle')}
            data-type="header-menu"
            data-columnId={id}
            data-levelId={levelId}
          >
            <Icon type="caret-down" />
          </div>
        )}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/Header.js