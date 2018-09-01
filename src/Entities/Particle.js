import { TheRenderer } from '../Renderer'
import { ParticlesSprite } from '../Assets'
import { deltaTime, TheWorld } from '../globals'
import { TheGraphics } from '../Graphics'
import { randomInt } from '../utils'

export class Particle {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.spriteIndex = randomInt(ParticlesSprite.frames.length)
    this.timer = 1
  }

  step () {
    this.timer -= deltaTime
    if (this.timer <= 0) {
      TheWorld.removeEntity(this)
    }
  }

  render () {
    TheGraphics.globalAlpha = 0.5 * this.timer
    TheRenderer.drawSprite(ParticlesSprite, this.x, this.y, this.spriteIndex)
    TheGraphics.globalAlpha = 1
  }
}
