import { TheSceneManager, ThePlayer, TheWorld } from '../globals'
import { TheGraphics } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { FlowersSprite } from '../Assets'
import { Fade} from './Fade'

let indexCounter = 0
class Flower {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.alpha = 0
    this.index = (indexCounter++) % FlowersSprite.frames.length
  }

  render () {
    TheGraphics.globalAlpha = this.alpha
    this.alpha += 0.1
    TheRenderer.drawSprite(FlowersSprite, this.x, this.y, this.index)
  }
}

let fibonacci = [1,2,3,5,8]

export class FinishAnimation {
  constructor (isFinalLevel) {
    this.isFinalLevel = isFinalLevel
    this.centerX = ThePlayer.x
    this.centerY = ThePlayer.y - 6
    this.timer = 0
    this.FlowersSprite = []
    this.scanners = []

    for (let i = 0; i < 5; i++) {
      this.scanners.push({ r: 0, a: 0 })
    }
  }

  step () {
    this.timer++

    if (!this.isFinalLevel) {
      if (this.timer == 60) {
        TheWorld.addGuiEntity(new Fade('#fff', 0))
      }

      if (this.timer == 120) {
        TheSceneManager.loadNextLevel()
      }
    }

    if (this.timer > 10 && this.timer < 240) {
      for (let i = 0; i < 5; i++) {
        let scanner = this.scanners[i]
        scanner.r += 2
        scanner.a += fibonacci[i] * (1 - this.timer / 240)
        let x = ThePlayer.x + Math.cos(scanner.a) * scanner.r
        let y = ThePlayer.y + Math.sin(scanner.a) * scanner.r

        if (TheWorld.solidAt(x - 2, y - 2, 4, 4)) {
          this.FlowersSprite.push(new Flower(x, y))
        }
      }
    }
  }

  render () {
    this.FlowersSprite.forEach(flower => flower.render())
    TheGraphics.globalAlpha = 1
    TheGraphics.lineWidth = 1
    TheRenderer.drawCircle(null, '#fff', this.centerX, this.centerY, Math.pow(this.timer, 1.125))
    TheRenderer.drawCircle(null, '#fff', this.centerX, this.centerY, Math.pow(this.timer, 1.25))
  }
}
