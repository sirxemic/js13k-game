import { TILE_SIZE } from '../constants'
import { TheCamera } from '../globals'
import { Camera } from '../Camera'
import { TheCanvas } from '../Graphics'
import { getCellX, getCellY, clamp } from '../utils'

export class EditorCamera extends Camera {
  constructor () {
    super()

    document.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    document.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    document.addEventListener('mouseup', this.onMouseUp.bind(this), false)
    document.addEventListener('contextmenu', e => e.preventDefault(), false)

    this.pause = false
    window.addEventListener('blur', e => this.pause = true, false)
    window.addEventListener('focus', e => this.pause = false, false)

    this.mouse = {
      leftDown: false,
      rightDown: false,
      screenX: TheCanvas.width / 2,
      screenY: TheCanvas.height / 2,
      worldX: 0,
      worldY: 0,
      tileX: 0,
      tileY: 0
    }

    this.listeners = []
  }

  addMouseListener (obj) {
    this.listeners.push(obj)
  }

  updateMousePosition (e) {
    let scale
    if (window.innerWidth / window.innerHeight > TheCanvas.width / TheCanvas.height) {
      scale = window.innerHeight / TheCanvas.height
    } else {
      scale = window.innerWidth / TheCanvas.width
    }
    let actualWidth = TheCanvas.width * scale
    let actualHeight = TheCanvas.height * scale
    let leftSide = window.innerWidth / 2 - actualWidth / 2
    let topSide = window.innerHeight / 2 - actualHeight / 2
    this.mouse.screenX = (e.clientX - leftSide) / scale
    this.mouse.screenY = (e.clientY - topSide) / scale

    this.updateDerivedPositions()
  }

  updateDerivedPositions () {
    this.mouse.worldX = this.viewXToWorldX(this.mouse.screenX)
    this.mouse.worldY = this.viewYToWorldY(this.mouse.screenY)

    this.mouse.tileX = getCellX(this.mouse.worldX)
    this.mouse.tileY = getCellY(this.mouse.worldY)
  }

  onMouseDown (e) {
    if (TheCamera !== this) {
      return
    }

    e.preventDefault()
    this.updateMousePosition(e)
    if (e.which === 1) this.mouse.leftDown = true
    if (e.which === 3) this.mouse.rightDown = true

    this.listeners.forEach(listener => listener.handleMouseDown({ ...this.mouse }))
  }

  onMouseMove (e) {
    if (TheCamera !== this) {
      return
    }

    e.preventDefault()
    this.updateMousePosition(e)

    this.listeners.forEach(listener => listener.handleMouseMove({ ...this.mouse }))
  }

  onMouseUp (e) {
    if (TheCamera !== this) {
      return
    }

    e.preventDefault()
    this.updateMousePosition(e)
    if (e.which === 1) this.mouse.leftDown = false
    if (e.which === 3) this.mouse.rightDown = false

    this.listeners.forEach(listener => listener.handleMouseUp({ ...this.mouse }))
  }

  updateTarget () {
    if (this.pause) {
      return
    }

    let margin = 200
    let maxSpeed = 5
    let updatedPosition = false
    if (this.mouse.screenX < margin) {
      this.targetX -= (margin - this.mouse.screenX) / margin * maxSpeed
      updatedPosition = true
    }
    if (this.mouse.screenY < margin) {
      this.targetY -= (margin - this.mouse.screenY) / margin * maxSpeed
      updatedPosition = true
    }
    if (this.mouse.screenX > TheCanvas.width - margin) {
      this.targetX += (this.mouse.screenX - (TheCanvas.width - margin)) / margin * maxSpeed
      updatedPosition = true
    }
    if (this.mouse.screenY > TheCanvas.height - margin) {
      this.targetY += (this.mouse.screenY - (TheCanvas.height - margin)) / margin * maxSpeed
      updatedPosition = true
    }

    if (this.targetX < this.minX) {
      this.targetX += (this.minX - this.targetX) / 12
    }
    if (this.targetY < this.minY) {
      this.targetY += (this.minY - this.targetY) / 12
    }
    if (this.targetX > this.maxX) {
      this.targetX += (this.maxX - this.targetX) / 12
    }
    if (this.targetY > this.maxY) {
      this.targetY += (this.maxY - this.targetY) / 12
    }

    if (updatedPosition) {
      this.updateDerivedPositions()
      this.listeners.forEach(listener => listener.handleMouseMove({ ...this.mouse }))
    }
  }

  setBoundaries ({ minX, maxX, minY, maxY }) {
    this.minX = minX * TILE_SIZE
    this.maxX = maxX * TILE_SIZE
    this.minY = minY * TILE_SIZE
    this.maxY = maxY * TILE_SIZE
  }
}
