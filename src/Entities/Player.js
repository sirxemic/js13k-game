import { TheWorld, TheCamera, deltaTime, frame } from '../globals'
import { TheRenderer } from '../Renderer'
import { Input } from '../Input'
import {
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
  UP_DIRECTION,
  DOWN_DIRECTION,
  BOOST_TOGGLE,
  JUMP_OR_DASH,

  DASH_PREPARATION_TIME,
  DASH_DURATION,
  DASH_UP_SPEED,
  DASH_DOWN_SPEED,
  DASH_HORIZONTAL_SPEED,
  DASH_DIAGONAL_SPEED_X,
  DASH_DIAGONAL_SPEED_Y,
  MAX_FALLING_SPEED,
  RUN_SPEED_HORIZONTAL,
  AIR_ACC_MULTIPLIER,
  RUN_ACCELERATION,
  RUN_BOOST_FRACTION,
  JUMP_SPEED,
  JUMP_FIRST_PHASE_DURATION,
  JUMP_FIRST_PHASE_GRAVITY,
  DEFAULT_GRAVITY,
  DASH_FLOATING_DURATION,
  TAG_IS_DEATH
} from '../constants'

import { approach, sign, hasTag } from '../utils'
import { PLAYER_SPRITE } from '../Assets/sprites'
import { Wings } from './Player/Wings'
import { playSample } from '../Audio'
import { FSM } from '../FSM'
import { DashSound, JumpSound, ImpactSound, RebootSound } from '../Assets'
import { DeathAnimation } from './Player/DeathAnimation'
import { Particle } from './Particle'
import { FinishAnimation } from './FinishAnimation'
import { Flash } from './Flash'

class InputTimer {
  constructor () {
    this.active = false
  }

  start (count) {
    this.active = true
    this.timer = count
  }

  stop () {
    this.timer = 0
    this.active = false
  }

  isActive () {
    return this.active
  }

  step () {
    if (!this.active) return

    this.timer--
    if (this.timer <= 0) {
      this.active = false
    }
  }
}

const STATE_DISABLED = 0
const STATE_OFF = 1
const STATE_TURNING_ON = 2
const STATE_ON = 3
const STATE_DASHING = 4
const STATE_NORMAL = 5
const STATE_FLOATING = 6

class BoostModeFSM extends FSM {
  constructor (player) {
    super(
      {
        [STATE_DISABLED]: {
          enter: () => {
            player.detachWings()
          },
          execute: () => {
            if (player.grounded) {
              this.setState(STATE_OFF)
            }
          }
        },
        [STATE_OFF]: {
          enter: () => {
            player.detachWings()
          },
          execute: () => {
            if (Input.getKey(BOOST_TOGGLE)) {
              this.setState(STATE_TURNING_ON)
            }
          }
        },
        [STATE_TURNING_ON]: {
          enter: () => {
            this.counter = DASH_PREPARATION_TIME
            player.attachWings()
          },
          execute: () => {
            if (!Input.getKey(BOOST_TOGGLE)) {
              this.setState(STATE_OFF)
              return
            }

            this.counter -= deltaTime
            if (this.counter <= 0) {
              this.setState(STATE_ON)
            }
          }
        },
        [STATE_ON]: {
          execute: () => {
            if (!Input.getKey(BOOST_TOGGLE) && player.movementFSM.activeState !== STATE_DASHING) {
              this.setState(STATE_OFF)
              return
            }
          }
        }
      },
      STATE_DISABLED
    )
  }

  didAirDash () {
    this.setState(STATE_DISABLED)
  }
}

function getDashDirection (left, up, right, down) {
  return (
    (LEFT_DIRECTION * left) |
    (UP_DIRECTION * up) |
    (RIGHT_DIRECTION * right) |
    (DOWN_DIRECTION * down)
  )
}

function getIsValidDashDirection (direction) {
  return (
    direction !== 0 &&
    direction !== LEFT_DIRECTION + RIGHT_DIRECTION &&
    direction !== UP_DIRECTION + DOWN_DIRECTION &&
    direction !== LEFT_DIRECTION + RIGHT_DIRECTION + UP_DIRECTION + DOWN_DIRECTION
  )
}

class WalkingDashingFSM extends FSM {
  constructor (player) {
    super(
      {
        [STATE_NORMAL]: {
          execute: () => {
            if (player.grounded) {
              this.airDashCount = 0

              player.resetGravity()
            }

            if (player.boostModeActive()) {
              if (!this.handleDashInput(player)) {
                player.handleNormalControls()
              }
            } else {
              player.handleNormalControls()
            }
          }
        },

        [STATE_DASHING]: {
          enter: (dashDirection) => {
            player.dash(dashDirection)

            this.dashTimer = DASH_DURATION
            if (player.ySpeed == -DASH_UP_SPEED) {
              this.dashTimer -= 0.06
            }

            if (!player.groundedTimer.isActive()) {
              this.airDashCount++
              player.loseWings()
            } else {
              player.wings.flap()
            }

            TheWorld.addGuiEntity(new Flash())
          },

          execute: () => {
            this.dashTimer -= deltaTime
            if (this.dashTimer <= 0) {
              this.setState(STATE_FLOATING)
            } else {
              if (frame % 2 === 0) {
                TheWorld.addEntity(
                  new Particle(
                    player.x - player.bboxOffsetX + Math.random() * player.bboxWidth,
                    player.y - player.bboxOffsetY + Math.random() * player.bboxHeight
                  )
                )
              }
            }
          }
        },

        [STATE_FLOATING]: {
          enter: () => {
            this.floatTimer = DASH_FLOATING_DURATION
            player.startFloat()
          },

          execute: () => {
            // If we can dash...
            if (player.boostModeActive() && this.airDashCount === 0) {
              // And pressed dash, we can immediately go back to DASHING state
              if (this.handleDashInput(player)) {
                return
              }
            }

            player.handleNormalControls()

            this.floatTimer -= deltaTime
            if (this.floatTimer <= 0) {
              this.setState(STATE_NORMAL)
            }
          },

          leave: () => {
            if (player.dashDirection !== 1 << 3) {
              player.stopFloat()
            }
          }
        }
      },
      STATE_NORMAL
    )
  }

  handleDashInput (player) {
    if (!player.jumpInputTimer.isActive()) {
      return false
    }

    if (!player.grounded && this.airDashCount > 0) {
      return false
    }

    let dashDirection = getDashDirection(
      Input.getKey(LEFT_DIRECTION),
      Input.getKey(UP_DIRECTION),
      Input.getKey(RIGHT_DIRECTION),
      Input.getKey(DOWN_DIRECTION)
    ) || UP_DIRECTION

    const mask = getDashDirection(
      !player.solidAt(player.x - 1, player.y),
      !player.solidAt(player.x, player.y - 1),
      !player.solidAt(player.x + 1, player.y),
      !player.grounded
    )

    dashDirection &= mask

    if (getIsValidDashDirection(dashDirection)) {
      this.setState(STATE_DASHING, dashDirection)
      return true
    } else {
      return false
    }
  }

  cancelDash (player, directions) {
    if (this.activeState !== STATE_DASHING) {
      return
    }

    player.dashDirection &= ~directions
    if (player.dashDirection === 0) {
      this.setState(STATE_FLOATING)
    }
  }
}

export class Player {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.facing = 1
    this.xSpeed = 0
    this.ySpeed = 0
    this.bboxOffsetX = 3
    this.bboxOffsetY = 8
    this.bboxWidth = 6
    this.bboxHeight = 8
    this.grounded = false
    this.jumpTimer = 0

    this.isAlive = true
    this.finishedLevel = false

    this.xRemainder = 0
    this.yRemainder = 0

    this.dashDirection = 0

    this.defaultGravity = DEFAULT_GRAVITY
    this.gravity = this.defaultGravity
    this.maxFallingSpeed = MAX_FALLING_SPEED

    this.jumpInputTimer = new InputTimer()
    this.groundedTimer = new InputTimer()

    this.wings = new Wings()
    this.walkingIndex = 0
    this.spriteIndex = 0
    this.scaleX = 1
    this.scaleY = 1
    this.wingsYOffset = 0

    this.boostModeFSM = new BoostModeFSM(this)
    this.movementFSM = new WalkingDashingFSM(this)
  }

  step () {
    // Death animation before all else when dead
    if (!this.isAlive) {
      this.deathAnimation.step()
      this.wings.step()
      return
    }

    if (this.finishedLevel) {
      this.wings.step()
      this.xSpeed *= 0.5
      this.ySpeed *= 0.5
      this.move(this.xSpeed * deltaTime, this.ySpeed * deltaTime)
      return
    }

    if (this.y > TheWorld.height + 100) {
      this.die()
      return
    }

    this.grounded = (
      this.solidAt(this.x, this.y + 1) &&
      !this.collideAt(this.x, this.y + 1, { tags: TAG_IS_DEATH })
    )

    if (this.grounded) {
      this.groundedTimer.start(4)
    }

    if (Input.getKeyDown(JUMP_OR_DASH)) {
      this.jumpInputTimer.start(4)
    }
    if (!Input.getKey(JUMP_OR_DASH)) {
      this.jumpInputTimer.stop()
    }

    this.boostModeFSM.step()
    this.movementFSM.step()

    if (this.xSpeed !== 0) {
      this.facing = sign(this.xSpeed)
    }

    this.move(this.xSpeed * deltaTime, this.ySpeed * deltaTime)

    this.jumpInputTimer.step()
    this.groundedTimer.step()

    this.updateSprite()
    this.wings.step()
  }

  updateSprite () {
    this.spriteIndex = 0

    this.wings.setFacing(sign(this.xSpeed))

    // Dashing
    if (this.movementFSM.activeState === STATE_DASHING) {
      if (this.xSpeed === 0) {
        this.spriteIndex = 0
      }
      else {
        this.spriteIndex = 3
      }
    }
    else if (!this.grounded) {
      // Jumping with horizontal speed
      if (Math.abs(this.xSpeed) > 100) {
        this.spriteIndex = 1
        if (this.ySpeed > 100) {
          this.spriteIndex = 4
        }
      }
      // Falling
      else if (this.ySpeed > 100) {
        this.spriteIndex = 5
      }
      // Jumping up
      else {
        this.spriteIndex = 0
      }
    }
    // Walking
    else if (Math.abs(this.xSpeed) > 100) {
      this.spriteIndex = Math.floor(this.walkingIndex) % 2 + 1
      this.walkingIndex += 0.1
    }

    const longate = this.ySpeed < 0 ? Math.min(0.1, -this.ySpeed / 100) : 0
    this.scaleX = (1 - longate)
    this.scaleY = 1 + longate * 2

    this.wings.setOffsetY([-8, -7, -8, -7, -7, -8, -7][this.spriteIndex]) * this.scaleY
  }

  attachWings () {
    this.wings.attach(this)
  }

  detachWings () {
    const dx = Math.max(10, Math.abs(this.xSpeed / 8)) * sign(this.xSpeed || this.facing)
    this.wings.detach(-dx, -this.ySpeed / 8)
  }

  loseWings () {
    this.detachWings()
    this.boostModeFSM.didAirDash()
  }

  dash (direction) {
    this.dashDirection = direction

    this.xSpeed = 0
    this.ySpeed = 0
    if (direction & 0x01) this.xSpeed--
    if (direction & 0x02) this.ySpeed--
    if (direction & 0x04) this.xSpeed++
    if (direction & 0x08) this.ySpeed++
    if (this.xSpeed !== 0 && this.ySpeed !== 0) {
      this.xSpeed *= DASH_DIAGONAL_SPEED_X
      this.ySpeed *= DASH_DIAGONAL_SPEED_Y
    } else {
      this.xSpeed *= DASH_HORIZONTAL_SPEED
      this.ySpeed *= DASH_UP_SPEED
    }

    if (this.ySpeed == DASH_UP_SPEED) {
      this.ySpeed = DASH_DOWN_SPEED
    }

    playSample(DashSound)
  }

  handleNormalControls () {
    let targetSpeed = RUN_SPEED_HORIZONTAL * (-Input.getKey(LEFT_DIRECTION) + Input.getKey(RIGHT_DIRECTION))
    const multiplier = this.grounded ? 1 : AIR_ACC_MULTIPLIER
    if (targetSpeed === 0) {
      this.xSpeed = approach(this.xSpeed, targetSpeed, multiplier * RUN_ACCELERATION * deltaTime)
    } else if (this.xSpeed === 0) {
      if (this.grounded) {
        // If on ground the player can have a little boost
        this.xSpeed = targetSpeed * RUN_BOOST_FRACTION
      } else {
        // but in the air still needs some acceleration
        this.xSpeed = approach(this.xSpeed, targetSpeed, multiplier * RUN_ACCELERATION * deltaTime)
      }
    } else if (sign(targetSpeed) === sign(this.xSpeed)) {
      this.xSpeed = approach(this.xSpeed, targetSpeed, multiplier * RUN_ACCELERATION * deltaTime)
    } else if (sign(targetSpeed) !== sign(this.xSpeed)) {
      this.xSpeed = approach(this.xSpeed, targetSpeed, 4 * multiplier * RUN_ACCELERATION * deltaTime)
    }

    if (!this.boostModeActive() && this.groundedTimer.isActive() && this.jumpInputTimer.isActive()) {
      this.ySpeed = -JUMP_SPEED
      this.jumpTimer = JUMP_FIRST_PHASE_DURATION
      this.jumpInputTimer.stop()

      playSample(JumpSound)
    }

    if (!this.grounded) {
      this.jumpTimer -= deltaTime
      if (this.jumpTimer > 0 && Input.getKey(JUMP_OR_DASH)) {
        this.ySpeed += JUMP_FIRST_PHASE_GRAVITY * deltaTime
      }
      else if (this.jumpTimer <= 0 || !Input.getKey(JUMP_OR_DASH)) {
        this.ySpeed = approach(this.ySpeed, this.maxFallingSpeed, this.gravity * deltaTime)
        this.jumpTimer = 0
      }
    }
  }

  move (dx, dy) {
    let stopX = (collider) => {
      // Only let it kill if the player had somewhat of a horizontal speed into it
      if (hasTag(collider, TAG_IS_DEATH) && Math.abs(dx) >= 0.5) {
        this.die()
        return
      }

      this.stopHorizontalMovement(false)
    }

    let stopY = (collider) => {
      if (hasTag(collider, TAG_IS_DEATH)) {
        this.die()
        return
      }

      this.stopVerticalMovement(true)
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.moveX(dx, stopX)
      this.moveY(dy, stopY)
    } else {
      this.moveY(dy, stopY)
      this.moveX(dx, stopX)
    }
  }

  stopHorizontalMovement () {
    if (Math.abs(this.xSpeed) >= 200) {
      this.showImpactFeedback()
    }

    this.xSpeed = 0
    this.movementFSM.cancelDash(this, getDashDirection(1, 0, 1, 0))
  }

  stopVerticalMovement () {
    if (this.ySpeed >= 230 || this.ySpeed < -200) {
      this.showImpactFeedback()

      // Show some dust
      for (let i = -2; i <= 2; i++) {
        TheWorld.addEntity(new Particle(this.x + i * 4, this.y - 1 - Math.random() * 2))
      }

      // Freeze the world for a few frames
      TheWorld.delay = Math.abs(this.ySpeed) == 320 ? 2 : 1
    }

    this.jumpTimer = 0
    this.ySpeed = 0
    this.movementFSM.cancelDash(this, getDashDirection(0, 1, 0, 1))
  }

  showImpactFeedback () {
    TheCamera.addShake(0.4)
    playSample(ImpactSound, 0.2)
  }

  resetGravity () {
    this.gravity = this.defaultGravity
  }

  startFloat () {
    this.gravity = 0
  }

  stopFloat () {
    this.gravity = this.defaultGravity
  }

  moveX (amount, onCollide) {
    this.xRemainder += amount
    let move = 0 | Math.round(this.xRemainder)

    if (move !== 0) {
      this.xRemainder -= move
      let step = sign(move)

      while (move !== 0) {
        let collider = this.solidAt(this.x + step, this.y)
        if (!collider) {
          this.x += step
          move -= step
        }
        else {
          onCollide && onCollide(collider)
          break
        }
      }
    }
  }

  moveY (amount, onCollide) {
    this.yRemainder += amount
    let move = 0 | Math.round(this.yRemainder)

    if (move !== 0) {
      this.yRemainder -= move
      let step = sign(move)

      while (move !== 0) {
        let collider = this.solidAt(this.x, this.y + step)
        if (!collider) {
          this.y += step
          move -= step
        }
        else {
          onCollide && onCollide(collider)
          break
        }
      }
    }
  }

  collideAt (x, y, params) {
    return TheWorld.collideAt(
      x - this.bboxOffsetX,
      y - this.bboxOffsetY,
      this.bboxWidth,
      this.bboxHeight,
      params
    )
  }

  solidAt (x, y) {
    return TheWorld.solidAt(
      x - this.bboxOffsetX,
      y - this.bboxOffsetY,
      this.bboxWidth,
      this.bboxHeight
    )
  }

  getBoundingBox () {
    return {
      x: this.x - this.bboxOffsetX,
      y: this.y - this.bboxOffsetY,
      width: this.bboxWidth,
      height: this.bboxHeight,
      centerX: this.x - this.bboxOffsetX + this.bboxWidth / 2,
      centerY: this.y - this.bboxOffsetY + this.bboxHeight / 2
    }
  }

  boostModeActive () {
    return this.boostModeFSM.activeState === STATE_ON
  }

  isDashing () {
    return this.movementFSM.activeState === STATE_DASHING
  }

  isRiding (platform) {
    return (
      platform.y === this.y &&
      this.x - this.bboxOffsetX + this.bboxWidth > platform.x &&
      this.x - this.bboxOffsetX < platform.x + platform.width
    )
  }

  render () {
    this.wings.render()

    if (!this.isAlive) {
      this.deathAnimation.render()
      return
    }

    TheRenderer.drawSprite(PLAYER_SPRITE, this.x, this.y, this.spriteIndex, this.facing * this.scaleX, this.scaleY)
  }

  die () {
    if (!this.isAlive) {
      return
    }

    this.isAlive = false
    this.deathAnimation = new DeathAnimation(this.x, this.getBoundingBox().centerY)
    this.detachWings()
  }

  setFinished () {
    if (this.finishedLevel) {
      return
    }

    this.finishedLevel = true
    this.finishAnimation = new FinishAnimation()
    TheWorld.addEntity(this.finishAnimation)
    TheCamera.addShake(1)
    playSample(RebootSound, 0.2, true)
  }
}
