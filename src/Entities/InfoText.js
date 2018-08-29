import { TheRenderer } from '../Renderer'
import { GridEntity } from './GridEntity'

export class InfoText extends GridEntity {
  constructor (x, y, text) {
    super(x, y)
    this.text = text
  }

  render () {
    TheRenderer.drawText(this.text, this.x, this.y)
  }
}
