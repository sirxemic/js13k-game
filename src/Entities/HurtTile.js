import { TheColorScheme } from '../globals'
import { TILE_SIZE, TAG_IS_SOLID, TAG_IS_DEATH } from '../constants'
import { Tile } from './Tile'

export class HurtTile extends Tile {
  constructor (x, y) {
    super(x, y, TAG_IS_DEATH | TAG_IS_SOLID)
  }

  getIndex (tiles) {
    let x = this.x, y = this.y
    let verticalAlign = tiles.getTileAt(x, y - 1, TAG_IS_DEATH) || tiles.getTileAt(x, y + 1, TAG_IS_DEATH)
    let horizontalAlign = tiles.getTileAt(x - 1, y, TAG_IS_DEATH) || tiles.getTileAt(x + 1, y, TAG_IS_DEATH)
    if (tiles.getTileAt(x - 1, y, TAG_IS_SOLID) && verticalAlign) {
      return 3
    }
    if (tiles.getTileAt(x + 1, y, TAG_IS_SOLID) && verticalAlign) {
      return 1
    }
    if (tiles.getTileAt(x, y - 1, TAG_IS_SOLID) && horizontalAlign) {
      return 0
    }
    if (tiles.getTileAt(x, y + 1, TAG_IS_SOLID) && horizontalAlign) {
      return 2
    }
    if (tiles.getTileAt(x - 1, y, TAG_IS_SOLID)) {
      return 3
    }
    if (tiles.getTileAt(x + 1, y, TAG_IS_SOLID)) {
      return 1
    }
    if (tiles.getTileAt(x, y - 1, TAG_IS_SOLID)) {
      return 0
    }
    if (tiles.getTileAt(x, y + 1, TAG_IS_SOLID)) {
      return 2
    }

    return 0
  }

  render (tiles, ctx) {
    ctx.fillStyle = TheColorScheme.fg

    let x = this.x * TILE_SIZE
    let y = this.y * TILE_SIZE
    let index = this.getIndex(tiles)
    switch (index) {
      case 0:
      case 2:
        for (let i = 0; i < TILE_SIZE; i += 2) {
          let extra = (i / 2) % 2
          ctx.fillRect(x + i, y + (index === 2 ? extra : 0), 1, TILE_SIZE - extra)
        }
        break
      case 1:
      case 3:
        for (let i = 0; i < TILE_SIZE; i += 2) {
          let extra = (i / 2) % 2
          ctx.fillRect(x + (index === 1 ? extra : 0), y + i, TILE_SIZE - extra, 1)
        }
        break
    }
    ctx.stroke()
  }
}
