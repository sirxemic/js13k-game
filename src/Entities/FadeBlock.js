import { TILE_SIZE } from '../constants'
import { ThePlayer, deltaTime } from '../globals'
import { generateImage, forRectangularRegion, renderSolidSquare, overlapping } from '../utils'
import { TheRenderer } from '../Renderer'
import { GridEntity } from './GridEntity'
import { TheGraphics } from '../Graphics'

const ANIMATION_DURATION = 0.2
const RESPAWN_WAITING_DURATION = 15

export class FadeBlock extends GridEntity {
  constructor (x, y, width, height) {
    super(x, y, width, height)

    this.reset()
  }

  reset () {
    this.collidable = true
    this.playerWasOnTop = false
    this.animationStep = 0
  }

  async initialize () {
    this.renderable = await generateImage(this.width, this.height, ctx => {
      forRectangularRegion(0, 0, this.width / TILE_SIZE - 1, this.height / TILE_SIZE - 1, (x, y) => {
        renderSolidSquare(ctx, x, y)
      })

      const data = ctx.getImageData(0, 0, this.width, this.height)

      for (let x = 2; x < this.width - 2; x++) {
        data.data[4 * (x + 1 * this.width) + 3] = 0
        data.data[4 * (x + (this.height - 2) * this.width) + 3] = 0
      }

      for (let y = 2; y < this.height - 2; y++) {
        data.data[4 * (1 + y * this.width) + 3] = 0
        data.data[4 * (this.width - 2 + y * this.width) + 3] = 0
      }

      ctx.putImageData(data, 0, 0)
    })
  }

  step () {
    if (!this.collidable) {
      this.animationStep += deltaTime
      if (this.animationStep >= RESPAWN_WAITING_DURATION) {
        this.reset()
      } else {
        return
      }
    }

    if (overlapping(this, ThePlayer.boundingBox)) {
      ThePlayer.die()
      return
    }

    let playerOnTop = ThePlayer.isRiding(this)

    if (playerOnTop && !this.playerWasOnTop) {
      this.playerWasOnTop = true
    } else if (!playerOnTop && this.playerWasOnTop) {
      this.collidable = false
    }
  }

  render () {
    let alpha
    if (this.animationStep < ANIMATION_DURATION) {
      alpha = 1 - this.animationStep / ANIMATION_DURATION
    } else if (this.animationStep > RESPAWN_WAITING_DURATION - ANIMATION_DURATION) {
      alpha = 1 - (RESPAWN_WAITING_DURATION - this.animationStep) / ANIMATION_DURATION
    } else {
      return
    }

    let hScale = 2 - alpha
    let vScale = alpha
    let renderWidth = this.width * hScale
    let renderHeight = this.height * vScale
    let left = this.x + (this.width - renderWidth) / 2
    let top = this.y + (this.height - renderHeight) / 2
    TheRenderer.setAlpha((alpha + 1) / 2)
    TheRenderer.drawImage(this.renderable, left, top, renderWidth, renderHeight)
    TheRenderer.resetAlpha()
  }
}
