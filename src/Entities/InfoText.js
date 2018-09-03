import { TheRenderer } from '../Renderer'
import { GridEntity } from './GridEntity'
import { generateImage } from '../utils'
import { COLOR_BG_LAYER_1 } from '../constants'
import { getTextDimensions, drawText } from '../fontUtils'


function getImage (text) {
  let { width, height } = getTextDimensions(text)
  return generateImage(width + 1, height + 1, ctx => {
    ctx.fillStyle = COLOR_BG_LAYER_1
    ctx.fillRect(0, 0, width + 1, height + 1)
    drawText(ctx, text, 1, 1)
  })
}

export class InfoText extends GridEntity {
  constructor (x, y, text) {
    super(x, y)
    this.text = text
  }

  async initialize () {
    this.renderable = await getImage(this.text)
  }

  render () {
    TheRenderer.drawImage(this.renderable, this.x, this.y)
  }
}
