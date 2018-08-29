import { TILE_SIZE } from '../constants'

export class GridEntity {
  constructor (x, y, width=1, height=1) {
    this.x = x * TILE_SIZE
    this.y = y * TILE_SIZE

    this.width = width * TILE_SIZE
    this.height = height * TILE_SIZE
  }

  get cellX () {
    return this.x / TILE_SIZE
  }

  get cellY () {
    return this.y / TILE_SIZE
  }

  step () {}

  render () {}
}
