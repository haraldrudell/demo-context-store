// @flow

import { FUNCTION_CATEGORIES, type FuncDef } from '@sigmacomputing/sling';

// These ids are assigned by Zendesk when the article is created
const ZENDESK_CATEGORY_ARTICLES = {
  [FUNCTION_CATEGORIES.LOGICAL]: '115001434593',
  [FUNCTION_CATEGORIES.AGG]: '115001434613',
  [FUNCTION_CATEGORIES.WINDOW]: '115001433174',
  [FUNCTION_CATEGORIES.MATH]: '115001433194',
  [FUNCTION_CATEGORIES.TEXT]: '115001433214',
  [FUNCTION_CATEGORIES.DATE]: '115001433234',
  [FUNCTION_CATEGORIES.TYPE]: '115001433254'
};

const ZENDESK_HOST = 'help.sigmacomputing.com';
// Formula Manual
const ZENDESK_CATEGORY = '115000152074';

export function sling_help_url(): string {
  return `https://${ZENDESK_HOST}/hc/en-us/categories/${ZENDESK_CATEGORY}`;
}

export function function_help_url(fn: FuncDef): ?string {
  const id = ZENDESK_CATEGORY_ARTICLES[fn.category];
  return id && `https://${ZENDESK_HOST}/hc/en-us/articles/${id}#${fn.name}`;
}



// WEBPACK FOOTER //
// ./src/utils/zendesk.js