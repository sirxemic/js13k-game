import { TILE_SIZE, COLOR_FG_LAYER } from '../constants'
import { ThePlayer, TheWorld } from '../globals'
import { overlapping, hexColorWithAlpha, generateImage, forRectangularRegion } from '../utils'
import { TheRenderer } from '../Renderer'
import { GridEntity } from './GridEntity'

let imageCache = {}
async function getImage (width, height) {
  let key = width + ';' + height
  if (!imageCache[key]) {
    imageCache[key] = await generateImage(width, height, ctx => {
      forRectangularRegion(0, 0, width / TILE_SIZE - 1, height / TILE_SIZE - 1, (xi, yi) => {
        ctx.fillStyle = hexColorWithAlpha(COLOR_FG_LAYER, 0.94 - 0.01 + Math.random() * 0.02)
        ctx.fillRect(xi * TILE_SIZE, yi * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      })
    })
  }

  return imageCache[key]
}

export class MovingPlatform extends GridEntity {
  constructor (x, y, width, height, direction) {
    super(x, y, width, height)

    this.direction = direction
    this.collidable = true
  }

  async initialize () {
    this.image = await getImage(this.width, this.height)
  }

  step () {
    this.collidable = false

    if (this.collideAt(this.x + this.direction, this.y)) {
      this.direction = -this.direction
    }

    this.x += this.direction

    if (ThePlayer.isAlive) {
      if (ThePlayer.isRiding(this)) {
        ThePlayer.move(this.direction, 0)
      } else {
        const overlappingPlayer = overlapping(
          ThePlayer.boundingBox,
          this
        )
        if (overlappingPlayer) {
          ThePlayer.moveX(this.direction, () => {
            ThePlayer.die()
          })
        }
      }
    }

    this.collidable = true
  }

  collideAt (x, y) {
    return TheWorld.solidAt(x, y, this.width, this.height, { ignore: this })
  }

  render () {
    TheRenderer.drawImage(this.image, this.x, this.y)
  }
}
