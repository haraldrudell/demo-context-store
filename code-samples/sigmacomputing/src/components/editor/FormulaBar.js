// @flow
import React, { PureComponent } from 'react';
import type {
  CompletionItem,
  Formula,
  FormulaValidation,
  LookupIdCallback,
  LookupNameCallback
} from '@sigmacomputing/sling';
import classnames from 'classnames/bind';

import { Flex, IconButton, Tooltip } from 'widgets';
import { openDocLink } from 'utils/help';
import { publish } from 'utils/events';
import FormulaEditor from './FormulaEditor';
import styles from './FormulaBar.less';
const cx = classnames.bind(styles);

type State = {|
  isDirty: boolean,
  pendingNode: ?Formula,
  pendingText: ?string
|};

type Props = {|
  node: ?Formula,
  setNode: Formula => void,
  queryToken: any,
  checkFormula: (def: Formula) => FormulaValidation,
  getCompletions: (text: string, pos: number) => Array<CompletionItem>,
  lookupId: LookupIdCallback,
  lookupName: LookupNameCallback,
  setEditorActive: boolean => void
|};

// This function exists to strip event as arg from underlying openDocLink() call.
function onOpenDocs() {
  openDocLink();
}

const BarButton = ({
  color,
  disabled,
  type,
  ...rest
}: {
  color: string,
  disabled: boolean,
  type: string
}) => {
  const colorProps = disabled
    ? {}
    : {
        color,
        hoverColor: color
      };
  return (
    <IconButton
      css={`
        transition: transform 0.2s ease-in-out;
        &:hover:not(:disabled) {
          transform: scale(1.3);
        }
      `}
      disabled={disabled}
      type={type}
      {...rest}
      {...colorProps}
    />
  );
};

export default class FormulaBar extends PureComponent<Props, State> {
  editor: ?FormulaEditor;

  constructor(props: Props) {
    super(props);
    this.state = {
      isDirty: false,
      pendingNode: null,
      pendingText: null
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.node !== this.props.node) {
      this.setState({
        isDirty: false,
        pendingNode: null,
        pendingText: null
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.node !== this.props.node) {
      if (this.editor) this.editor.blur();
    }
    if (prevState.isDirty !== this.state.isDirty) {
      this.props.setEditorActive(this.state.isDirty);
    }
  }

  flashEditor = () => {
    if (this.editor) this.editor.flashEditor();
  };

  focusEditor = () => {
    if (this.editor) this.editor.focus();
  };

  setEditorRef = (r: ?FormulaEditor) => {
    this.editor = r;
  };

  setPending = (node: ?Formula, text: ?string) => {
    this.setState({
      isDirty: true,
      pendingNode: node,
      pendingText: text
    });
  };

  commitChanges = () => {
    const { isDirty, pendingNode, pendingText } = this.state;
    if (pendingNode) {
      this.props.setNode(pendingNode);
      publish('CommitFormula', { formulaText: pendingText });
    } else if (!isDirty) {
      if (this.editor) this.editor.blur();
    }
  };

  abortChanges = () => {
    if (this.state.isDirty) {
      this.setState({
        isDirty: false,
        pendingNode: null
      });

      publish('AbortFormula');
    }
    if (this.editor) this.editor.blur();
  };

  render() {
    const { isDirty, pendingNode } = this.state;
    const {
      node,
      queryToken,
      checkFormula,
      getCompletions,
      lookupId,
      lookupName
    } = this.props;

    const canCommit = Boolean(pendingNode);
    const canAbort = isDirty;

    return (
      <Flex className={cx('container')}>
        <Flex
          className={cx('fnDocButton')}
          align="center"
          justify="center"
          onClick={onOpenDocs}
        >
          <Tooltip title="View formula documentation" placement="topRight">
            <span>fx</span>
          </Tooltip>
        </Flex>
        <FormulaEditor
          ref={this.setEditorRef}
          node={node}
          queryToken={queryToken}
          checkFormula={checkFormula}
          getCompletions={getCompletions}
          lookupId={lookupId}
          lookupName={lookupName}
          onAbort={this.abortChanges}
          onCommit={this.commitChanges}
          onChange={this.setPending}
        />
        <Flex
          align="center"
          justify="space-around"
          ml={2}
          opacity={!node ? 0 : 1}
          width="80px"
        >
          <BarButton
            color="green"
            disabled={!canCommit}
            onClick={this.commitChanges}
            type="check"
          />
          <BarButton
            color="red"
            disabled={!canAbort}
            onClick={this.abortChanges}
            type="abort"
          />
        </Flex>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/editor/FormulaBar.js