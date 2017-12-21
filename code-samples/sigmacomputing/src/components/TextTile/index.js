// @flow
import React, { PureComponent } from 'react';
import { debounce } from 'lodash';
import { EditorState } from 'prosemirror-state';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { undo, redo, history } from 'prosemirror-history';
import placeholder from 'components/ProseMirrorEditorView/placeholder';

import toolbarPosition, { type SelectionDef } from './ToolbarPlugin';
import TextEditor from './TextEditor';
import { tileSchema } from './schema';

const DEBOUNCE_MS = 1000;

type Props = {
  contentJSON?: string, // JSON serialized content
  onContentUpdate?: string => void
};

type State = {
  editorState: EditorState,
  selection: ?SelectionDef
};

export default class TextTile extends PureComponent<Props, State> {
  _debouncedOnSerializeContent: () => void;

  constructor(props: Props) {
    super(props);
    this._debouncedOnSerializeContent = debounce(
      this.onSerializeContent,
      DEBOUNCE_MS
    );

    const config = {
      schema: tileSchema,
      plugins: [
        placeholder('Add your text'),
        toolbarPosition(this.onUpdateSelection),
        history(),
        keymap({ 'Mod-z': undo, 'S-Mod-z': redo }),
        keymap(baseKeymap)
      ]
    };

    this.state = {
      editorState: props.contentJSON
        ? EditorState.fromJSON(config, props.contentJSON)
        : EditorState.create(config),
      selection: null
    };
  }

  onUpdateSelection = (selection: ?SelectionDef) => {
    this.setState({ selection });
  };

  dispatchTransaction = (tx: any) => {
    const editorState = this.state.editorState.apply(tx);
    this.setState({ editorState });
  };

  onSerializeContent = () => {
    const { editorState } = this.state;
    const { onContentUpdate } = this.props;
    onContentUpdate && onContentUpdate(editorState.toJSON());
  };

  onEditorState = (editorState: EditorState) => {
    this.setState({ editorState });
    this._debouncedOnSerializeContent();
  };

  render() {
    const { editorState, selection } = this.state;
    return (
      <TextEditor
        editorState={editorState}
        dispatchTransaction={this.dispatchTransaction}
        onEditorState={this.onEditorState}
        selection={selection}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/TextTile/index.js