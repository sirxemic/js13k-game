import { Brush } from './Brush'

function plotLine(x0, y0, x1, y1, callback) {
  let dx = x1 - x0
  let dy = y1 - y0

  if (dx === 0 && dy === 0) {
    return callback(x0, y0)
  }

  if (Math.abs(dx) < Math.abs(dy)) {
    return plotLine(y0, x0, y1, x1, (x, y) => callback(y, x))
  }

  if (dx < 0) {
    return plotLine(x1, y1, x0, y0, callback)
  }

  let D = 2 * dy - dx
  let y = y0

  for (let x = x0; x <= x1; x++) {
    callback(x, y)
    if (D > 0) {
      y = y + 1
      D = D - 2 * dx
    }
    D = D + 2 * dy
  }
}

export class LineBrush extends Brush {
  start (x, y) {
    super.start(x, y)

    this.action(x, y)
  }

  update (x, y) {
    super.update(x, y)

    // plotLine(this.prevTileX, this.prevTileY, this.currentTileX, this.currentTileY, this.action)
  }

  render () {

  }
}