export function debounce(f, delay) {
  let t;
  return function(...args) {
    function handler() {
      clearTimeout(t);
      f.apply(undefined, args);
    }
    clearTimeout(t);
    t = setTimeout(handler, delay);
  };
}



// WEBPACK FOOTER //
// ./src/utils/fn_utils.js