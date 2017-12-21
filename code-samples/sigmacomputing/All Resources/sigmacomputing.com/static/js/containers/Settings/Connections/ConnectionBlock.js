// @flow
import * as React from 'react';
import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';

import type { Id } from 'types';
import type { ConnectionType } from 'types/connection';
import { encodeId } from 'utils/uuid62';
import { Text } from 'widgets';
import { getIcon } from 'utils/connection';
import styles from './ConnectionBlock.less';

const cx = classnames.bind(styles);

type Props = {|
  id: Id,
  label: string,
  type: ConnectionType,
  canEdit: boolean
|};

export default function ConnectionBlock({ id, label, type, canEdit }: Props) {
  const databaseIcon = getIcon(type);
  return (
    <div className={cx('flex-row', 'align-center', 'block')}>
      <img alt={type} className={cx('icon')} src={databaseIcon} />
      <Text className="flex-item" font="header4" truncate>
        {label}
      </Text>
      {canEdit && (
        <Link to={`/settings/connections/${encodeId(id)}`}>Edit</Link>
      )}
    </div>
  );
}



// WEBPACK FOOTER //
// ./src/containers/Settings/Connections/ConnectionBlock.js