// @flow
import * as React from 'react';
import { css } from 'emotion';

import Layer from 'widgets/Popups/Layer';
import { popupContentStyle } from '../utils';

type Props = {
  popperProps: any,
  popupChildren?: React.Node,
  width?: string,
  doNotLayer?: boolean,
  darkenLayer?: boolean,
  popupOpen: boolean,
  onClickContent: (SyntheticInputEvent<>) => void,
  setContentContainer: any => void
};

export default class PopupContent extends React.Component<Props> {
  render() {
    const {
      popperProps,
      popupOpen,
      width,
      popupChildren,
      doNotLayer,
      darkenLayer,
      onClickContent,
      setContentContainer
    } = this.props;

    const content = (
      <div
        {...popperProps}
        className={popupContentStyle}
        css={
          width
            ? css`
                width: ${width};
              `
            : ''
        }
      >
        <div onClick={onClickContent} ref={setContentContainer}>
          {popupChildren}
        </div>
      </div>
    );

    return doNotLayer ? (
      content
    ) : (
      <Layer darkenLayer={darkenLayer} show={popupOpen}>
        {content}
      </Layer>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Popup/PopupContent.js