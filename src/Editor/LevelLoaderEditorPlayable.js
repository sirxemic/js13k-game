import { TheWorld } from '../globals'
import { LevelLoaderBase } from '../LevelLoaders/LevelLoaderBase'

import { PlayerStart } from './Entities/PlayerStart'
import { EditorSolidTile } from './Entities/EditorSolidTile'
import { EditorHurtTile } from './Entities/EditorHurtTile'
import { EditorMovingPlatform } from './Entities/EditorMovingPlatform'
import { EditorGoal } from './Entities/EditorGoal'
import { EditorText } from './Entities/EditorText'
import { EditorCheckpoint } from './Entities/EditorCheckpoint'

import { Player } from '../Entities/Player'
import { SolidTile } from '../Entities/SolidTile'
import { HurtTile } from '../Entities/HurtTile'
import { MovingPlatform } from '../Entities/MovingPlatform'
import { Goal } from '../Entities/Goal'
import { InfoText } from '../Entities/InfoText'
import { Checkpoint } from '../Entities/Checkpoint'
import { BACKGROUND_LAYER, FOREGROUND_LAYER } from '../constants'
import { MainTitle } from '../Entities/MainTitle'
import { FinishAnimation } from '../Entities/FinishAnimation'
import { levels } from '../Assets/levels'

export class LevelLoaderEditorPlayable extends LevelLoaderBase {
  constructor (editorWorld) {
    super()

    this.editorWorld = editorWorld
  }

  generate () {
    let minX = Infinity
    let minY = Infinity
    this.editorWorld.forEachEntity(entity => {
      minX = Math.min(entity.x, minX)
      minY = Math.min(entity.y, minY)
    })

    this.editorWorld.forEachEntity(entity => {
      let x = entity.x - minX
      let y = entity.y - minY
      if (entity instanceof PlayerStart) {
        TheWorld.setPlayer(new Player(x, y))
      }
      if (entity instanceof EditorSolidTile) {
        TheWorld.addTile(new SolidTile(x, y))
      }
      if (entity instanceof EditorHurtTile) {
        TheWorld.addTile(new HurtTile(x, y))
      }
      if (entity instanceof EditorMovingPlatform) {
        TheWorld.addSolidEntity(new MovingPlatform(x, y, entity.width, entity.height, entity.direction))
      }
      if (entity instanceof EditorGoal) {
        TheWorld.addEntity(new Goal(x, y))
      }
      if (entity instanceof EditorText) {
        TheWorld.addEntity(new InfoText(x, y, entity.text), BACKGROUND_LAYER)
      }
      if (entity instanceof EditorCheckpoint) {
        TheWorld.addEntity(new Checkpoint(x, y))
      }
    })

    if (this.editorWorld.levelNumber === 0) {
      TheWorld.addEntity(new MainTitle(), FOREGROUND_LAYER)
    }

    if (this.editorWorld.levelNumber === levels.length - 1) {
      TheWorld.addEntity(new FinishAnimation(true))
    }

    TheWorld.updateDimensions()
  }
}
