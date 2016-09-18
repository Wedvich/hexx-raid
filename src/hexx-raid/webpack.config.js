var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// Base configuration
var config = {
  entry: ['babel-polyfill', 'isomorphic-fetch', './js/index'],
  output: {
    path: path.join(__dirname, 'wwwroot'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
};

// Development-specific configuration
if (process.env.NODE_ENV === 'development') {
  config.devtool = 'eval-source-map';
  config.entry.unshift('webpack/hot/only-dev-server');
  config.entry.unshift('webpack-dev-server/client?http://localhost:48580');
  config.output.publicPath = '/';

  config.module.loaders[0].query = {
    plugins: [[
      'react-transform', {
        transforms: [{
          transform: 'react-transform-hmr',
          imports: ['react'],
          locals: ['module']
        }]
      }
    ]]
  };

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.HotModuleReplacementPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 4858,
      proxy: 'http://localhost:48580',
      files: ['wwwroot/**/*.css', 'wwwroot/**/*.html']
    }, {
      ghostMode: false,
      reload: false
    })
  ];
}

// Production-specific configuration
else {
  config.devtool = 'source-map';

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ];

  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM'
  };
}

module.exports = config;
