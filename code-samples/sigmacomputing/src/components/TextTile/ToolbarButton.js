// @flow
import React, { PureComponent } from 'react';
import { EditorState } from 'prosemirror-state';
import { IconButton } from 'widgets';

import colors from 'styles/colors';
import type { DispatchDef } from 'components/ProseMirrorEditorView';

type Props = {
  editorState: EditorState,
  isActive: EditorState => boolean,
  command: (EditorState, DispatchDef) => void,
  dispatchTransaction: DispatchDef,
  icon: string
};

export default class ToolbarButton extends PureComponent<Props> {
  onMouseDown = (e: SyntheticMouseEvent<>) => {
    // prevent browser selection changing on button click
    e.preventDefault();
  };

  onClick = (e: SyntheticMouseEvent<>) => {
    const { command, editorState, dispatchTransaction } = this.props;

    e.stopPropagation();
    // so we don't steal focus from EditorView
    e.preventDefault();

    command(editorState, dispatchTransaction);
  };

  render() {
    const { icon, isActive, editorState } = this.props;
    const color =
      isActive && isActive(editorState) ? colors.blueAccent : 'white';

    return (
      <IconButton
        size="20px"
        p={2}
        type={icon}
        color={color}
        hoverColor={color}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/TextTile/ToolbarButton.js