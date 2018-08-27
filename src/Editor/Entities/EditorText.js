import { TheRenderer } from '../../Renderer'
import { EditorEntity } from './EditorEntity'

export class EditorText extends EditorEntity {
  constructor (x, y, text) {
    if (text.trim().length === 0) {
      text = 'ABCDEFG'
    }

    super(
      x, y,
      1, 1
    )
    this.text = text
  }

  render () {
    TheRenderer.drawText(this.text, this.x * 8, this.y * 8)
  }
}