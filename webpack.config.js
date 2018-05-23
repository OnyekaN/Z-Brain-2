const webpack = require('webpack');
const path = require('path');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PROD = (process.env.NODE_ENV === 'production');

module.exports = {
	context: __dirname,
	entry: [
		'./app/app.js'
	],
	output: {
		path: path.join(__dirname, 'app/assets/js'),
		filename: PROD ? 'main.min.js': 'main.js'
},
	module: {
		rules: [
			{
				test: path.join(__dirname, '/\.js?$/'),
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin([
			{ context: 'app/common',
				from: '**/*.html',
				to: path.join(__dirname, 'app/assets/views')
			}
		],
			{ copyUnmodified: false }
		),
		PROD && new webpack.optimize.UglifyJsPlugin({
							compress: { warnings: false }
		})
	].filter(Boolean).filter((plugin) => plugin.constructor.name !== 'UglifyJsPlugin'),

};



process.noDeprecation = true;

