export let deltaTime = 1 / 60

export let TheSceneManager
export let TheWorld
export let ThePlayer
export let TheCamera
export let TheEditorLevel
export let TheColorScheme = {
  bg1: null,
  bg2: null,
  bg3: null,
  fg: null
}

export let frame = 0

export function setTheSceneManager (sceneManager) {
  TheSceneManager = sceneManager
}

export function setTheWorld (world) {
  TheWorld = world
}

export function setThePlayer (player) {
  ThePlayer = player
}

export function setTheCamera (camera) {
  TheCamera = camera
}

export function setTheEditorLevel (level) {
  TheEditorLevel = level
}

export function setColorScheme (levelNumber) {
  let hue = (240 + levelNumber * 70) % 360

  let makeColor = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`

  TheColorScheme.bg1 = makeColor(hue, 0, 93)
  hue += 20
  TheColorScheme.bg2 = makeColor(hue, 1, 70)
  hue += 20
  TheColorScheme.bg3 = makeColor(hue, 5, 49)
  hue += 20
  TheColorScheme.fg = makeColor(hue, 21, 17)
}

export function updateFrame () {
  frame++
}
