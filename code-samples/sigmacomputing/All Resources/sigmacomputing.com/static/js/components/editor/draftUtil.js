// @flow
import type { ContentState, SelectionState } from 'draft-js';

export type SelectionPoint = {
  key: string,
  offset: number
};

export function getFullOffset(
  contentState: ContentState,
  blockKey: string,
  blockOffset: number
) {
  let startOffset = blockOffset;

  for (
    let k = contentState.getKeyBefore(blockKey);
    k;
    k = contentState.getKeyBefore(k)
  ) {
    // draft connects each block with a \n so + 1 to account for that
    startOffset += contentState.getBlockForKey(k).getLength() + 1;
  }

  return startOffset;
}

export function mkSelection(
  _sel: SelectionState,
  anchor: SelectionPoint,
  focus: SelectionPoint
): SelectionState {
  let sel = _sel;
  sel = sel.set('anchorKey', anchor.key);
  sel = sel.set('anchorOffset', anchor.offset);
  sel = sel.set('focusKey', focus.key);
  sel = sel.set('focusOffset', focus.offset);
  sel = sel.set('isBackward', false);
  return sel;
}

export function toKeyOffset(
  contentState: ContentState,
  fullOffset: number
): SelectionPoint {
  let rem = fullOffset;

  for (
    let k = contentState.getFirstBlock().getKey();
    k;
    k = contentState.getKeyAfter(k)
  ) {
    const thisLen = contentState.getBlockForKey(k).getLength() + 1;
    if (rem >= thisLen) {
      // move onto the next block
      rem -= thisLen;
    } else {
      // offset is in this block
      return { key: k, offset: rem };
    }
  }

  // after last block
  const lastBlock = contentState.getLastBlock();
  return {
    key: lastBlock.getKey(),
    offset: lastBlock.getLength()
  };
}



// WEBPACK FOOTER //
// ./src/components/editor/draftUtil.js