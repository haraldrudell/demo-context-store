Promise.resolve().then(() => new X().render()) // works!

// Sidebar() ReferenceError: Sidebar is not defined

class X {
  render() {
    return Sidebar()
  }
}

// new X().render() ReferenceError: Sidebar is not defined

const Sidebar = () => false
