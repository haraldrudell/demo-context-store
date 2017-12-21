// @flow

import React, { PureComponent } from 'react';
import { Editor, EditorState, ContentState, Modifier } from 'draft-js';
import { asText, getSignature, parse } from '@sigmacomputing/sling';
import type {
  CompletionItem,
  Formula,
  FormulaError,
  FormulaValidation,
  LookupIdCallback,
  LookupNameCallback,
  PathRef,
  Signature
} from '@sigmacomputing/sling';
import classnames from 'classnames/bind';

import { Icon, Tooltip } from 'widgets';
import fontStyles from 'styles/typography.less';
import SlingDecorator from './SlingDecorator';
import CompletionEntry, { SignatureEntry } from './CompletionEntry';
import { mkSelection, toKeyOffset } from './draftUtil';
import styles from './FormulaEditor.less';
const cx = classnames.bind(styles);

const { replaceText } = Modifier;
const EDITOR_FLASH_MS = 1000;

function toText(node, lookupId) {
  return node ? asText(node, lookupId) : '';
}

function mkEditorState(text, lookupName) {
  return EditorState.createWithContent(
    ContentState.createFromText(text),
    // $FlowFixMe
    new SlingDecorator(lookupName)
  );
}

function getBlockStyle() {
  return cx('block');
}

function quashEvent(evt) {
  evt.stopPropagation();
}

function preventEvent(evt) {
  evt.preventDefault();
  evt.stopPropagation();
}

function draftMarkHandled(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  return 'handled';
}

function a(n) {
  return n === 1 ? '1 argument' : `${n} arguments`;
}

function printPathRef(path: PathRef) {
  return Array.isArray(path) ? path.join('/') : path;
}

function mkValidationErr(err: FormulaError, lookupId: LookupIdCallback) {
  switch (err.type) {
    case 'Unknown name':
      return `Unknown column "${printPathRef(err.name)}"`;
    case 'Unknown function':
      return `Unknown function ${err.name}`;
    case 'Invalid number of args':
      return `${err.f.name} expected ${a(
        err.f.params.length
      )}, got ${err.given}`;
    case 'Invalid arg type':
      return `Argument ${err.idx + 1} invalid for function ${err.f.name}`;
    case 'Ref Error': {
      const path = lookupId(err.id, err.parent);
      if (!path)
        throw new Error(
          `Column reference to ${err.parent || ''} / ${err.id} disappeared`
        );
      return `Reference to errored column "${printPathRef(path)}"`;
    }
    default:
      throw new Error(`Missing error type: ${err.type}`);
  }
}

const NO_COMPLETIONS = [];

type State = {|
  isFocused: boolean,
  formulaError: ?string,
  completions: Array<CompletionItem>,
  currentCompletionIdx: ?number,
  editorState: EditorState,
  flash: boolean,
  signature: ?Signature
|};

type Props = {|
  node: ?Formula,
  // We need some opaque way of tracking whether the set of labels has changed.
  queryToken: any,
  checkFormula: (def: Formula) => FormulaValidation,
  getCompletions: (text: string, pos: number) => Array<CompletionItem>,
  lookupId: LookupIdCallback,
  lookupName: LookupNameCallback,
  onAbort: () => void,
  onCommit: () => void,
  onChange: (node: ?Formula, text: ?string) => void
|};

export default class FormulaEditor extends PureComponent<Props, State> {
  editor: ?Editor;
  flashTimer: ?number;

  constructor(props: Props) {
    super(props);
    const formulaText = toText(props.node, props.lookupId);
    this.state = {
      editorState: mkEditorState(formulaText, props.lookupName),
      isFocused: false,
      formulaError: null,
      completions: NO_COMPLETIONS,
      signature: null,
      currentCompletionIdx: null,
      flash: false
    };
  }

  resetEditorState(props: Props) {
    const formulaText = toText(props.node, props.lookupId);
    this.setState({
      editorState: mkEditorState(formulaText, props.lookupName),
      formulaError: null,
      completions: NO_COMPLETIONS,
      currentCompletionIdx: null,
      signature: null
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.node !== this.props.node ||
      (!this.state.isFocused && nextProps.queryToken !== this.props.queryToken)
    ) {
      // update the formula from ast if editor is not focused
      this.resetEditorState(nextProps);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.flashTimer);
  }

  lookupNameType = () => {
    return { ty: null };
  };

  updateText = (text: string): ?string => {
    const r = parse(text, this.props.lookupName);
    if (!r.status) {
      this.props.onChange(null, null);
      const { found } = r;
      return found.type === 'Failure'
        ? found.value
        : `Unexpected ${found.type}`;
    }

    // Validate the formula calls
    const f = this.props.checkFormula(r.value);
    if (f.err) {
      const err = mkValidationErr(f.err, this.props.lookupId);
      this.props.onChange(null, null);
      return err;
    }

    this.props.onChange(r.value, text);
    return null;
  };

  onChange = (nextState: EditorState, fromCompletion: boolean = false) => {
    const prevState = this.state.editorState;

    const prevText = prevState.getCurrentContent().getPlainText();
    const nextText = nextState.getCurrentContent().getPlainText();
    const cursor = nextState.getSelection().getStartOffset();
    if (nextText !== prevText) {
      const formulaError = this.updateText(nextText);

      // If we just accepted a completion then we don't ask for completions on
      // our completion.
      //
      // https://github.com/sigmacomputing/slate/issues/412
      const completions = fromCompletion
        ? []
        : this.props.getCompletions(nextText, cursor);

      this.setState({
        completions,
        currentCompletionIdx: completions.length > 0 ? 0 : null,
        formulaError
      });
    } else {
      // This is just a cursor change, so we cancel any existing completions
      // since they may be invalid. There is a more complex behavior we could do here:
      //
      // https://github.com/sigmacomputing/demo/issues/469
      this.setState({
        completions: NO_COMPLETIONS,
        currentCompletionIdx: null
      });
    }

    this.setState({
      editorState: nextState,
      signature: getSignature(nextText, cursor - 1)
    });
  };

  setEditorRef = (r: ?Editor) => {
    this.editor = r;
  };

  acceptCompletion = (completionIdx: number) => {
    const { range, newText } = this.state.completions[completionIdx].edit;

    const prevState = this.state.editorState;
    const prevContent = prevState.getCurrentContent();
    const newContent = replaceText(
      prevContent,
      mkSelection(
        prevState.getSelection(),
        toKeyOffset(prevContent, range.start),
        toKeyOffset(prevContent, range.end)
      ),
      newText
    );

    const nextState = EditorState.push(
      prevState,
      newContent,
      'insert-characters'
    );
    const newCursor = toKeyOffset(
      nextState.getCurrentContent(),
      range.start + newText.length
    );
    this.onChange(
      EditorState.forceSelection(
        nextState,
        mkSelection(nextState.getSelection(), newCursor, newCursor)
      ),
      true
    );
  };

  onCompletionClick = (evt: SyntheticInputEvent<HTMLDivElement>) => {
    const completionIdx = Number(
      evt.currentTarget.getAttribute('data-selection-idx')
    );
    this.acceptCompletion(completionIdx);
  };

  onCompletionHover = (evt: SyntheticInputEvent<HTMLDivElement>) => {
    const completionIdx = Number(
      evt.currentTarget.getAttribute('data-selection-idx')
    );
    this.setState({ currentCompletionIdx: completionIdx });
  };

  onHandleKeyCommand = (evt: SyntheticKeyboardEvent<>) => {
    const { currentCompletionIdx, completions } = this.state;

    switch (evt.key) {
      case 'Enter':
      case 'Tab':
        if (typeof currentCompletionIdx === 'number') {
          this.acceptCompletion(currentCompletionIdx);
        } else {
          this.props.onCommit();
        }
        return draftMarkHandled(evt);
      case 'Escape':
        this.blur();
        this.props.onAbort();
        return draftMarkHandled(evt);
      case 'ArrowUp':
        if (typeof currentCompletionIdx === 'number') {
          this.setState({
            currentCompletionIdx: Math.max(0, currentCompletionIdx - 1)
          });
          return draftMarkHandled(evt);
        }
        break;
      case 'ArrowDown':
        if (typeof currentCompletionIdx === 'number') {
          this.setState({
            currentCompletionIdx: Math.min(
              completions.length - 1,
              currentCompletionIdx + 1
            )
          });
          return draftMarkHandled(evt);
        }
        break;
      default:
        break;
    }

    return;
  };

  blur = () => {
    if (this.state.isFocused) {
      this.setState({ isFocused: false });
      this.resetEditorState(this.props);
      if (this.editor) this.editor.blur();
    }
  };

  focus = () => {
    this.setState({ isFocused: true });
    if (this.editor) this.editor.focus();
  };

  flashEditor = () => {
    if (this.flashTimer) clearTimeout(this.flashTimer);

    this.setState({ flash: true });
    this.flashTimer = setTimeout(() => {
      this.setState({ flash: false });
    }, EDITOR_FLASH_MS);
  };

  handleCompletionMouseDown = (evt: SyntheticInputEvent<>) => {
    // Clicking on a completion item will steal focus away from the Editor and
    // close the completion box before the event can fire. Prevent that.
    evt.preventDefault();
  };

  render() {
    const {
      completions,
      currentCompletionIdx,
      flash,
      formulaError,
      isFocused,
      signature
    } = this.state;
    const disabled = !this.props.node;

    return (
      <div className={cx('flex-item')} onFocus={this.focus}>
        <div
          className={cx(
            fontStyles.formula,
            'editor',
            { isFocused },
            { disabled },
            { formulaError: Boolean(formulaError) },
            { flash }
          )}
          onKeyPress={quashEvent}
        >
          <Editor
            readOnly={disabled}
            ref={this.setEditorRef}
            editorState={this.state.editorState}
            handleReturn={this.onHandleKeyCommand}
            onDownArrow={this.onHandleKeyCommand}
            onUpArrow={this.onHandleKeyCommand}
            onTab={this.onHandleKeyCommand}
            onEscape={this.onHandleKeyCommand}
            onChange={this.onChange}
            blockStyleFn={getBlockStyle}
          />
          {formulaError && (
            <Tooltip title={formulaError} placement="bottom">
              <div className={cx('warning')} onMouseDown={preventEvent}>
                <Icon type="warning" />
              </div>
            </Tooltip>
          )}
        </div>
        {completions.length > 0 ? (
          <div
            className={cx('completion-container')}
            onMouseDown={this.handleCompletionMouseDown}
          >
            {completions.map((el, idx) => (
              <CompletionEntry
                key={idx}
                completion={el}
                idx={idx}
                isSelected={idx === currentCompletionIdx}
                onClick={this.onCompletionClick}
                onHover={this.onCompletionHover}
              />
            ))}
          </div>
        ) : signature ? (
          <div className={cx('completion-container')}>
            <SignatureEntry signature={signature} />
          </div>
        ) : null}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/editor/FormulaEditor.js