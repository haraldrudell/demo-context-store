// @flow
import { css } from 'react-emotion';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import colors from 'styles/colors';

// Prosemirror plugin for placeholder text
// based on https://discuss.prosemirror.net/t/how-to-input-like-placeholder-behavior/705/13

const placeholderClass = css`
  color: ${colors.grayAccent};
  pointer-events: none;
  height: 0;
`;

export default (text: string) =>
  new Plugin({
    props: {
      decorations(state) {
        const doc = state.doc;

        if (
          doc.childCount > 1 ||
          !doc.firstChild.isTextblock ||
          doc.firstChild.content.size > 0
        )
          return;

        const placeHolder = document.createElement('div');
        placeHolder.classList.add(placeholderClass);
        placeHolder.textContent = text;

        return DecorationSet.create(doc, [Decoration.widget(1, placeHolder)]);
      }
    }
  });



// WEBPACK FOOTER //
// ./src/components/ProseMirrorEditorView/placeholder.js