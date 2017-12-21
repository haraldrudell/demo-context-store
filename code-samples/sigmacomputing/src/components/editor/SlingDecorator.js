// @flow
import * as React from 'react';
import type { ContentBlock } from 'draft-js';
import { List } from 'immutable';
import { parse, type LookupNameCallback } from '@sigmacomputing/sling';
import { Tooltip } from 'widgets';

import styles from './Syntax.less';

// Decorator Keys
const BOUND_COLUMN = 'BOUND_COLUMN';
const UNBOUND_COLUMN = 'UNBOUND_COLUMN';
const PARSE_ERROR = 'PARSE_ERROR';

const SEPARATOR = '-';
const classes = {
  [BOUND_COLUMN]: styles.boundCol,
  [UNBOUND_COLUMN]: styles.unboundCol,
  [PARSE_ERROR]: styles.parseError
};

function decorateRange(_decorations, start, end, key) {
  const decorations = _decorations;
  for (let i = start; i < end; i++) {
    if (decorations[i]) {
      decorations[i] += SEPARATOR + key;
    } else {
      decorations[i] = key;
    }
  }
}

type Props = {
  children?: React.Node,
  className: string,
  hasError: boolean,
  msg: string
};

type Message = {|
  text: string,
  pos: Array<number>
|};

export default class SlingDecorator {
  lookupName: LookupNameCallback;
  messages: Array<Message>;
  messageIndex: number;

  constructor(lookupName: LookupNameCallback) {
    this.lookupName = lookupName;
    this.messages = [];
    this.messageIndex = 0;
  }

  pushMessage({ text, pos }: Message) {
    const last = this.messages[this.messages.length - 1];
    if (last && last.pos[1] === pos[0] && last.text === text) {
      last.pos[1] = pos[1];
    } else {
      this.messages.push({ text, pos });
    }
  }

  popMessage() {
    if (this.messages.length === 0) return '';
    if (this.messageIndex === 0)
      this.messages.sort((a, b) => a.pos[0] - b.pos[0]);
    if (this.messageIndex >= this.messages.length) this.messageIndex = 0;
    const { text } = this.messages[this.messageIndex++];
    return text;
  }

  getDecorations(contentBlock: ContentBlock) {
    this.messages = [];
    this.messageIndex = 0;
    const text = contentBlock.getText() || '';
    const decorations = Array(text.length).fill(null);

    const lookup = (name, pos) => {
      const isBound = Boolean(this.lookupName(name, pos));
      if (!isBound) {
        const path = Array.isArray(name) ? name.join('/') : name;
        this.pushMessage({ pos, text: `Unknown column ${path}` });
      }
      decorateRange(
        decorations,
        pos[0],
        pos[1],
        isBound ? BOUND_COLUMN : UNBOUND_COLUMN
      );
    };

    const r = parse(text, lookup);
    if (!r.status) {
      const parseMessage =
        r.value === 'Unrecognized token' || r.found.type === 'Failure'
          ? 'Unrecognized token'
          : `Unexpected ${r.found.type}`;
      this.pushMessage({ text: parseMessage, pos: [r.pos.start, r.pos.end] });
      decorateRange(decorations, r.pos.start, r.pos.end, PARSE_ERROR);
    }
    return List(decorations);
  }

  getComponentForKey() {
    const Decorator = (props: Props) => {
      const { children, className, hasError, msg } = props;
      const innerComponent = <span className={className}>{children}</span>;
      if (hasError) {
        return (
          <Tooltip title={msg} placement="bottom">
            {innerComponent}
          </Tooltip>
        );
      }
      return innerComponent;
    };
    return Decorator;
  }
  getPropsForKey(key: string) {
    let hasError = false;
    let msg = '';
    const parts = key.split(SEPARATOR);
    const className = parts.reduce((str, keyPart) => {
      const currentClass = classes[keyPart] || '';
      if (
        currentClass === styles.parseError ||
        currentClass === styles.unboundCol
      ) {
        msg = this.popMessage();
        hasError = true;
      }
      return `${currentClass} ${str}`;
    }, '');

    return { className, hasError, msg };
  }
}



// WEBPACK FOOTER //
// ./src/components/editor/SlingDecorator.js