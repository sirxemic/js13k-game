import { TheRenderer } from '../../Renderer'
import { EditorEntity } from './EditorEntity'
import { TheGraphics } from '../../Graphics'

export class EditorMovingPlatform extends EditorEntity {
  constructor (x, y, w, h, direction) {
    super(x, y, w, h)
    this.direction = direction
  }

  render () {
    let centerX = this.x * 8 + this.width * 4
    let centerY = this.y * 8 + this.height * 4
    let offset = -this.direction * 4
    TheRenderer.drawRectangle('#000', this.x * 8, this.y * 8, this.width * 8, this.height * 8)
    TheGraphics.fillStyle = '#fff'
    TheGraphics.beginPath()
    TheGraphics.moveTo(centerX + offset, centerY - 4)
    TheGraphics.lineTo(centerX + offset, centerY + 4)
    TheGraphics.lineTo(centerX - offset, centerY)
    TheGraphics.fill()
  }
}