import { TILE_SIZE } from '../constants'
import { ThePlayer, deltaTime } from '../globals'
import { TheGraphics } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { approach, distanceSquared } from '../utils'
import { GridEntity } from './GridEntity'

let index = 0
let colors = ['#f00', '#fff', '#0f0', '#00f', '#0ff', '#ff0', '#f0f']

class Point {
  constructor (goalX, goalY) {
    this.goalX = goalX
    this.goalY = goalY

    let r = 5 + Math.random() * 10
    let rSpeed = 10
    let a = Math.random() * 2 * Math.PI
    this.x = this.goalX + Math.cos(a) * r
    this.y = this.goalY + Math.sin(a) * r
    this.xSpeed = Math.sin(a) * rSpeed
    this.ySpeed = -Math.cos(a) * rSpeed
    this.gravity = 500

    this.color = colors[index++ % colors.length]
  }

  step () {
    this.x += this.xSpeed * deltaTime
    this.y += this.ySpeed * deltaTime

    this.gravitateTowards(this.gravity, this.goalX, this.goalY)

    if (ThePlayer.finishedLevel) {
      this.gravity = approach(this.gravity, 100, 100)
    }
  }

  gravitateTowards (gravity, x, y) {
    let dx = this.x - x
    let dy = this.y - y
    let rr = Math.max(1, dx * dx + dy * dy)
    let ax = -gravity * dx / rr
    let ay = -gravity * dy / rr

    this.xSpeed += ax * deltaTime
    this.ySpeed += ay * deltaTime
  }
}

const NUM_POINTS = 20

export class Goal extends GridEntity {
  constructor (x, y) {
    super(x, y)

    this.points = []
    for (let i = 0; i < NUM_POINTS; i++) {
      this.points.push(new Point(
        this.x + TILE_SIZE / 2,
        this.y + TILE_SIZE / 2
      ))
    }

    this.alpha = 1
  }

  step () {
    let bbox = ThePlayer.boundingBox
    let playerX = bbox.centerX
    let playerY = bbox.centerY
    let centerX = this.x + TILE_SIZE / 2
    let centerY = this.y + TILE_SIZE / 2

    if (distanceSquared(centerX, centerY, playerX, playerY) < TILE_SIZE * TILE_SIZE && (ThePlayer.isDashing() || ThePlayer.ySpeed > 240)) {
      ThePlayer.setFinished()
    }

    if (ThePlayer.finishedLevel) {
      this.alpha = approach(this.alpha, 0, deltaTime)
    }
  }

  render () {
    TheGraphics.globalAlpha = this.alpha
    for (let i = 0; i < NUM_POINTS; i++) {
      let point = this.points[i]

      let skip = Math.round(Math.random() * Math.random() * 8)
      for (let j = 0; j < skip; j++) {
        point.step()
      }

      TheRenderer.drawRectangle(
        point.color,
        point.x - 1,
        point.y - 1,
        2,
        2
      )
    }
    TheGraphics.globalAlpha = 1
  }
}
