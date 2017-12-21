// @flow
export const isStaging = Boolean(process.env.REACT_APP_IS_STAGING);
export const isProd = process.env.NODE_ENV === 'production';

const DEFAULT_STAGING_PERC = 1.0; // 0.75; // Send 75% of staging requests to staging qwill
const PROD_URL = 'https://api.sigmacomputing.com';
const STAGE_URL = 'https://api.staging.sigmacomputing.io';

export function getApiEndpoint() {
  if (isStaging) {
    // In staging, we route 75% (by default) of requests to the staging qwill and the rest to prod
    let stagingPerc = window.stagingPerc;
    if (stagingPerc === undefined) stagingPerc = DEFAULT_STAGING_PERC;
    return Math.random() <= stagingPerc ? STAGE_URL : PROD_URL;
  }

  return isProd ? PROD_URL : '';
}

// Make the Git commit hash available in a global
export const COMMIT_HASH = (window.COMMIT_HASH =
  process.env.REACT_APP_COMMIT_HASH);

const devApiKey =
  process.env.REACT_APP_FIREBASE_API_KEY ||
  'AIzaSyBSAj2S64Awkxwv3UH8LQNZLOweHKr6cak';
const devProjectId =
  process.env.REACT_APP_FIREBASE_PROJECT_ID || 'storyboard-74d79';

export let firebaseConfig = {
  apiKey: devApiKey,
  authDomain: `${devProjectId}.firebaseapp.com`,
  databaseURL: `https://${devProjectId}.firebaseio.com`
};
if (isStaging) {
  firebaseConfig = {
    apiKey: 'AIzaSyBt8AhFbiQtjoPMvRipPlz2MF9L6u41WvY',
    authDomain: 'slate-staging-8b80a.firebaseapp.com',
    databaseURL: 'https://slate-staging-8b80a.firebaseio.com/'
  };
} else if (isProd) {
  firebaseConfig = {
    apiKey: 'AIzaSyAVNdDGHJ9b0Gbryh6OoJgUUTa20_ms4ts',
    authDomain: 'slate-fc6b5.firebaseapp.com',
    databaseURL: 'https://slate-fc6b5.firebaseio.com'
  };
}



// WEBPACK FOOTER //
// ./src/env.js