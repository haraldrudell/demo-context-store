// @flow
import { toggleMark, setBlockType } from 'prosemirror-commands';
import type { EditorState } from 'prosemirror-state';
import invariant from 'invariant';

import type { DispatchDef } from 'components/ProseMirrorEditorView';
import { tileSchema } from './schema';

export type MenuItemDef = {
  // Return true if this menu item is active for the current selection
  isActive: EditorState => boolean,

  // apply this menu item's change to the current selection
  command: (EditorState, DispatchDef) => void
};

export type MenuActionsDef = {|
  bold: MenuItemDef,
  italic: MenuItemDef,
  link: MenuItemDef,
  largeText: MenuItemDef,
  medText: MenuItemDef
|};

export type OpenPromptProps = {|
  placeholder: string,
  onSubmit: (value: string) => void
|};

export type MenuActionProps = {|
  openPrompt: (props: OpenPromptProps) => void
|};

function isMarkActive(mark: string, editorState: EditorState) {
  const { doc, selection } = editorState;
  return (
    !selection.empty && doc.rangeHasMark(selection.from, selection.to, mark)
  );
}

function mkMarkAction(markType: string, attrs?: Object) {
  const mark = tileSchema.marks[markType];
  invariant(mark, `Tile Schema missing mark type ${mark}`);

  return {
    isActive: (editorState: EditorState) => isMarkActive(mark, editorState),
    command: (editorState: EditorState, dispatch: DispatchDef) => {
      const cb = toggleMark(mark, attrs);
      cb(editorState, dispatch);
    }
  };
}

function mkLinkAction({ openPrompt }) {
  const mark = tileSchema.marks.link;
  return {
    isActive: (editorState: EditorState) => isMarkActive(mark, editorState),
    command: (editorState: EditorState, dispatch: DispatchDef) => {
      openPrompt({
        placeholder: 'Paste or type a link',
        onSubmit: (value: string) => {
          if (value) {
            // if they didn't specify a protocol, use https
            const href = value.toLowerCase().startsWith('http')
              ? value
              : 'https://' + value;
            const attrs = { href, title: value };
            const cb = toggleMark(mark, attrs);
            cb(editorState, dispatch);
          }
        }
      });
    }
  };
}

function mkNodeAction(nodeType: string, attrs?: Object) {
  const schemaNode = tileSchema.nodes[nodeType];
  invariant(schemaNode, `Tile Schema missing schemaNode ${nodeType}`);

  const isActive = (editorState: EditorState) => {
    const { $from, to, node } = editorState.selection;
    if (node) return node.hasMarkup(schemaNode, attrs);
    return to <= $from.end() && $from.parent.hasMarkup(schemaNode, attrs);
  };

  return {
    isActive,
    command: (editorState: EditorState, dispatch: DispatchDef) => {
      // XXX: maybe negative type should be a param rather than just assuming paragraph
      const cb = isActive(editorState)
        ? setBlockType(tileSchema.nodes.paragraph)
        : setBlockType(schemaNode, attrs);
      return cb(editorState, dispatch);
    }
  };
}

export function mkMenuActions(actionProps: MenuActionProps): MenuActionsDef {
  return {
    bold: mkMarkAction('strong'),
    italic: mkMarkAction('em'),

    largeText: mkNodeAction('heading', { level: 1 }),
    medText: mkNodeAction('heading', { level: 2 }),

    link: mkLinkAction(actionProps)
  };
}



// WEBPACK FOOTER //
// ./src/components/TextTile/menu.js