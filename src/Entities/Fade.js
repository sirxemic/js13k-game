import { deltaTime } from '../globals'
import { TheCanvas } from '../Graphics'
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
    TheRenderer.setAlpha(this.alpha)
    TheRenderer.drawRectangle(this.color, 0, 0, TheCanvas.width, TheCanvas.height)
    TheRenderer.resetAlpha()
  }
}
