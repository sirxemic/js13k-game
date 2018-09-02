import { TheCamera } from '../globals'
import { TheCanvas, TheGraphics } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { getCellX, getCellY, forRectangularRegion } from '../utils'
import { TILE_SIZE } from '../constants';

export class EditorWorld {
  constructor () {
    this.entityGrid = {}
    this.entities = new Set()
  }

  clear () {
    this.entityGrid = {}
    this.entities = new Set()
  }

  getEntityAt (x, y) {
    return this.entityGrid[x + ';' + y]
  }

  getExtremes () {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (let key in this.entityGrid) {
      let [x, y] = key.split(';').map(Number)
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
    return {
      minX, maxX, minY, maxY
    }
  }

  addEntity (entity) {
    forRectangularRegion(
      entity.x,
      entity.y,
      entity.x + entity.width - 1,
      entity.y + entity.height - 1,
      (xi, yi) => {
        this.removeAt(xi, yi)

        this.entityGrid[xi + ';' + yi] = entity
      }
    )

    this.entities.add(entity)
  }

  forEachEntity (callback) {
    for (let entity of this.entities) {
      callback(entity)
    }
  }

  removeAt (x, y) {
    let entity = this.entityGrid[x + ';' + y]
    if (!entity) {
      return
    }

    forRectangularRegion(
      entity.x,
      entity.y,
      entity.x + entity.width - 1,
      entity.y + entity.height - 1,
      (xi, yi) => { delete this.entityGrid[xi + ';' + yi] }
    )

    this.entities.delete(entity)
  }

  setController (controller) {
    this.controller = controller
  }

  step () {
    this.controller.step()

    TheCamera.step()
  }

  render () {
    TheRenderer.clear()
    TheRenderer.drawRectangle('#888', 0, 0, TheCanvas.width, TheCanvas.height)

    TheRenderer.updateViewMatrix(100)

    let topIndex = getCellY(TheCamera.viewYToWorldY(0))
    let bottomIndex = getCellY(TheCamera.viewYToWorldY(TheCanvas.height - 1))
    let leftIndex = getCellX(TheCamera.viewXToWorldX(0))
    let rightIndex = getCellX(TheCamera.viewXToWorldX(TheCanvas.width - 1))

    this.renderGrid(topIndex, bottomIndex, leftIndex, rightIndex)

    forRectangularRegion(leftIndex, topIndex, rightIndex, bottomIndex, (x, y) => {
      let entity = this.entityGrid[x + ';' + y]
      if (entity) {
        entity.render()
      }
    })

    this.controller.render()
  }

  renderGrid (topIndex, bottomIndex, leftIndex, rightIndex) {
    TheGraphics.strokeStyle = '#777'
    TheGraphics.beginPath()
    for (let xi = leftIndex; xi <= rightIndex; xi++) {
      if (xi % 8 === 0) {
        TheGraphics.stroke()
        TheGraphics.strokeStyle = '#666'
        TheGraphics.beginPath()
      }
      TheGraphics.moveTo(xi * TILE_SIZE, topIndex * TILE_SIZE)
      TheGraphics.lineTo(xi * TILE_SIZE, (bottomIndex + 1) * TILE_SIZE)
      if (xi % 8 === 0) {
        TheGraphics.stroke()
        TheGraphics.strokeStyle = '#777'
        TheGraphics.beginPath()
      }
    }
    for (let yi = topIndex; yi <= bottomIndex; yi++) {
      if (yi % 8 === 0) {
        TheGraphics.stroke()
        TheGraphics.strokeStyle = '#666'
        TheGraphics.beginPath()
      }
      TheGraphics.moveTo(leftIndex * TILE_SIZE, yi * TILE_SIZE)
      TheGraphics.lineTo((rightIndex + 1) * TILE_SIZE, yi * TILE_SIZE)
      if (yi % 8 === 0) {
        TheGraphics.stroke()
        TheGraphics.strokeStyle = '#777'
        TheGraphics.beginPath()
      }
    }
    TheGraphics.stroke()
  }
}
