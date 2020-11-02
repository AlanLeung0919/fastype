module.exports = {
	pages: {
		index: {
			entry: './src/main.js',
			title: 'Fastype'
		}
	},
	configureWebpack: {
		externals: {
			moment: 'moment'
		},
		performance: {
			maxEntrypointSize: 512000,
			maxAssetSize: 512000
		}
	}
};
