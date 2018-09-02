import { TheRenderer } from '../../Renderer'
import { EditorEntity } from './EditorEntity'
import { TheGraphics } from '../../Graphics'

export class EditorMovingPlatform extends EditorEntity {
  constructor (x, y, w, h, xSpeed, ySpeed) {
    super(x, y, w, h)
    this.xSpeed = xSpeed
    this.ySpeed = ySpeed
  }

  render () {
    let centerX = this.x * 8 + this.width * 4
    let centerY = this.y * 8 + this.height * 4

    let x1, y1, x2, y2, x3, y3
    if (this.xSpeed) {
      x1 = -0.2 * this.xSpeed
      y1 = -4
      x2 = -0.2 * this.xSpeed
      y2 = +4
      x3 = +0.2 * this.xSpeed
      y3 = 0
    } else {
      x1 = -4
      y1 = -0.2 * this.ySpeed
      x2 = +4
      y2 = -0.2 * this.ySpeed
      x3 = 0
      y3 = +0.2 * this.ySpeed
    }

    TheRenderer.drawRectangle('#000', this.x * 8, this.y * 8, this.width * 8, this.height * 8)
    TheGraphics.fillStyle = '#fff'
    TheGraphics.beginPath()
    TheGraphics.moveTo(centerX + x1, centerY + y1)
    TheGraphics.lineTo(centerX + x2, centerY + y2)
    TheGraphics.lineTo(centerX + x3, centerY + y3)
    TheGraphics.fill()
  }
}
