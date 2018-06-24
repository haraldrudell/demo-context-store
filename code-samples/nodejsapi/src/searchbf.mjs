class Tree {
  // v
  // left
  // right
  constructor(v) {
    if (v != null) this.v = v
  }
  addNode(v) {
    if (this.v == null) return this.v = v
    else if (v < this.v) {
      if (this.left == null) this.left = new Tree(v)
      else this.left.addNode(v)
    } else {
      if (this.right == null) this.right = new Tree(v)
      else this.right.addNode(v)
    }
    return this
  }
  print(n, x) {
    if (n == null) n = 0
    const v = this.v
    const s = '\x20'.repeat(n)
    console.log(`${s}${x ? x : ''}v: ${v != null ? v : 'null'}`)
    n++
    if (this.left) this.left.print(n, 'L')
    if (this.right) this.right.print(n, 'R')
  }
}

run()
function run() {
  createTree().print()
}

function createTree() {
  return new Tree(10)
    .addNode(5)
    .addNode(7)
    .addNode(1)
}
