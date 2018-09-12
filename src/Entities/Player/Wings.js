import { approach, sign } from '../../utils'
import { DASH_PREPARATION_TIME } from '../../constants'
import { WingSprite } from '../../Assets'
import { deltaTime } from '../../globals'
import { TheGraphics } from '../../Graphics'
import { TheRenderer } from '../../Renderer'
import { FSM } from '../../FSM'

const STATE_DETACHED = 0
const STATE_ATTACHING = 1
const STATE_ATTACHED = 2
const STATE_FLAPPING = 3
const STATE_DETACHING = 4

class WingFSM extends FSM {
  constructor (wing) {
    super(
      {
        [STATE_DETACHED]: {
          execute: () => {
            this.alpha = 0
          }
        },

        [STATE_ATTACHING]: {
          enter: (obj) => {
            this.timer = 0

            const angle = - 0.5 + Math.random() + (obj.facing === 1 ? Math.PI : 0)
            wing.x = wing.xFrom = obj.x + 20 * Math.cos(angle)
            wing.y = wing.yFrom = obj.y + 20 * Math.sin(angle)
            wing.rotation = 0
            wing.attachObject = obj
          },

          execute: () => {
            this.timer += deltaTime

            let duration = DASH_PREPARATION_TIME + deltaTime * 3

            let alpha = this.timer / duration
            alpha = (2 - alpha) * alpha

            let xTo = wing.attachObject.x + wing.xOff
            let yTo = wing.attachObject.y + wing.yOff

            wing.x = wing.xFrom + (xTo - wing.xFrom) * alpha
            wing.y = wing.yFrom + (yTo - wing.yFrom) * alpha
            wing.alpha = alpha

            if (this.timer >= duration) {
              this.setState(STATE_ATTACHED)
              return
            }
          }
        },

        [STATE_ATTACHED]: {
          execute: () => {
            wing.x = wing.attachObject.x + wing.xOff
            wing.y = wing.attachObject.y + wing.yOff
            wing.rotation = 0
          }
        },

        [STATE_FLAPPING]: {
          enter: () => {
            this.timer = 20
            wing.rotation = Math.PI / 2
          },
          execute: () => {
            wing.x = wing.attachObject.x + wing.xOff
            wing.y = wing.attachObject.y + wing.yOff
            let x = this.timer / 20
            wing.rotation = -sign(wing.facing) * Math.PI / 2 * x * x
            this.timer--
            if (this.timer == 0) {
              this.setState(STATE_ATTACHED)
            }
          }
        },

        [STATE_DETACHING]: {
          enter: (xSpeed, ySpeed) => {
            wing.attachObject = null
            this.xSpeed = xSpeed
            this.ySpeed = ySpeed
            this.rotationSpeed = Math.random() * 4 - 2
          },
          execute: () => {
            wing.x += this.xSpeed * deltaTime
            wing.y += this.ySpeed * deltaTime
            wing.rotation += this.rotationSpeed * deltaTime
            wing.alpha = approach(wing.alpha, 0, 2 * deltaTime)

            if (wing.alpha <= 0) {
              this.setState(STATE_DETACHED)
            }
          }
        }
      },
      STATE_DETACHED
    )
  }
}

class Wing {
  constructor (facing) {
    this.x = 0
    this.y = 0
    this.facing = this.targetFacing = facing
    this.rotation = 0

    this.xOff = -2 * facing
    this.yOff = -6
    this.alpha = 0

    this.fsm = new WingFSM(this)
  }

  attach (obj) {
    if (this.attachObject !== obj) {
      this.fsm.setState(STATE_ATTACHING, obj)
    }
  }

  detach (xSpeed, ySpeed) {
    if (this.fsm.activeState !== STATE_DETACHED) {
      this.fsm.setState(STATE_DETACHING, xSpeed, ySpeed)
    }
  }

  step () {
    this.facing += (this.targetFacing - this.facing) / 5
    this.fsm.step()
  }

  setOffsetY (offset) {
    if (this.attachObject) {
      this.yOff = offset
    }
  }

  flap () {
    this.fsm.setState(STATE_FLAPPING)
  }

  render () {
    if (this.alpha <= 0) {
      return
    }

    TheRenderer.setAlpha(this.alpha)
    TheRenderer.drawSprite(WingSprite, this.x, this.y, 0, this.facing, 1, this.rotation)
    TheRenderer.resetAlpha()
  }
}

export class Wings {
  constructor () {
    this.wings = [new Wing(-1), new Wing(1)]
    this.renderOrder = [0, 1]
  }

  attach (obj) {
    for (let wing of this.wings) {
      wing.attach(obj)
    }
  }

  detach (xSpeed, ySpeed) {
    for (let wing of this.wings) {
      wing.detach(xSpeed, ySpeed)
    }
  }

  flap () {
    for (let wing of this.wings) {
      wing.flap()
    }
  }

  step () {
    for (let wing of this.wings) {
      wing.step()
    }
  }

  setOffsetY (offset) {
    for (let wing of this.wings) {
      wing.setOffsetY(offset)
    }
  }

  setFacing (facing) {
    switch (facing) {
      case 0:
        this.renderOrder = [0, 1]
        this.wings[0].targetFacing = -1
        this.wings[1].targetFacing = 1
        break
      case -1:
        this.renderOrder = [1, 0]
        this.wings[0].targetFacing = -1
        this.wings[1].targetFacing = -1
        break
      case 1:
        this.renderOrder = [0, 1]
        this.wings[0].targetFacing = 1
        this.wings[1].targetFacing = 1
        break
    }
  }

  render () {
    this.renderOrder.forEach(index => this.wings[index].render())
  }
}
