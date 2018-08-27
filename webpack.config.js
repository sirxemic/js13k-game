const path = require('path')
const webpack = require('webpack')
const { getDefinitions } = require('./buildUtils')

module.exports = {
  entry: {
    app: ['./src/entry.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
  plugins: [
    new webpack.DefinePlugin(getDefinitions())
  ]
}
