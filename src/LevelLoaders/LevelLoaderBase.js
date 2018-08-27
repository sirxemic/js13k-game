import { TheWorld, setTheWorld, setTheCamera } from '../globals'
import { World } from '../World'
import { Camera } from '../Camera'

export class LevelLoaderBase {
  async load () {
    setTheWorld(new World())
    setTheCamera(new Camera())

    this.generate()

    await TheWorld.initRenderers()
  }
}