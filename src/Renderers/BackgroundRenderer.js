import { COLOR_BG_LAYER_1, COLOR_BG_LAYER_2, COLOR_BG_LAYER_3 } from '../constants'
import { TheGraphics, TheCanvas } from '../Graphics'
import { TheRenderer } from '../Renderer'
import { generateImage, forRectangularRegion, randomInt } from '../utils'

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
    this.image = await generateImage(80, 80, ctx => {
      ctx.fillStyle = this.color
      ctx.beginPath()
      for (let i = 0; i < 80; i++) {
        let w = 1 + randomInt(8)
        let h = 1 + randomInt(8)
        let x = randomInt(80 - w)
        let y = randomInt(80 - h)
        ctx.rect(x, y, w, h)
      }
      ctx.fill()
    })
  }

  render () {
    let { z, image, gradient } = this

    TheRenderer.updateViewMatrix(z)

    let scale = z / 15
    let imageSize = image.width * scale

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
        image,
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
