import { TheSceneManager, ThePlayer, TheWorld } from '../globals'
import { TheGraphics } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { FLOWERS } from '../Assets/sprites'
import { Fade} from './Fade'

let indexCounter = 0
class Flower {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.alpha = 0
    this.index = (indexCounter++) % FLOWERS.frames.length
  }

  render () {
    TheGraphics.globalAlpha = this.alpha
    this.alpha += 0.1
    TheRenderer.drawSprite(FLOWERS, this.x, this.y, this.index)
  }
}

let fibonacci = [1,2,3,5,8]

export class FinishAnimation {
  constructor () {
    this.timer = 0
    this.flowers = []
    this.scanners = []

    for (let i = 0; i < 5; i++) {
      this.scanners.push({ r: 0, a: 0 })
    }
  }

  step () {
    this.timer++

    if (!TheWorld.isFinalLevel) {
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
          this.flowers.push(new Flower(x, y))
        }
      }
    }
  }

  render () {
    this.flowers.forEach(flower => flower.render())
    TheGraphics.globalAlpha = 1
    TheGraphics.lineWidth = 1
    TheRenderer.drawCircle(null, '#fff', ThePlayer.x, ThePlayer.y - 6, Math.pow(this.timer, 1.125))
    TheRenderer.drawCircle(null, '#fff', ThePlayer.x, ThePlayer.y - 6, Math.pow(this.timer, 1.25))
  }
}