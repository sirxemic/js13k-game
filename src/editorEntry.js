import { TheSceneManager } from './globals'
import { start } from './main'
import { LevelLoaderEditor } from './Editor/LevelLoaderEditor'

start(async () => {
  await TheSceneManager.loadLevel(new LevelLoaderEditor(0))
})
