// @flow
import React, { PureComponent } from 'react';
import type { Query } from '@sigmacomputing/sling';
import Color from 'color';

import type { Id } from 'types';
import { Popup, Flex, IconButton, Text } from 'widgets';
import colors from 'styles/colors';

type Props = {
  query: Query,
  columnId: Id,
  popup: any,
  isNew: boolean,
  deleteFilter: (columnId: Id) => void
};

type State = {
  popupOpen: boolean
};

export default class FilterChiclet extends PureComponent<Props, State> {
  popupRef: ?Popup;

  constructor(props: Props) {
    super(props);

    this.state = { popupOpen: props.isNew };
  }

  componentDidMount() {
    if (this.props.isNew && this.popupRef) {
      this.popupRef.open();
    }
  }

  onDeleteFilter = () => {
    const { columnId, deleteFilter } = this.props;
    deleteFilter(columnId);
  };

  onPopupVisible = () => {
    this.setState({ popupOpen: true });
  };

  onPopupClose = () => {
    this.setState({ popupOpen: false });
  };

  setPopupRef = (ref: ?Popup) => {
    this.popupRef = ref;
  };

  render() {
    const { columnId, query, popup } = this.props;
    const { popupOpen } = this.state;
    const label = query.view.labels[columnId];

    return (
      <Popup
        ref={this.setPopupRef}
        placement="bottom-start"
        closeOnClick={false}
        onClickTarget={this.onPopupVisible}
        onBlur={this.onPopupClose}
        target={
          <Flex
            css={`
              cursor: pointer;
              min-width: 6rem;
            `}
            align="center"
            bg={Color(colors.darkBlue5)
              .alpha(0.6)
              .string()}
            justify="space-between"
            opacity={popupOpen ? 0.5 : 1}
            px={1}
          >
            <Text font="header5" pl={2} py={1} truncate>
              {label}
            </Text>
            <IconButton
              onClick={this.onDeleteFilter}
              px={2}
              py={1}
              size="12px"
              type="close"
            />
          </Flex>
        }
      >
        {popup}
      </Popup>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/FilterChiclet.js