export let deltaTime = 1 / 60

export let TheSceneManager
export let TheWorld
export let ThePlayer
export let TheCamera
export let TheEditorLevel

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

export function updateFrame () {
  frame++
}
