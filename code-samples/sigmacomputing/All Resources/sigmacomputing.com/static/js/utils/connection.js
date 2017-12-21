// @flow
import type { ConnectionType } from 'types/connection';
import snowflakeIcon from 'icons/snowflake.png';
import postgresIcon from 'icons/postgres.png';
import redshiftIcon from 'icons/redshift.png';
import bigqueryIcon from 'icons/bigquery.png';

export function getIcon(type: ConnectionType) {
  switch (type) {
    case 'snowflake':
      return snowflakeIcon;
    case 'postgres':
      return postgresIcon;
    case 'redshift':
      return redshiftIcon;
    case 'bigQuery':
      return bigqueryIcon;
    default:
      throw new Error(`Invalid connection type ${type}`);
  }
}



// WEBPACK FOOTER //
// ./src/utils/connection.js