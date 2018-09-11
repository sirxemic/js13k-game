import { InfoText } from './InfoText'
import { GAME_TITLE } from '../constants'
import { ThePlayer, TheCamera, TheColorScheme } from '../globals'
import { TheRenderer } from '../Renderer'
import { TheGraphics } from '../Graphics'

export class MainTitle {
  constructor () {
    this.text = new InfoText(0, 0, GAME_TITLE)
  }

  initialize () {
    this.text.x = ThePlayer.x - 30
    this.text.y = ThePlayer.y - 10

    return this.text.initialize()
  }

  step () {}

  render () {
    TheGraphics.globalAlpha = 1 - (1 - TheCamera.introZoomFactor) * (1 - TheCamera.introZoomFactor)
    TheRenderer.drawRectangle(TheColorScheme.bg1, TheCamera.x - 300, TheCamera.y - 300, 600, 600)
    this.text.render()
    TheGraphics.globalAlpha = 1
  }
}
