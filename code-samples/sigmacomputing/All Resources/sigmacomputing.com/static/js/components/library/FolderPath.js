// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';

import { Flex, Icon } from 'widgets';
import { encodeInodeUrl } from 'utils/folders';
import type { FolderDetailsTy } from 'types';

type Props = {|
  folder: ?FolderDetailsTy
|};

const PathSeparator = () => <Icon m={1} size="14px" type="caret-right" />;

export default function FolderPath({ folder }: Props) {
  if (!folder) return <Flex align="baseline">&nbsp;</Flex>;
  const { parent } = folder;

  return (
    <Flex align="baseline">
      {parent && <Link to={encodeInodeUrl(parent)}>{parent.name}</Link>}
      {parent && <PathSeparator />}
      {folder.name}
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/library/FolderPath.js