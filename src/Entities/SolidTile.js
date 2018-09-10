import { TheColorScheme } from '../globals'
import { Tile } from './Tile'
import { TILE_SIZE, TAG_IS_SOLID } from '../constants'

export class SolidTile extends Tile {
  constructor (x, y) {
    super(x, y, TAG_IS_SOLID)
  }

  render (tiles, ctx) {
    let xx = (this.x % 24 + 24) % 24 / 24
    let yy = (this.y % 24 + 24) % 24 / 24
    ctx.globalAlpha = 1 - xx * (1 - xx) * yy * (1 - yy) - 0.01 + Math.random() * 0.02
    ctx.fillStyle = TheColorScheme.fg
    ctx.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
  }
}
