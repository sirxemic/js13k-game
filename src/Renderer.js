import { TheCamera } from './globals'
import { TheCanvas, TheGraphics } from './Graphics'

let drawCalls = 0
export function resetDrawCallCount () {
  drawCalls = 0
}

export function incrementDrawCallCount () {
  drawCalls++
}

export function printDrawCallCount () {
  console.log(drawCalls)
}

export const TheRenderer = {
  viewMatrix: [1, 0, 0, 1, 0, 0],

  clear () {
    TheGraphics.setTransform(1, 0, 0, 1, 0, 0)
    resetDrawCallCount()
  },

  updateViewMatrix (z) {
    let scale = TheCamera.scale * 100 / z

    TheRenderer.viewMatrix[0] = scale
    TheRenderer.viewMatrix[3] = scale
    TheRenderer.viewMatrix[4] = TheCanvas.width / 2 - TheCamera.x * scale
    TheRenderer.viewMatrix[5] = TheCanvas.height / 2 - TheCamera.y * scale

    TheGraphics.setTransform(...TheRenderer.viewMatrix)
  },

  setAlpha (alpha) {
    TheGraphics.globalAlpha = alpha
  },

  resetAlpha () {
    TheGraphics.globalAlpha = 1
  },

  drawImage (...args) {
    incrementDrawCallCount()
    TheGraphics.drawImage(...args)
  },

  drawRectangle (fill, x, y, w, h) {
    incrementDrawCallCount()
    TheGraphics.fillStyle = fill
    TheGraphics.fillRect(x, y, w, h)
  },

  drawCircle (fill, stroke, x, y, radius) {
    TheGraphics.beginPath()
    TheGraphics.arc(x, y, radius, 0, Math.PI * 2)
    if (fill) {
      TheGraphics.fillStyle = fill
      TheGraphics.fill()
    }
    if (stroke) {
      TheGraphics.strokeStyle = stroke
      TheGraphics.stroke()
    }
  },

  drawSprite (obj, x, y, index = 0, scaleX = 1, scaleY = 1, rotation = 0) {
    TheRenderer.drawAt(x, y, () => {
      TheGraphics.rotate(rotation)
      TheGraphics.scale(scaleX, scaleY)

      const frame = obj.frames[index]

      TheRenderer.drawImage(
        obj.renderable,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        -frame.oX,
        -frame.oY,
        frame.w,
        frame.h
      )
    })
  },

  drawAt (x, y, callback) {
    TheGraphics.save()

    TheGraphics.translate(x, y)

    callback()

    TheGraphics.restore()
  },

  postProcessing () {
    // printDrawCallCount()
  }
}
