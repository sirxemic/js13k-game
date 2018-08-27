export class Brush {
  constructor (action) {
    this.action = action

    this.drawing = false
    this.currentTileX = 0
    this.currentTileY = 0
    this.prevTileX = 0
    this.prevTileY = 0
  }

  start (x, y) {
    this.drawing = true
    this.prevTileX = this.currentTileX = x
    this.prevTileY = this.currentTileY = y
  }

  update (x, y) {
    this.prevTileX = this.currentTileX
    this.prevTileY = this.currentTileY
    this.currentTileX = x
    this.currentTileY = y
  }

  end () {
    this.drawing = false
  }
}