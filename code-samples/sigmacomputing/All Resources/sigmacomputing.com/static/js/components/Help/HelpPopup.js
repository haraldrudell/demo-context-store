// @flow
import * as React from 'react';
import { Text, Popup } from 'widgets';
import Help from './Help';

type Props = { openHelp: boolean };
type State = { wasOpen: boolean };

export default class HelpPopup extends React.Component<Props, State> {
  popupRef: ?Popup;

  constructor(props: Props) {
    super(props);
    this.state = { wasOpen: false };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.openHelp !== this.props.openHelp &&
      nextProps.openHelp &&
      this.popupRef &&
      !this.state.wasOpen
    ) {
      this.popupRef.open();
      this.setState({ wasOpen: true });
    }
  }

  setPopupRef = (r: ?Popup) => {
    this.popupRef = r;
  };

  onClose = () => {
    if (this.popupRef) this.popupRef.onClose();
  };

  onClickHelp = () => {
    if (this.popupRef)
      this.popupRef.setTarget({ clientX: '50%', clientY: '25%' });
  };

  render() {
    return (
      <div>
        <Text
          css={`cursor: pointer;`}
          pr={4}
          font="header4"
          color="darkBlue2"
          onClick={this.onClickHelp}
        >
          Help
        </Text>
        <div css={`position: absolute;`}>
          <Popup
            ref={this.setPopupRef}
            popupPlacement="bottom"
            darkenLayer
            closeOnClick={false}
          >
            <Help onClose={this.onClose} css={`border-radius: 4px;`} />
          </Popup>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/Help/HelpPopup.js