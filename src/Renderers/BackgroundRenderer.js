import { COLOR_BG_LAYER_1, COLOR_BG_LAYER_2, COLOR_BG_LAYER_3 } from '../constants'
import { TheGraphics, TheCanvas } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { generateImage, forRectangularRegion, randomInt } from '../utils'

const IMAGE_SIZE = 80

class Layer {
  constructor (z, color) {
    this.z = z
    this.color = color

    const gradient = TheGraphics.createRadialGradient(
      TheCanvas.width / 2,
      TheCanvas.height / 2,
      400,
      TheCanvas.width / 2,
      TheCanvas.height / 2,
      1100
    )

    gradient.addColorStop(0, color + '00')
    gradient.addColorStop(1, color)

    this.gradient = gradient
  }

  async prerender () {
    this.renderable = await generateImage(IMAGE_SIZE, IMAGE_SIZE, ctx => {
      ctx.fillStyle = this.color
      ctx.beginPath()
      for (let i = 0; i < IMAGE_SIZE; i++) {
        let w = 1 + randomInt(8)
        let h = 1 + randomInt(8)
        let x = randomInt(IMAGE_SIZE - w)
        let y = randomInt(IMAGE_SIZE - h)
        ctx.rect(x, y, w, h)
      }
      ctx.fill()
    })
  }

  render () {
    let { z, renderable, gradient } = this

    TheRenderer.updateViewMatrix(z)

    let scale = z / 15
    let imageSize = IMAGE_SIZE * scale

    let bgLeft = -TheRenderer.viewMatrix[4] / TheRenderer.viewMatrix[0]
    let bgRight = TheCanvas.width / TheRenderer.viewMatrix[0] - TheRenderer.viewMatrix[4] / TheRenderer.viewMatrix[0]
    let bgTop = -TheRenderer.viewMatrix[5] / TheRenderer.viewMatrix[3]
    let bgBottom = TheCanvas.height / TheRenderer.viewMatrix[3] - TheRenderer.viewMatrix[5] / TheRenderer.viewMatrix[3]

    let xStart = Math.floor(bgLeft / imageSize)
    let xEnd = Math.floor(bgRight / imageSize)
    let yStart = Math.floor(bgTop / imageSize)
    let yEnd = Math.floor(bgBottom / imageSize)

    forRectangularRegion(xStart, yStart, xEnd, yEnd, (xi, yi) => {
      TheRenderer.drawImage(
        renderable,
        xi * imageSize,
        yi * imageSize,
        imageSize,
        imageSize
      )
    })

    TheGraphics.setTransform(1, 0, 0, 1, 0, 0)

    TheRenderer.drawRectangle(gradient, 0, 0, TheCanvas.width, TheCanvas.height)
  }
}

export class BackgroundRenderer {
  async prerender () {
    this.layers = [
      new Layer(900, COLOR_BG_LAYER_2),
      new Layer(300, COLOR_BG_LAYER_3)
    ]

    await Promise.all(this.layers.map(layer => layer.prerender()))
  }

  render () {
    TheRenderer.drawRectangle(COLOR_BG_LAYER_1, 0, 0, TheCanvas.width, TheCanvas.height)

    for (let layer of this.layers) {
      layer.render()
    }
  }
}
