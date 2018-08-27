import { setTheCamera, setTheWorld, setThePlayer, setTheEditorLevel } from '../globals'
import { EditorWorld } from './EditorWorld'
import { EditorCamera } from './EditorCamera'
import { EditorController } from './EditorController'

export class LevelLoaderEditor {
  constructor (levelNumber) {
    this.levelNumber = levelNumber

    setTheEditorLevel(this)

    this.loaded = false
  }

  async load () {
    if (!this.loaded) {
      this.world = new EditorWorld()
      this.camera = new EditorCamera()
      this.controller = new EditorController()
      this.world.setController(this.controller)

      this.loaded = true
    }

    setTheWorld(this.world)
    setTheCamera(this.camera)
    setThePlayer(null)

    this.controller.init(this.levelNumber)
  }
}