const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
	mode: prod ? 'production' : 'development',
	devtool: prod ? 'hidden-source-map' : 'source-map',

	entry: './public/index.tsx',

	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', 'scss', 'css'],
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ['babel-loader', 'ts-loader'],
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'@teamsupercell/typings-for-css-modules-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							/* 임포트하여 오브젝트로서 사용가능 */
						},
					},
					'sass-loader',
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'@teamsupercell/typings-for-css-modules-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},

	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'bundle.js',
	},

	devServer: {
		historyApiFallback: true,
		inline: true,
		port: 3030,
		hot: true,
		publicPath: '/',
	},

	plugins: [
		new webpack.ProvidePlugin({
			React: 'react',
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].[contenthash].css',
		}),
	],
};
