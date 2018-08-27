const fs = require('fs')

module.exports = {
  getDefinitions () {
    const definitions = {}
    fs.readdirSync('assets').forEach(asset => {
      const match = asset.match(/(\w+)\.gif/)
      if (!match) {
        return
      }

      const bytes = fs.readFileSync(`assets/${asset}`)
      definitions[`__assets_${match[1]}_gif__`] = JSON.stringify('data:image/gif;base64,' + bytes.toString('base64'))
    })
    return definitions
  }
}
