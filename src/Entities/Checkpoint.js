import { TheWorld, ThePlayer } from '../globals'
import { GridEntity } from './GridEntity'
import { TILE_SIZE } from '../constants'
import { overlapping } from '../utils'

let OUT_OF_BOUNDS_MARGIN = 10

let lastCheckpoint

export class Checkpoint extends GridEntity {
  initialize () {
    this.respawnX = this.cellX
    this.respawnY = this.cellY

    let x0 = this.cellX
    let y0 = this.cellY
    let y1 = this.cellY
    while (y0 >= -OUT_OF_BOUNDS_MARGIN && !TheWorld.tiles.getTileAt(x0, y0 - 1)) {
      y0--
    }
    this.y = y0 * TILE_SIZE
    this.height = (y1 - y0 + 1) * TILE_SIZE
  }

  step () {
    if (lastCheckpoint !== this && overlapping(this, ThePlayer.boundingBox)) {
      lastCheckpoint = this

      TheWorld.playerSpawnX = this.respawnX
      TheWorld.playerSpawnY = this.respawnY
    }
  }
}
