const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: ['./src/entry.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.gif$/,
        use: [{ loader: 'url-loader' }]
      }
    ]
  }
}
