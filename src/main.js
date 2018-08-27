import { TheWorld, TheSceneManager, setTheSceneManager, updateFrame } from './globals'
import { Input } from './Input'
import { loadAssets } from './Assets'
import { SceneManager } from './SceneManager'

function tick () {
  requestAnimationFrame(tick)

  if (TheSceneManager.step()) {
    return
  }

  Input.preUpdate()

  step()

  Input.postUpdate()

  render()
}

function step () {
  TheWorld.step()

  updateFrame()
}

function render () {
  TheWorld.render()
}

export async function start (setup) {
  await loadAssets()

  setTheSceneManager(new SceneManager())

  await setup()

  tick()
}