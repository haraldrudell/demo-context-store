// @flow
import React, { PureComponent } from 'react';
import invariant from 'invariant';
import { EditorState } from 'prosemirror-state';

import Toolbar from './Toolbar';
import ToolbarPositioner from './ToolbarPositioner';
import Prompt from './Prompt';
import type { SelectionDef } from './ToolbarPlugin';
import {
  mkMenuActions,
  type OpenPromptProps,
  type MenuActionsDef
} from './menu';

import ProseMirrorEditorView, {
  type DispatchDef
} from 'components/ProseMirrorEditorView';

type Props = {
  editorState: EditorState,
  dispatchTransaction: DispatchDef,
  onEditorState: (EditorState, ?SelectionDef) => void,
  selection: ?SelectionDef
};

type State = {
  activePrompt: ?OpenPromptProps,
  promptPos: ?SelectionDef,
  focused: boolean
};

export default class TextEditor extends PureComponent<Props, State> {
  _menuActions: MenuActionsDef;

  constructor(props: Props) {
    super(props);
    this._menuActions = mkMenuActions({ openPrompt: this.openPrompt });
    this.state = {
      activePrompt: null,
      promptPos: null,
      focused: false
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.state.activePrompt &&
      !this.state.focused &&
      nextProps.selection !== this.props.selection
    ) {
      // editor selection changed, drop the prompt
      this.setState({ activePrompt: null, promptPos: null, focused: false });
    }
  }

  openPrompt = (activePrompt: OpenPromptProps) => {
    this.setState({ activePrompt, promptPos: this.props.selection });
  };

  onFocus = () => {
    this.setState({ focused: true });
  };
  onBlur = () => this.setState({ focused: false, activePrompt: null });

  onSubmit = (value: string) => {
    const { activePrompt } = this.state;
    invariant(activePrompt, 'onSubmit but no activePrompt');
    this.setState({ activePrompt: null, promptPos: null, focused: false });
    activePrompt.onSubmit(value);
  };

  render() {
    const {
      editorState,
      onEditorState,
      dispatchTransaction,
      selection
    } = this.props;

    const { activePrompt, promptPos } = this.state;
    return (
      <div>
        <ProseMirrorEditorView
          editorState={editorState}
          onEditorState={onEditorState}
        />
        {activePrompt ? (
          <ToolbarPositioner selection={promptPos}>
            <Prompt
              placeholder={activePrompt.placeholder}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onSubmit={this.onSubmit}
            />
          </ToolbarPositioner>
        ) : (
          <ToolbarPositioner selection={selection}>
            <Toolbar
              editorState={editorState}
              dispatchTransaction={dispatchTransaction}
              menuActions={this._menuActions}
            />
          </ToolbarPositioner>
        )}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/TextTile/TextEditor.js