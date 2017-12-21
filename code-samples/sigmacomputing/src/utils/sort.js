// @flow

const Collator = new window.Intl.Collator({});

export function names(asc?: boolean, prop?: string): (any, any) => number {
  const LT = (asc || false) === true ? -1 : 1;
  const GT = -1 * LT;

  return (a, b) => {
    if (a == null) {
      return LT;
    } else if (b == null) {
      return GT;
    }

    const cmp =
      typeof prop === 'string'
        ? Collator.compare(a[prop], b[prop])
        : Collator.compare(a, b);

    return cmp < 0 ? LT : cmp > 0 ? GT : 0;
  };
}



// WEBPACK FOOTER //
// ./src/utils/sort.js