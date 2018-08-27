
import { TheSceneManager } from './globals'
import { start } from './main'

import { Song1 } from './Assets'
import { LevelLoaderDefault } from './LevelLoaders/LevelLoaderDefault'

start(async () => {
  Song1.play()
  await TheSceneManager.loadLevel(new LevelLoaderDefault(0))
})
