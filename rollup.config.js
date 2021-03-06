const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve').default
const { terser } = require('rollup-plugin-terser')

module.exports = [
	{
		input: 'lib/dist.js',
		output: {
			file: 'dist/index.js',
			format: 'iife',
			name: 'UIDateElement',
		},
		plugins: [
			commonjs(),
			resolve(),
		],
	},
	{
		input: 'lib/dist.js',
		output: {
			file: 'dist/index.min.js',
			format: 'iife',
			name: 'UIDateElement',
		},
		plugins: [
			commonjs(),
			resolve(),
			terser({
				compress: {
					dead_code: true,
					passes: 9,
				},
				mangle: {
					keep_classnames: true,
				}
			}),
		],
	}
]
