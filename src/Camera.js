import { TheCanvas } from './Graphics'
import { TheWorld, ThePlayer, deltaTime } from './globals'
import { approach } from './utils'

const SHAKE_MULTIPLIER = 8
const MAX_SHAKE_RADIUS = 6

export class Camera {
  constructor () {
    this.x = 0
    this.y = 0
    this.targetX = 0
    this.targetY = 0
    this.shakeX = 0
    this.shakeY = 0
    this.shakeTargetX = 0
    this.shakeTargetY = 0
    this.shakeToggle = 0

    this.shakeAmount = 0
    this.shakeTime = 0

    this.scale = 2
    this.scaleTarget = 4
    this.scaleSpeed = 0.01
  }

  step () {
    this.updateZoom()
    this.updateTarget()
    this.updateShake()

    this.x = this.targetX + this.shakeX
    this.y = this.targetY + this.shakeY
  }

  updateShake () {
    let r = Math.min(MAX_SHAKE_RADIUS, SHAKE_MULTIPLIER * this.shakeAmount * this.shakeAmount)
    let a = Math.random() * 2 * Math.PI

    if (this.shakeToggle) {
      this.shakeTargetX = r * Math.cos(a)
      this.shakeTargetY = r * Math.sin(a)
    }
    this.shakeToggle = !this.shakeToggle
    this.shakeX += (this.shakeTargetX - this.shakeX) * 0.75
    this.shakeY += (this.shakeTargetY - this.shakeY) * 0.75

    this.shakeAmount = approach(this.shakeAmount, 0, deltaTime)
  }

  updateTarget () {
    let playerCenterY = ThePlayer.getBoundingBox().centerY

    let zone1 = this.getHeight() / 10
    let zone2 = this.getHeight() / 6

    const approachY = (y) => {
      this.targetY += (playerCenterY + y - this.targetY) / 8
    }

    if (ThePlayer.grounded) {
      approachY(0)
    }
    else if (playerCenterY < this.y - zone2) {
      this.targetY = playerCenterY + zone2
    }
    else if (playerCenterY > this.y + zone2) {
      this.targetY = playerCenterY - zone2
    }
    else if (playerCenterY < this.y - zone1) {
      approachY(zone1)
    }
    else if (playerCenterY > this.y + zone1) {
      approachY(-zone1)
    }

    this.targetY = Math.max(0, Math.min(this.targetY, TheWorld.height))
    this.targetX = Math.max(0, Math.min(ThePlayer.x, TheWorld.width))
  }

  updateZoom () {
    this.scale += (this.scaleTarget - this.scale) * this.scaleSpeed
  }

  addShake (amount) {
    this.shakeAmount = Math.min(1, this.shakeAmount + amount)
    this.shakeToggle = true
  }

  getWidth () {
    return TheCanvas.width / this.scale
  }

  getHeight () {
    return TheCanvas.height / this.scale
  }

  viewXToWorldX (x) {
    return (x - TheCanvas.width / 2) / this.scale + this.x
  }

  viewYToWorldY (y) {
    return (y - TheCanvas.height / 2) / this.scale + this.y
  }
}
