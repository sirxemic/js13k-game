import { TheCamera } from '../globals'
import { TheCanvas } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { getCellX, getCellY, forRectangularRegion } from '../utils'

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
      (xi, yi) => { this.entityGrid[xi + ';' + yi] = null }
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

    forRectangularRegion(leftIndex, topIndex, rightIndex, bottomIndex, (x, y) => {
      let entity = this.entityGrid[x + ';' + y]
      if (entity) {
        entity.render()
      }
    })

    this.controller.render()
  }
}