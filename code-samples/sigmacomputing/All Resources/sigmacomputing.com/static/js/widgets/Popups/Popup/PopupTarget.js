// @flow
import * as React from 'react';

type Props = {
  targetProps: any,
  targetElement: any,
  inline?: boolean,
  top: ?string,
  left: ?string,
  onClickTarget: (SyntheticInputEvent<>) => void
};

export default class PopupTarget extends React.Component<Props> {
  render() {
    const {
      inline = true,
      targetProps,
      targetElement,
      top,
      left,
      onClickTarget
    } = this.props;

    return (
      <div
        {...targetProps}
        style={
          top && left
            ? {
                position: 'fixed',
                left,
                top
              }
            : {
                display: inline ? 'inline-block' : 'block'
              }
        }
        onClick={onClickTarget}
      >
        {targetElement}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Popup/PopupTarget.js