const path = require('path')

module.exports = {
  entry: {
    app: ['./src/editorEntry.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  }
}
