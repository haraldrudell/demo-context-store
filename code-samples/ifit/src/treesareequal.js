const sampleTree = {
  a: 1,
  b: 1,
  c: {
    c1: "1",
    c2: 1
  }
}

console.log(leavesAreEqual(sampleTree))

function leavesAreEqual(tree) {
  let value
  return checkObject(Object(tree))

  function checkObject(o) {
    return Object.values(o).every(prop => typeof prop === 'object'
      ? checkObject(prop)
      : value === undefined
        ? (value = prop, true)
        : value === prop)
  }
}
