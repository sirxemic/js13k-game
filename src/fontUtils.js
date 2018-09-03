import { Font } from './Assets'

export function getTextDimensions (text) {
  let width = 0
  let height = 0
  let x = 0
  let y = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      x += 6
    } else if (text[i].match(/\n|#/)) {
      x = 0
      y += 6
    } else {
      x += 6
      width = Math.max(x, width)
      height = Math.max(y + 6, height)
    }
  }

  return { width, height }
}

export function drawText (ctx, text, x, y) {
  let px = x
  let py = y
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      px += 6
    } else if (text[i].match(/\n|#/)) {
      px = x
      py += 6
    } else {
      let index = text.charCodeAt(i) - 65
      ctx.drawImage(Font.renderable, index * 6, 0, 5, 5, px, py, 5, 5)
      px += 6
    }
  }
}
