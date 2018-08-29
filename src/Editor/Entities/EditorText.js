import { TheRenderer } from '../../Renderer'
import { EditorEntity } from './EditorEntity'
import { drawText } from '../../fontUtils'
import { TheGraphics } from '../../Graphics';

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
    drawText(TheGraphics, this.text, this.x * 8, this.y * 8)
  }
}
