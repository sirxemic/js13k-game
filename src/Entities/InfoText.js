import { TILE_SIZE } from '../constants'
import { TheRenderer } from '../Renderer'

export class InfoText {
  constructor (x, y, text) {
    this.x = x * TILE_SIZE
    this.y = y * TILE_SIZE
    this.text = text
  }

  step () {

  }

  render () {
    TheRenderer.drawText(this.text, this.x, this.y)
  }
}
