console.log(require("babel-core").transform("export default class Foo {}", {
  plugins: ["transform-runtime"]
}))
