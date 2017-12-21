// @flow
import React, { Component } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export type RectDef = {
  top: number,
  bottom: number,
  left: number,
  right: number
};

// Dispatch callback used in many prosemirror patterns
export type DispatchDef = (tx: any) => void;

type Props = {
  editorState: EditorState,
  onEditorState: EditorState => void,
  spellcheck?: boolean
};

/**
 * This wraps ProseMirror's EditorView into React component.
 */
export default class ProseMirrorEditorView extends Component<Props> {
  editorView: ?EditorView;

  createEditorView = (element: ?HTMLElement) => {
    if (element != null) {
      this.editorView = new EditorView(element, {
        state: this.props.editorState,
        dispatchTransaction: this.dispatchTransaction
      });
    }
  };

  dispatchTransaction = (tx: any) => {
    // In case EditorView makes any modification to a state we funnel those
    // modifications up to the parent and apply to the EditorView itself.
    const editorState = this.props.editorState.apply(tx);
    if (this.editorView != null) {
      this.editorView.updateState(editorState);
    }
    this.props.onEditorState(editorState);
  };

  focus() {
    if (this.editorView) {
      this.editorView.focus();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    // In case we receive new EditorState through props — we apply it to the
    // EditorView instance.
    if (this.editorView) {
      if (nextProps.editorState !== this.props.editorState) {
        this.editorView.updateState(nextProps.editorState);
      }
    }
  }

  componentWillUnmount() {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  shouldComponentUpdate() {
    // Note that EditorView manages its DOM itself so we don't update via React
    return false;
  }

  render() {
    const { spellcheck } = this.props;
    // Render just an empty div which is then used as a container for an
    // EditorView instance.
    return <div ref={this.createEditorView} spellCheck={Boolean(spellcheck)} />;
  }
}



// WEBPACK FOOTER //
// ./src/components/ProseMirrorEditorView/index.js