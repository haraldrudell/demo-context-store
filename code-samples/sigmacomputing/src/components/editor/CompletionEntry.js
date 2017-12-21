// @flow
import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import type { CompletionItem, FuncDef, Signature } from '@sigmacomputing/sling';

import { Box, Flex, Icon } from 'widgets';
import { openDocLink } from 'utils/help';
import typography from 'styles/typography';

const ALLOWED_TYPES = ['Text', 'Code'];

// Strip a span of markdown
const StrippedMarkdown = ({ text }: { text: string }) => (
  <ReactMarkdown
    css={`
      & code {
        ${typography.formulaSmall};
      }
    `}
    allowedTypes={ALLOWED_TYPES}
    source={text}
    unwrapDisallowed={true}
  />
);

function isParamArg(def: FuncDef, paramIdx: number, argIdx: number) {
  const param = def.params[paramIdx];

  if (argIdx < paramIdx) return false;
  if (argIdx === paramIdx) return true;
  if (argIdx < def.params.length) return false;
  return param.splat;
}

export class SignatureEntry extends PureComponent<{|
  signature: Signature
|}> {
  onLinkClick = (evt: SyntheticMouseEvent<>) => {
    evt.stopPropagation();
    openDocLink(this.props.signature.def);
  };

  render() {
    const { def, curArg } = this.props.signature;

    return (
      <Box font="bodyMedium">
        <Flex bb={1} borderColor="darkBlue4">
          <Box bg="darkBlue5" mr={2} px={2}>
            <Icon size="12px" type="fx" />
          </Box>
          <Box py={1}>
            <Flex font="formulaSmall">
              {`${def.name}(`}
              {def.params.map((param, idx) => (
                <Flex key={idx}>
                  {idx !== 0 && ', '}
                  <Flex
                    bg={
                      isParamArg(def, idx, curArg) ? 'darkBlue5' : 'transparent'
                    }
                  >
                    {param.optional && '['}
                    {param.name}
                    {param.splat && '\u2026' /* horizonal ellipsis */}
                    {param.optional && ']'}
                  </Flex>
                </Flex>
              ))}
              {')'}
            </Flex>
            <Box font="bodyMedium" mt={1}>
              <StrippedMarkdown text={def.desc} />
            </Box>
          </Box>
        </Flex>
        <Box py={1} px={2}>
          {def.params.map((param, idx) => (
            <Box key={idx} pb={1}>
              <Box
                bg={isParamArg(def, idx, curArg) ? 'darkBlue5' : 'transparent'}
                font="formulaSmall"
                inline
              >
                {param.name}
              </Box>
              {param.optional && ' [optional]'}
              {param.description && (
                <Box>
                  <StrippedMarkdown text={param.description} />
                </Box>
              )}
            </Box>
          ))}
          <Box
            css={`
              display: inline-block;
              cursor: pointer;
            `}
            color="blue"
            onClick={this.onLinkClick}
          >
            Learn more about&nbsp;
            <Box css={`display: inline-block;`} font="formulaSmall">
              {def.name}
            </Box>
            .
          </Box>
        </Box>
      </Box>
    );
  }
}

export default class CompletionEntry extends PureComponent<{|
  completion: CompletionItem,
  idx: number,
  isSelected: boolean,
  onClick: (SyntheticInputEvent<HTMLDivElement>) => void,
  onHover: (SyntheticInputEvent<HTMLDivElement>) => void
|}> {
  onDocClick = (evt: SyntheticMouseEvent<>) => {
    evt.stopPropagation();
    let kind = this.props.completion.kind;
    openDocLink(kind.ty === 'function' ? kind.def : null);
  };

  render() {
    const { completion, idx, isSelected, onClick, onHover } = this.props;
    const { label, kind } = completion;

    return (
      <Flex
        color={isSelected ? 'darkBlue2' : 'darkBlue3'}
        data-selection-idx={idx}
        font="bodyMedium"
        onClick={onClick}
        onMouseEnter={onHover}
      >
        <Box bg="darkBlue5" mr={2} px={2}>
          <Icon
            size="12px"
            type={kind.ty === 'function' || kind.ty === 'keyword' ? 'fx' : 'db'}
          />
        </Box>
        <Box py={1}>
          <Flex font="formulaSmall">{label}</Flex>
          {isSelected &&
            kind.ty === 'function' && (
              <Box mt={1}>
                <StrippedMarkdown text={kind.def.desc} />
              </Box>
            )}
        </Box>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/editor/CompletionEntry.js