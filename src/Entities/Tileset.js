export class Tileset {
  constructor () {
    this.tiles = {}
  }

  addTile (tile) {
    this.tiles[tile.x + ';' + tile.y] = tile
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

  forEachTile (callback) {
    for (let key in this.tiles) {
      callback(this.tiles[key])
    }
  }
}
