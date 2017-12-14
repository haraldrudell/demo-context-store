/*global window */

module.exports = {
  componentDidMount: function() {
    if (this.onUnload) {
      window.addEventListener("unload", this.onUnload);
    }
    if (this.onBeforeUnload) {
      window.addEventListener("beforeunload", this.onBeforeUnload);
    }
  },

  componentWillUnmount: function() {
    if (this.onUnload) {
      window.removeEventListener("unload", this.onUnload);
    }
    if (this.onBeforeUnload) {
      window.removeEventListener("beforeunload", this.onBeforeUnload);
    }
  }
};



//////////////////
// WEBPACK FOOTER
// ./~/react-window-mixins/lib/on-unload.js
// module id = 597
// module chunks = 1