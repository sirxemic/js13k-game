function makeFramesFromTiles(width, height, tileWidth, tileHeight) {
  let frames = []
  for (let y = 0; y < height; y += tileHeight) {
    for (let x = 0; x < width; x += tileWidth) {
      frames.push({
        x: x,
        y: y,
        w: tileWidth,
        h: tileHeight,
        oX: 0, oY: 0
      })
    }
  }
  return frames
}

export let allSprites = []

function addSprite (sprite) {
  allSprites.push(sprite)
  return sprite
}

export let PLAYER_SPRITE = addSprite({
  name: 'player.gif',
  frames: [
    { x: 1, y: 0, w: 8, h: 13, oX: 4, oY: 13 },
    { x: 10, y: 0, w: 9, h: 13, oX: 5, oY: 13 },
    { x: 21, y: 0, w: 8, h: 13, oX: 4, oY: 13 },
    { x: 30, y: 0, w: 10, h: 13, oX: 5, oY: 13 },
    { x: 40, y: 0, w: 10, h: 13, oX: 5, oY: 13 },
    { x: 50, y: 0, w: 10, h: 13, oX: 5, oY: 13 },
    { x: 60, y: 0, w: 10, h: 13, oX: 5, oY: 13 }
  ]
})

export let WING_SPRITE = addSprite({
  name: 'wing.gif',
  frames: [
    { x: 0, y: 0, w: 12, h: 10, oX: 11, oY: 9 }
  ]
})

export let PARTICLES_SPRITE = addSprite({
  name: 'particles.gif',
  frames: makeFramesFromTiles(32, 3, 4, 3)
})

export let FONT = addSprite({
  name: 'font.gif',
  frames: [
    { x: 0, y: 0, w: 77, h: 11, oX: 0, oY: 0 }
  ]
})

export let FLOWERS = addSprite({
  name: 'flowers.gif',
  frames: [
    { x: 0, y: 0, w: 13, h: 13, oX: 11, oY: 11 },
    { x: 14, y: 0, w: 13, h: 9, oX: 7, oY: 1 },
    { x: 28, y: 0, w: 16, h: 15, oX: 9, oY: 8 },
    { x: 17, y: 10, w: 11, h: 9, oX: 10, oY: 8 },
    { x: 0, y: 15, w: 16, h: 13, oX: 6, oY: 12 },
    { x: 16, y: 20, w: 12, h: 8, oX: 2, oY: 7 },
    { x: 29, y: 16, w: 15, h: 12, oX: 8, oY: 6 }
  ]
})