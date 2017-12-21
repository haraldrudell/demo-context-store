// @flow
import * as React from 'react';
import Link from 'react-router-dom/Link';
import { css } from 'react-emotion';

import { Box, Flex } from 'widgets';
import Logo from 'icons/logo_dark.svg';
import AutosizeInput from 'components/widgets/AutosizeInput';
import { encodeInodeUrl } from 'utils/folders';
import type { FolderSummaryTy } from 'types';
import colors from 'styles/colors';

const inputCls = css`
  min-width: 1px;
  margin: 0 0 -4px -4px;
  border: solid 2px transparent;
  border-radius: 2px;
  padding: 0 2px;
  background-color: transparent;
  color: ${colors.darkBlue1};
  transition: border 500ms ease-out;

  &:hover:not(:disabled) {
    border: solid 2px ${colors.blueAccent};
  }

  &:focus {
    border: solid 2px ${colors.blueAccent};
  }
`;

type Props = {|
  folder: FolderSummaryTy,
  onRename: string => void,
  title: string
|};

export default function DocTitle({ folder, onRename, title }: Props) {
  return (
    <Flex align="center">
      <Link to="/">
        <img
          css={`height: 28px; vertical-align: middle;`}
          src={Logo}
          alt="Sigma"
        />
      </Link>
      <Flex column font="header4" ml={2}>
        <AutosizeInput
          className={inputCls}
          initialValue={title}
          onUpdate={onRename}
        />
        <Box font="bodyMedium">
          <Link to={encodeInodeUrl(folder)}>{folder.name}</Link>
        </Box>
      </Flex>
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/nav/DocTitle.js