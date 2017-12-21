// @flow
// https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
export function makeCancelable(promise: Promise<*>) {
  let hasCanceled_ = false;

  // $FlowFixMe
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)))
      .catch(
        error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
      );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
}

export function createErrorWithPayload(payload: any) {
  return Object.assign(new Error(), payload);
}

export type CancelablePromise = {
  promise: Promise<*>,
  cancel: () => void
};



// WEBPACK FOOTER //
// ./src/utils/promise.js