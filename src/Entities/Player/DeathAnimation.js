import { TheGraphics } from '../../Graphics'
import { deltaTime, TheSceneManager, TheCamera, TheWorld } from '../../globals'
import { playSample } from '../../Audio'
import { DeathSound } from '../../Assets'
import { TheRenderer } from '../../Renderer'

class ExplosionCircle {
  constructor (color, startRadius, offset) {
    this.color = color

    let a = Math.random() * Math.PI * 2
    this.x = Math.cos(a) * offset
    this.y = Math.sin(a) * offset
    this.radius = startRadius
    this.alpha = 0
    this.alphaDelta = 1 / startRadius
  }

  render () {
    this.radius--
    this.alpha += this.alphaDelta
    if (this.radius <= 0) {
      return
    }

    TheRenderer.drawCircle(this.color, null, this.x, this.y, this.radius)
    TheRenderer.setAlpha(this.alpha)
    TheRenderer.drawCircle('#888', null, this.x, this.y, this.radius)
    TheRenderer.resetAlpha()
  }
}

export class DeathAnimation {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.timer = 0
    this.circles = [
      { circle: new ExplosionCircle('#d48621', 18, 0), startAt: 0 },
      { circle: new ExplosionCircle('#fff2aa', 9, 8), startAt: 0.1 },
      { circle: new ExplosionCircle('#d48621', 9, 7), startAt: 0.2 },
      { circle: new ExplosionCircle('#fff2aa', 9, 6), startAt: 0.3 }
    ]
    this.circleIndex = 0
    TheCamera.addShake(1)
    playSample(DeathSound)
    TheWorld.delay = 2
  }

  step () {
    this.timer += deltaTime
    if (this.timer >= 1) {
      TheWorld.respawnPlayer()
    }
  }

  render () {
    TheRenderer.drawAt(this.x, this.y, () => {
      this.circles.forEach(props => {
        if (this.timer < props.startAt) {
          return
        }
        props.circle.render()
      })
    })
  }
}
