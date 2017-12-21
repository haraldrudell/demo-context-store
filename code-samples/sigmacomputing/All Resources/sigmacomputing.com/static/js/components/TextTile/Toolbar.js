// @flow
import React, { PureComponent } from 'react';
import { css } from 'react-emotion';
import Color from 'color';

import { Box, Flex } from 'widgets';
import type { EditorState } from 'prosemirror-state';
import type { DispatchDef } from 'components/ProseMirrorEditorView';
import { type MenuActionsDef } from './menu';
import ToolbarButton from './ToolbarButton';

const separatorStyle = css`
  display: inline-block;
  align-self: center;
  width: 1px;
  height: 16px;
  background-color: ${Color('white')
    .fade(0.4)
    .string()};
`;

export const Separator = () => <Box css={separatorStyle} mx={1} />;

type Props = {
  editorState: EditorState,
  dispatchTransaction: DispatchDef,
  menuActions: MenuActionsDef
};

export default class Toolbar extends PureComponent<Props> {
  render() {
    const { editorState, dispatchTransaction, menuActions } = this.props;
    const { bold, italic, link, largeText, medText } = menuActions;
    return (
      <Flex inline bg="darkBlue1" px={2} borderRadius={4}>
        <ToolbarButton
          editorState={editorState}
          dispatchTransaction={dispatchTransaction}
          isActive={bold.isActive}
          command={bold.command}
          icon="bold"
        />
        <ToolbarButton
          editorState={editorState}
          dispatchTransaction={dispatchTransaction}
          isActive={italic.isActive}
          command={italic.command}
          icon="italic"
        />
        <ToolbarButton
          editorState={editorState}
          dispatchTransaction={dispatchTransaction}
          isActive={link.isActive}
          command={link.command}
          icon="link"
        />
        <Separator />
        <ToolbarButton
          editorState={editorState}
          dispatchTransaction={dispatchTransaction}
          isActive={largeText.isActive}
          command={largeText.command}
          icon="text-large"
        />
        <ToolbarButton
          editorState={editorState}
          dispatchTransaction={dispatchTransaction}
          isActive={medText.isActive}
          command={medText.command}
          icon="text-med"
        />
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/TextTile/Toolbar.js