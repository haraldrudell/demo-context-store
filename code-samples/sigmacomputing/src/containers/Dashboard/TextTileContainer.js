// @flow
import React, { PureComponent } from 'react';
import { css } from 'react-emotion';
import type { Id } from '@sigmacomputing/sling';

import TextTile from 'components/TextTile';

type Props = {
  content: string,
  tileId: Id,
  onContentUpdate?: (Id, string) => void
};

const style = css`
  height: 100%;
  width: 100%;
  cursor: auto;
  overflow: auto;
`;

export default class TextTileContainer extends PureComponent<Props> {
  onMouseDown = (e: SyntheticMouseEvent<>) => {
    // keep a click within text tile from reaching react-draggable
    e.stopPropagation();
  };

  onContentUpdate = (content: string) => {
    const { tileId, onContentUpdate } = this.props;
    onContentUpdate && onContentUpdate(tileId, content);
  };

  render() {
    const { content } = this.props;
    return (
      <div css={style} onMouseDown={this.onMouseDown}>
        <TextTile
          contentJSON={content}
          onContentUpdate={this.onContentUpdate}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Dashboard/TextTileContainer.js