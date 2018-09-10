import { TheRenderer } from '../../Renderer'
import { EditorEntity } from './EditorEntity'

export class EditorCheckpoint extends EditorEntity {
  render () {
    for (let i = 0; i < 5; i++) {
      TheRenderer.drawRectangle(
        `rgba(255,127,255,${1 - i / 5}`,
        this.x * 8,
        this.y * 8 - i * 8,
        this.width * 8,
        this.height * 8
      )
    }
  }
}
