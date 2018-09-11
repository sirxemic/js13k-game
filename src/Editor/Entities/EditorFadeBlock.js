import { TheRenderer } from '../../Renderer'
import { EditorEntity } from './EditorEntity'

export class EditorFadeBlock extends EditorEntity {
  render () {
    let x = this.x * 8
    let y = this.y * 8
    let width = this.width * 8
    let height = this.height * 8
    TheRenderer.drawRectangle('#000', x, y, width, height)
    TheRenderer.drawRectangle('#fff', x + 2, y + 2, width - 4, height - 4)
    TheRenderer.drawRectangle('#000', x + 3, y + 3, width - 6, height - 6)
  }
}
