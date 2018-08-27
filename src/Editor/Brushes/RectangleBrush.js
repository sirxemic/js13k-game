import { Brush } from './Brush'
import { TheRenderer } from '../../Renderer'

export class RectangleBrush extends Brush {
  start (x, y) {
    super.start(x, y)

    this.startTileX = x
    this.startTileY = y
  }

  end () {
    super.end()

    let x0 = Math.min(this.startTileX, this.currentTileX)
    let y0 = Math.min(this.startTileY, this.currentTileY)
    let x1 = x0 + Math.abs(this.startTileX - this.currentTileX)
    let y1 = y0 + Math.abs(this.startTileY - this.currentTileY)

    this.action(x0, y0, x1, y1)
  }

  render () {
    let x = Math.min(this.startTileX, this.currentTileX)
    let y = Math.min(this.startTileY, this.currentTileY)
    let w = Math.abs(this.startTileX - this.currentTileX) + 1
    let h = Math.abs(this.startTileY - this.currentTileY) + 1

    TheRenderer.drawRectangle('#222', x * 8, y * 8, w * 8, h * 8)
  }
}