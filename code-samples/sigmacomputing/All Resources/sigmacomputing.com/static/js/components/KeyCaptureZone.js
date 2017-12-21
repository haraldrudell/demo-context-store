// @flow
import * as React from 'react';

export default class KeyCaptureZone extends React.Component<{
  className?: string,
  children: React.Element<any>,
  onKeyPress: (evt: SyntheticInputEvent<>) => void
}> {
  onKeyPress = (evt: SyntheticInputEvent<>) => {
    if (/^INPUT|SELECT|TEXTAREA$/.test(evt.target.tagName)) {
      return;
    }
    this.props.onKeyPress(evt);
  };

  render() {
    const { className = '', children } = this.props;

    return (
      <div className={className} onKeyPress={this.onKeyPress}>
        {children}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/KeyCaptureZone.js