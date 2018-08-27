export class Tileset {
  constructor () {
    this.tiles = {}
  }

  add (tile) {
    this.tiles[tile.x + ';' + tile.y] = tile
  }

  delete (tile) {
    delete this.tiles[tile.x + ';' + tile.y]
  }

  getTileAt (x, y, tags = 0) {
    let tile = this.tiles[x + ';' + y]
    if (!tile) {
      return null
    }
    if (tags) {
      return (tile.tags & tags) ? tile : null
    }

    return tile
  }

  forEach (callback) {
    for (let key in this.tiles) {
      let [x, y] = key.split(';').map(Number)
      callback(this.tiles[key], x, y)
    }
  }
}
