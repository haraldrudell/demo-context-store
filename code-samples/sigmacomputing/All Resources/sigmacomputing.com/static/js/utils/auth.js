// @flow
import * as firebase from 'firebase/app';
import 'firebase/auth';
import zxcvbn from 'zxcvbn';

import { firebaseConfig } from 'env';
import {
  getOrganizationId,
  initHomeInode,
  createOrganization
} from 'api/organization';
import { createIdentity } from 'api/user';
import { acceptInvite } from 'api/invite';
import { getEndpointBase } from 'utils/apiCaller';

export const EMAIL_INVALID = 'EMAIL_INVALID';
export const EMAIL_DISALLOWED = 'EMAIL_DISALLOWED';
export const EMAIL_TAKEN = 'EMAIL_TAKEN';
export const USER_NOT_FOUND = 'USER_NOT_FOUND';
export const PASSWORD_SHORT = 'PASSWORD_SHORT';
export const PASSWORD_INVALID = 'PASSWORD_INVALID';
export const EMAIL_SENT = 'EMAIL_SENT'; // UNUSED

// map zxcvbn score to description
export const SCORE_DESC = [
  'Very weak',
  'Weak',
  'Good',
  'Strong',
  'Very strong'
];

// Reject passwords < this score
const MIN_SCORE = 2;

type AuthToken = {| token: string, expires: Date |};
type TokenLoader = {| loader: Promise<AuthToken>, loading: boolean |};

let AUTH_TOKEN: ?TokenLoader = null;

// (max) XXX this is only used in unit tests
export function setCurrentAuthToken(t: string, e: number) {
  const token = {
    token: t,
    expires: new Date(new Date().getTime() + e)
  };

  AUTH_TOKEN = {
    loader: Promise.resolve(token),
    loading: false
  };
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let currentUserId = null;
function setCurrentUserId(uid?: string): Promise<void> {
  currentUserId = uid;

  AUTH_TOKEN = null; // wipe out the token and optionally force a reload
  if (currentUserId != null) {
    return getToken().then(() => void 0);
  }
  return Promise.resolve();
}

let organizationId = null;
function setCurrentOrgId(oid?: string): Promise<void> {
  organizationId = oid;

  AUTH_TOKEN = null; // wipe out the token and optionally force a reload

  if (currentUserId != null) {
    return getToken().then(() => void 0);
  }
  return Promise.resolve();
}

export function getCurrentOrgId(): string {
  return (organizationId: any);
}

export function getToken(): Promise<string> {
  if (AUTH_TOKEN == null) {
    return reloadToken();
  }

  return AUTH_TOKEN.loader.then(token0 => {
    const { token, expires } = token0;
    if (expires <= new Date()) {
      return reloadToken();
    } else {
      return token;
    }
  });
}

function getFirebaseToken(): Promise<string> {
  const user = firebase.auth().currentUser;
  if (user === null) {
    return Promise.reject(new Error('No user for token'));
  }
  return user.getIdToken();
}

// Makes a request to grant a new auth token, and updates
// the cached AUTH_TOKEN with a resolved promise.
function reloadToken(
  organizationId: ?string = getCurrentOrgId()
): Promise<string> {
  // if the token is loading, return the promise
  if (AUTH_TOKEN) {
    const { loader, loading } = AUTH_TOKEN;
    if (loading) {
      return loader.then(t => t.token);
    }
  }

  const loader = getFirebaseToken().then(token => {
    const payload = {
      issuer: 'firebase',
      organizationId,
      accessToken: token
    };

    return fetch(`${getEndpointBase('v2')}/grant-token`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(res => {
        const { accessToken, expiresIn } = res;

        const now = new Date().getTime();
        const expires = new Date(now + expiresIn * 1000);

        // mark the token as loaded
        if (AUTH_TOKEN != null) {
          AUTH_TOKEN.loading = false;
        }

        return {
          token: accessToken,
          expires: expires
        };
      });
  });

  // mark the token as loading and register an error handler
  AUTH_TOKEN = { loader, loading: true };
  loader.catch(() => AUTH_TOKEN && (AUTH_TOKEN.loading = false));

  return loader.then(t => t.token);
}

export function validateEmail(email: string) {
  // I've been convinced by enough articles that this very minimal email check is better than
  // trying to write use some crazy regex that'll break in some odd case
  // We can always send them an email if we want to validate it anyway
  return !email || email.indexOf('@') === -1 ? statusText(EMAIL_INVALID) : null;
}

export function validatePassword(password: string) {
  if (!password || password.length < 8) return statusText(PASSWORD_SHORT);

  // evaluate the password strength
  const res = zxcvbn(password);
  if (res.score < MIN_SCORE) {
    let msg;
    if (res.feedback && res.feedback.warning.length > 0) {
      msg = res.feedback.warning;
    } else {
      msg = `${SCORE_DESC[res.score]} password`;
    }
    return { password: msg };
  }
  return null;
}

export function getCurrentUserId(): string {
  if (!currentUserId) {
    throw new Error('No user for getCurrentUserId()');
  }
  return currentUserId;
}

export function updatePassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  var user = firebase.auth().currentUser;

  return firebase
    .auth()
    .signInWithEmailAndPassword(email, oldPassword)
    .then(() => {
      return user.updatePassword(newPassword);
    });
}

export function logout(): Promise<void> {
  currentUserId = null;
  return firebase.auth().signOut();
}

export function loginSubmit(email: string, password: string) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      return null;
    })
    .catch(err => {
      switch (err.code) {
        case 'auth/invalid-email':
          return statusText(EMAIL_INVALID);
        case 'auth/user-disabled':
          return statusText(EMAIL_DISALLOWED);
        case 'auth/user-not-found':
          return statusText(USER_NOT_FOUND);
        case 'auth/wrong-password':
          return statusText(PASSWORD_INVALID);
        default:
          return {
            loginError: err
          };
      }
    });
}

export function resetPassword(email: string) {
  return firebase.auth().sendPasswordResetEmail(email);
}

// XXX: this global variable is used in App to hold the auth callback until
// signup completes writing the initial state
export let signupPromise;

export function signupSubmit({
  email,
  password,
  name,
  orgId
}: {
  email: string,
  password: string,
  name: string,
  orgId?: string
}) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      signupPromise = reloadToken(null)
        .then(() =>
          createIdentity(name, email)
            .then(
              () =>
                orgId
                  ? acceptInvite(orgId)
                  : createOrganization(`${name}'s Organization`)
            )
            .then(() => {
              user.sendEmailVerification();
              signupPromise = null;
            })
            .catch(err =>
              user.delete().then(() => {
                return { signupError: `Unexpected error: ${err.message}` };
              })
            )
        )
        .then(() => {
          // "evict" the current token since it doesn't contain the organizationId
          AUTH_TOKEN = null;
        });

      return signupPromise;
    })
    .catch(err => {
      switch (err.code) {
        case 'auth/email-already-in-use':
          return statusText(EMAIL_TAKEN);
        case 'auth/invalid-email':
          return statusText(EMAIL_INVALID);
        case 'auth/weak-password':
          return statusText(PASSWORD_INVALID);
        default:
          return {
            signupError: err
          };
      }
    });
}

function statusText(status: string): ?Object {
  if (!status) return null;
  switch (status) {
    case EMAIL_INVALID:
      return { email: 'Invalid email' };
    case EMAIL_DISALLOWED:
      return { email: 'No new entrants' };
    case EMAIL_SENT:
      return { email: 'Email sent' };
    case EMAIL_TAKEN:
      return { email: 'Email taken' };
    case USER_NOT_FOUND:
      return { email: 'User with this email address not found' };
    case PASSWORD_SHORT:
      return { password: 'Minimum 8 characters' };
    case PASSWORD_INVALID:
      return { password: 'Incorrect password' };
    default:
      return null;
  }
}

export function loginOrg({
  uid,
  email
}: {
  uid: string,
  email: string
}): Promise<{ uid: string, email: string, organizationId: string }> {
  return setCurrentUserId(uid)
    .then(() => getOrganizationId())
    .then(organizationId =>
      setCurrentOrgId(organizationId).then(() =>
        initHomeInode().then(() => ({
          uid,
          email,
          organizationId
        }))
      )
    );
}

export function logoutOrg(): void {
  setCurrentOrgId();
  setCurrentUserId();
}

export function isLoggedInToOrg() {
  return currentUserId != null && organizationId != null;
}



// WEBPACK FOOTER //
// ./src/utils/auth.js