const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line import/no-extraneous-dependencies
const slsw = require('serverless-webpack');

module.exports = {
  //entry: slsw.lib.entries,
  entry: './handler.ts',
  target: 'node',
  externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'imports-loader?graphql',
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: { node: '8.10' } }]],
            },
          },
        ],
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ],
      }
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'handler.js',
  },
};
