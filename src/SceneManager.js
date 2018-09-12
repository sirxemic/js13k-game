import { LevelLoaderDefault } from './LevelLoaders/LevelLoaderDefault'

export class SceneManager {
  constructor () {
    // this.currentLoader = null // commented out to save bytes (interpret undefined as null)
    // this.nextLoader = null // commented out to save bytes (interpret undefined as null)
    // this.loading = false // commented out to save bytes (interpret undefined as false)
  }

  step () {
    if (this.nextLoader) {
      this.loading = true
      this.loadLevel(this.nextLoader)
      this.nextLoader = null
    }

    return this.loading
  }

  loadNewLevel (loader) {
    this.nextLoader = loader
  }

  loadNextLevel () {
    if (!this.nextLoader) {
      this.nextLoader = new LevelLoaderDefault(this.currentLoader.levelNumber + 1)
    }
  }

  reloadLevel () {
    this.nextLoader = this.currentLoader
  }

  async loadLevel (loader) {
    this.currentLoader = loader

    this.loading = true

    await loader.load()

    this.loading = false
  }
}
