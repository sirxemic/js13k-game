import { deltaTime, TheWorld } from '../globals'
import { TheGraphics, TheCanvas } from '../Graphics'
import { TheRenderer } from '../Renderer'

const dashGradient = TheGraphics.createRadialGradient(
  TheCanvas.width / 2,
  TheCanvas.height / 2,
  200,
  TheCanvas.width / 2,
  TheCanvas.height / 2,
  1000
)

dashGradient.addColorStop(0, '#eeeeee00')
dashGradient.addColorStop(1, '#eeeeee53')

export class Flash {
  constructor () {
    this.alpha = 1
  }

  step () {
    this.alpha -= deltaTime * 2
    if (this.alpha < 0) {
      TheWorld.removeGuiEntity(this)
    }
  }

  render () {
    TheGraphics.globalAlpha = this.alpha
    TheRenderer.drawRectangle(dashGradient, 0, 0, TheCanvas.width, TheCanvas.height)
    TheGraphics.globalAlpha = 1
  }
}
