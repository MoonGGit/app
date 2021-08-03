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
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'@teamsupercell/typings-for-css-modules-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							/* 임포트하여 오브젝트로서 사용가능 */
							url: true,
						},
					},
					'sass-loader',
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						// url-loader는 base64 URL로 변환해줌
						options: {
							name: 'assets/[name].[ext]?[hash]',
							// output의 경로 + assets/...
						},
					},
				],
			},
		],
	},

	output: {
		path: path.join(__dirname, '/dist/static/'),
		filename: '[name].[contenthash].js',
	},

	devServer: {
		historyApiFallback: true,
		inline: true,
		port: 3030,
		hot: true,
		publicPath: '/',
		writeToDisk: true,
		contentBase: path.join(__dirname, '/dist/'),
		// output의 path보다 아래에 있어서 설정
	},

	plugins: [
		new webpack.ProvidePlugin({
			React: 'react',
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: '../index.html',
			// output의 path 기준으로 파일이 생성됨
		}),
		new webpack.HotModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].[contenthash].css',
		}),
	],
};
