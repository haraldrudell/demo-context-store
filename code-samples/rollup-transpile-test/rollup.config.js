import pkg from './package.json'
export default pkg.undefined || {input: './a.js', output: {format: 'cjs'}}
