import { deltaTime, TheWorld } from '../globals'
import { TheGraphics, TheCanvas } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { approach } from '../utils'

export class Fade {
  constructor (color, alpha) {
    this.color = color
    this.alpha = alpha
    this.targetAlpha = 1 - alpha
  }

  step () {
    /*
    if (this.alpha === this.targetAlpha) {
      TheWorld.removeGuiEntity(this)
    }
    */

    this.alpha = approach(this.alpha, this.targetAlpha, deltaTime)
  }

  render () {
    TheGraphics.globalAlpha = this.alpha
    TheRenderer.drawRectangle(this.color, 0, 0, TheCanvas.width, TheCanvas.height)
    TheGraphics.globalAlpha = 1
  }
}
