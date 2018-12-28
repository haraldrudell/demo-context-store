import babel from 'rollup-plugin-babel'

export default {
  input: 'src/server.js',
  output: {file: './server.js', format: 'cjs'},
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      include: '**/*.js',
      presets: [['env', {modules: false, targets: {node: '8'}}]],
      plugins: [

      ],
    }),
  ],
}
