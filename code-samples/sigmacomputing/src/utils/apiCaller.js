// @flow
import { isEqual } from 'lodash';
import downloadFile from 'downloadjs';
import Raven from 'raven-js';
import type { Query, Anchor } from '@sigmacomputing/sling';
import uuid from 'uuid';
import invariant from 'invariant';

import type { ExportFormat, Id, Values } from 'types';
import type { EventType } from 'types/events';
import { getApiEndpoint, isProd } from 'env';
import { getToken } from 'utils/auth';
import { fromApiColumn, getData } from 'utils/column';
import type { ChartEvalDef } from 'utils/chart/eval';
import { TOPK_VALUES } from 'const/FilterConstants';
import { publish } from 'utils/events';
import oauth2 from 'utils/oauth2';
import { DEFAULT_CONNECTION_ID } from 'api/connection';

import { createErrorWithPayload } from './promise';

type ApiVersion = 'v1' | 'v2';
type DescribeKindType = 'table';

export function getEndpointBase(version: ApiVersion) {
  return `${getApiEndpoint()}/api/${version}`;
}

function rewriteConnectionId(id: Id): ?Id {
  return id === DEFAULT_CONNECTION_ID ? null : id;
}

function genRequestId(): string {
  return uuid
    .v4()
    .split('-')
    .join('');
}

export function handleApiError(title: string, e: Object) {
  if (!e.error) {
    // Not an API exception. let it bubble out
    throw e;
  }

  if (isProd) {
    const payload = {
      extra: {
        body: e.body,
        error: e.error
      },
      tags: {
        'request-id': e.requestId
      }
    };

    if (
      !e.isJSON &&
      e.error &&
      e.error.code &&
      (e.error.code === 502 || e.error.code === 504)
    ) {
      // nginx gateway timeouts.  We treat these as query timeouts and don't want to log to sentry as bugs
      return;
    }

    Raven.captureMessage(`${title} - ${new Date().toDateString()}`, payload);
  } else {
    console.error(e); // eslint-disable-line
    console.error(e.error); // eslint-disable-line
  }
}

function apiFetch(
  endpoint: string,
  method: string,
  body: Object,
  requestId: string,
  version: ApiVersion = 'v1'
) {
  return getToken().then(token =>
    fetch(`${getEndpointBase(version)}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Request-Id': requestId
      },
      method,
      body: JSON.stringify(body)
    })
  );
}

export default function callApi(
  endpoint: string,
  method?: string = 'GET',
  eventType: EventType,
  body: Object,
  version: ApiVersion = 'v1'
) {
  const startTime = Date.now();
  const requestId = genRequestId();
  let sigmaServiceVersion = 'Unknown';
  return apiFetch(endpoint, method, body, requestId, version)
    .catch(error => {
      // These errors are thrown when the fetch fails to reach the server
      // We want to re-format it so that its the format we expect
      return Promise.reject(
        createErrorWithPayload({
          body,
          requestId,
          error: {
            error,
            message: error.message,
            info: 'callApi: Failed to reach server'
          }
        })
      );
    })
    .then(response => {
      const isJSON =
        response.headers.get('content-type') === 'application/json';
      sigmaServiceVersion =
        response.headers.get('x-sigma-version') || 'Unknown';
      if (isJSON) {
        if (response.ok) {
          return response.text();
        }
        return response.text().then(text =>
          // For backend errors JSON.parse(text)
          // responses are in the format { error: { code, message } }
          Promise.reject(
            createErrorWithPayload({
              body,
              requestId,
              ...JSON.parse(text),
              isJSON: true
            })
          )
        );
      }
      return response.text().then(message => {
        return Promise.reject(
          createErrorWithPayload({
            body,
            requestId,
            error: {
              code: response.status,
              message
            }
          })
        );
      });
    })
    .then(text => {
      const successPayload = JSON.parse(text);
      const durationMS = Date.now() - startTime;
      publish(eventType, {
        durationMS,
        msgSize: text.length,
        requestId,
        sigmaServiceVersion
      });
      return successPayload;
    })
    .catch((errorPayload: { error: { code: string, message: string } }) => {
      const { code, message = 'Error has not been set' } = errorPayload.error;
      const durationMS = Date.now() - startTime;

      publish('ApiError', {
        durationMS,
        endpoint,
        requestId,
        status: code,
        statusText: message,
        sigmaServiceVersion
      });
      // Should already be an error type.
      return Promise.reject(errorPayload);
    });
}

export function list(
  kind: string,
  scope: ?Array<string>,
  namePattern: ?string,
  connectionId: string
) {
  return callApi('list', 'POST', 'List', {
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken(),
    kind,
    scope,
    namePattern,
    recurse: false
  });
}

export function describe(
  scope: Array<string>,
  name: string,
  kind?: DescribeKindType = 'table',
  connectionId: string
) {
  return callApi('describe', 'POST', 'Describe', {
    oauth2Token: oauth2.googleAccessToken(),
    connectionId: rewriteConnectionId(connectionId),
    scope,
    name,
    kind
  });
}

export function describeComposed(wsId: string, connectionId: string) {
  return callApi('describe_composed', 'POST', 'DescribeComposed', {
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken(),
    wsId
  });
}

export function describeQuery(definition: string, connectionId: string) {
  return callApi('describe_query', 'POST', 'DescribeQuery', {
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken(),
    definition
  });
}

function evalTable(
  endpoint: string,
  eventType: EventType,
  body: Object
): Promise<{| table: Values |}> {
  return callApi(endpoint, 'POST', eventType, body).then(res => {
    const table = res.table;
    for (const id in table) {
      table[id] = fromApiColumn(table[id]);
    }
    return { table };
  });
}

export function evalQuery(
  q: Query,
  offset: number,
  limit: number,
  anchor: ?Anchor,
  connectionId: string
): Promise<{| table: Values |}> {
  let pager = { offset, limit };
  if (anchor) pager = { ...pager, anchor };
  const body = {
    ...q.serializeForEval(Date.now(), pager),
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken()
  };
  return evalTable('eval', 'Eval', body);
}

export function evalCharts(
  q: Query,
  charts: Array<ChartEvalDef>,
  connectionId: string
): Promise<{| tables: Array<{| table: Values |}> |}> {
  const query = {
    input: q.serializeForEval(Date.now()),
    charts
  };
  return callApi('axis-eval', 'POST', 'ChartEval', {
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken(),
    query
  }).then(res => {
    const tables = res.tables.map(({ table }) => {
      for (const id in table) {
        table[id] = fromApiColumn(table[id]);
      }
      return { table };
    });
    return { tables };
  });
}

export function fetchTopK(
  q: Query,
  column: Id,
  search: ?string,
  connectionId: string
) {
  const query = {
    ...q.serializeForEval(Date.now()),
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken()
  };
  return evalTable('filter-detail', 'FetchTopK', {
    column,
    filter: {
      type: 'topK',
      limit: TOPK_VALUES,
      offset: 0,
      search: {
        value: search,
        type: 'contains'
      }
    },
    query
  });
}

export function fetchNumericRange(
  q: Query,
  column: Id,
  bins: number,
  connectionId: string
) {
  const query = {
    ...q.serializeForEval(Date.now()),
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken()
  };
  return callApi('filter-detail', 'POST', 'FetchRange', {
    column,
    filter: {
      type: 'numericRange',
      bins
    },
    query
  });
}

export function fetchDatetimeRange(
  q: Query,
  column: Id,
  bins: number,
  connectionId: string
) {
  const query = {
    ...q.serializeForEval(Date.now()),
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken()
  };
  return callApi('filter-detail', 'POST', 'FetchRange', {
    column,
    filter: {
      type: 'datetimeRange',
      bins
    },
    query
  });
}

export function checkDbConnection(dbspec: Object) {
  const spec = {
    dbspec,
    oauth2Token: oauth2.googleAccessToken()
  };

  return callApi('dbspec/check', 'POST', 'CheckDBConnection', spec);
}

export function download(
  q: Query,
  format: ExportFormat,
  fileName: string,
  connectionId: string
) {
  const startTime = Date.now();
  const requestId = genRequestId();

  const query = {
    ...q.serializeForEval(Date.now()),
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken()
  };

  const body = {
    format: {
      type: format
    },
    query
  };

  let sigmaServiceVersion = 'Unknown';
  return apiFetch('export', 'POST', body, requestId)
    .then(response => {
      sigmaServiceVersion =
        response.headers.get('x-sigma-version') || 'Unknown';

      if (!response.ok) {
        publish('ApiError', {
          durationMS: Date.now() - startTime,
          endpoint: `${getEndpointBase('v1')}/export`,
          format,
          requestId,
          status: response.status,
          statusText: response.statusText,
          sigmaServiceVersion
        });
        return Promise.reject(
          createErrorWithPayload({
            requestId,
            error: {
              code: response.status,
              message: response.statusText
            }
          })
        );
      }
      return response.blob();
    })
    .then(blob => {
      const durationMS = Date.now() - startTime;
      publish('DownloadFile', {
        format,
        durationMS,
        requestId,
        sigmaServiceVersion
      });
      downloadFile(blob, fileName);
    });
}

export function needsEval(query: Query, prevQuery: ?Query) {
  if (query && !prevQuery) return true;
  if (!query || query === prevQuery) return false;

  // avoid fetching if only the view state has changed
  const q = { ...query, view: null };
  const prevQ = { ...prevQuery, view: null };
  return !isEqual(q, prevQ);
}

export function getRowCount(q: Query, connectionId: string): Promise<number> {
  return evalTable('count-total', 'GetRowCount', {
    query: {
      ...q.serializeForEval(Date.now()),
      connectionId: rewriteConnectionId(connectionId),
      oauth2Token: oauth2.googleAccessToken()
    }
  }).then(result => {
    const count = getData(result.table._sigbasetotal, 0);
    invariant(typeof count === 'number', 'Expected row count to be a number');
    return count;
  });
}

export function getSql(q: Query, connectionId: string): Promise<string> {
  return callApi('eval-sql', 'POST', 'GetSql', {
    ...q.serializeForEval(Date.now()),
    connectionId: rewriteConnectionId(connectionId),
    oauth2Token: oauth2.googleAccessToken()
  }).then(result => result._sigmonoblock);
}



// WEBPACK FOOTER //
// ./src/utils/apiCaller.js