import { TheRenderer } from '../Renderer'
import { PARTICLES_SPRITE } from '../Assets/sprites'
import { deltaTime, TheWorld } from '../globals'
import { TheGraphics } from '../Graphics'
import { randomInt } from '../utils'

export class Particle {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.spriteIndex = randomInt(PARTICLES_SPRITE.frames.length)
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
    TheRenderer.drawSprite(PARTICLES_SPRITE, this.x, this.y, this.spriteIndex)
    TheGraphics.globalAlpha = 1
  }
}
