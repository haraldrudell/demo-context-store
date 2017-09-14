import pkg from './package.json'

export default [{
  input: 'src/Syslog.js',
  external: ['ms'],
  output: [
    {file: pkg.main, format: 'cjs'},
    {file: pkg.module, format: 'es'},
  ]
}]
