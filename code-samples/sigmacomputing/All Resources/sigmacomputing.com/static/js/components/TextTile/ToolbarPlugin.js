// @flow
import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';

// Prosemirror plugin to determine whether and where toolbar should be shown
// This translates Prosemirror's selection data into dom positions

export type RectDef = {
  top: number,
  bottom: number,
  left: number,
  right: number
};

export type SelectionDef = {
  from: RectDef,
  to: RectDef
};

export type SelectionCallbackDef = (position: ?SelectionDef) => void;

class PositionTooltip {
  view: EditorView;
  callback: SelectionCallbackDef;
  selectedRect: ?SelectionDef;

  constructor(view: EditorView, callback: SelectionCallbackDef) {
    this.view = view;
    this.callback = callback;
    this.update(view, null);

    const { body } = document;
    if (body) {
      body.addEventListener('mouseup', this.onDocumentMouseUp, true);
    }
  }

  update(view, lastState) {
    let state = view.state;
    // Don't do anything if the document/selection didn't change
    if (
      lastState &&
      lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    ) {
      return;
    }

    // Hide the tooltip if the selection is empty
    if (state.selection.empty) {
      this.selectedRect = null;
      this.callback(null);
    } else {
      this.selectedRect = {
        from: view.coordsAtPos(state.selection.from),
        to: view.coordsAtPos(state.selection.to)
      };
      // Hold the callback until mouse up in case the user isn't done selecting
    }
  }

  onDocumentMouseUp = () => {
    this.callback(this.view.hasFocus() ? this.selectedRect : null);
  };

  destroy() {
    const { body } = document;
    if (body) {
      body.removeEventListener('mouseup', this.onDocumentMouseUp, true);
    }
  }
}

export default (callback: SelectionCallbackDef) => {
  return new Plugin({
    view: editorView => {
      return new PositionTooltip(editorView, callback);
    }
  });
};



// WEBPACK FOOTER //
// ./src/components/TextTile/ToolbarPlugin.js