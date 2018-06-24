Promise.resolve().then(() => new N().sort([1, 3, 2]))

class N {
  sort(n) {
    if (!(Array.isArray(n))) n = []
    n = n.slice()
    for (let a = 0; a < n.length - 1; a++)
      for (let b = a + 1; b < n.length; b++)
        if (n[a] > n[b]) {
          const x = n[a]
          n[a] = n[b]
          n[b] = x
        }
    console.log(n)
  }
}
