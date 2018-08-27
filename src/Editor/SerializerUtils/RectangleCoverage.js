import {
  approach,
  forRectangularRegion
} from '../../utils'

export class RectangleCoverage {
  constructor (width, height, map) {
    this.width = width
    this.height = height
    this.map = { ...map }

    this.result = []
  }

  at (x, y) {
    return this.map[x + ';' + y] || 0
  }

  set (x, y, value) {
    this.map[x + ';' + y] = value
  }

  solve () {
    // pass 1 - only check rectangles at top-left corners
    for (let direction of [1, -1]) {
      this.setDirection(direction)

      let xStart = this.xEnd === -1 ? this.width - 1 : 0
      let yStart = this.yEnd === -1 ? this.height - 1 : 0

      for (let y = yStart; y != this.yEnd; y = approach(y, this.yEnd, 1)) {
        for (let x = xStart; x != this.xEnd; x = approach(x, this.xEnd, 1)) {
          if (this.at(x, y) === 1 && this.at(x - direction, y) === 0 && this.at(x, y - direction) === 0) {
            this.processLargestRectangleAt(x, y)
          }
        }
      }
    }

    // pass 2 - just check anything that's 1
    this.setDirection(1)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.at(x, y) === 1) {
          this.processLargestRectangleAt(x, y)
        }
      }
    }

    return this.result
  }

  setDirection (direction) {
    this.direction = direction

    this.xEnd = direction === 1 ? this.width : -1
    this.yEnd = direction === 1 ? this.height : -1
  }

  processLargestRectangleAt (x, y) {
    let biggestArea = 0
    let finalX0, finalX1, finalY0, finalY1
    for (let otherX = x; otherX != this.xEnd; otherX = approach(otherX, this.xEnd, 1)) {
      if (this.at(otherX, y) === 0) {
        break
      }

      let x0 = Math.min(otherX, x)
      let x1 = Math.max(otherX, x)

      let [y0, y1] = this.getBestY0Y1(x0, x1, y)
      let currentArea = this.getAreaOfUnprocessedCells(x0, y0, x1, y1)
      if (currentArea > biggestArea) {
        biggestArea = currentArea
        finalX0 = x0
        finalY0 = y0
        finalX1 = x1
        finalY1 = y1
      }
    }

    // Add the rectangle to the results
    this.result.push([
      finalX0,
      finalY0,
      finalX1 - finalX0 + 1,
      finalY1 - finalY0 + 1
    ])

    // Mark the rectangular region as processed
    forRectangularRegion(
      finalX0,
      finalY0,
      finalX1,
      finalY1,
      (xi, yi) => {
        this.set(xi, yi, 2)
      }
    )
  }

  getBestY0Y1 (x0, x1, yStart) {
    let currentY0 = yStart
    let currentY1 = yStart

    for (let yi = yStart; yi != this.yEnd; yi = approach(yi, this.yEnd, 1)) {
      for (let xi = x0; xi <= x1; xi++) {
        if (this.at(xi, yi) === 0)
          return [currentY0, currentY1]
      }
      currentY0 = Math.min(yStart, yi)
      currentY1 = Math.max(yStart, yi)
    }

    return [currentY0, currentY1]
  }

  getAreaOfUnprocessedCells (x0, y0, x1, y1) {
    let result = 0
    forRectangularRegion(x0, y0, x1, y1, (xi, yi) => {
      if (this.at(xi, yi) === 1) {
        result++
      }
    })
    return result
  }
}
