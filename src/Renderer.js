import { TheCamera } from './globals'
import { TheCanvas, TheGraphics } from './Graphics'
import { FONT } from './Assets/sprites'

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
        obj.image,
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

  drawText (text, x, y) {
    let x0 = x
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        x += 6
      } else if (text[i].match(/\n|#/)) {
        x = x0
        y += 6
      } else {
        let index = text.charCodeAt(i) - 65
        TheRenderer.drawImage(FONT.image, index * 6, 0, 5, 5, x, y, 5, 5)
        x += 6
      }
    }
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
