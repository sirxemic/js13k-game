import { TheRenderer } from '../../Renderer'
import { EditorEntity } from './EditorEntity'

export class EditorHurtTile extends EditorEntity {
  constructor (x, y) {
    super(x, y, 1, 1)
  }

  render () {
    TheRenderer.drawRectangle('#f0f', this.x * 8, this.y * 8, 8, 8)
  }
}