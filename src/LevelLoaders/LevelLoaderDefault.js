import { TheWorld, ThePlayer } from '../globals'
import {
  ENTITY_SERIALIZE_ID_SOLID_TILE,
  ENTITY_SERIALIZE_ID_HURT_TILE,
  ENTITY_SERIALIZE_ID_PLAYER_START,
  ENTITY_SERIALIZE_ID_MOVING_PLATFORM,
  ENTITY_SERIALIZE_ID_GOAL,
  ENTITY_SERIALIZE_ID_TEXT,
  GAME_TITLE,
  FOREGROUND_LAYER,
  BACKGROUND_LAYER,
  ENTITY_SERIALIZE_ID_CHECKPOINT
} from '../constants'
import { forRectangularRegion } from '../utils'

import { LevelLoaderBase } from './LevelLoaderBase'

import { Player } from '../Entities/Player'
import { SolidTile } from '../Entities/SolidTile'
import { HurtTile } from '../Entities/HurtTile'
import { MovingPlatform } from '../Entities/MovingPlatform'
import { Goal } from '../Entities/Goal'
import { InfoText } from '../Entities/InfoText'
import { FinishAnimation } from '../Entities/FinishAnimation'

import { levels } from '../Assets/levels'
import { MainTitle } from '../Entities/MainTitle';
import { Checkpoint } from '../Entities/Checkpoint';

export class LevelLoaderDefault extends LevelLoaderBase {
  constructor (levelNumber) {
    super()
    this.levelNumber = levelNumber
  }

  generate () {
    const levelData = levels[this.levelNumber]

    const maps = levelData['maps']
    const entities = levelData['entities']

    TheWorld.isFinalLevel = this.levelNumber === levels.length - 1
    if (TheWorld.isFinalLevel) {
      TheWorld.addEntity(new FinishAnimation())
    }

    for (let key in maps) {
      let entityType = {
        [ENTITY_SERIALIZE_ID_SOLID_TILE]: SolidTile,
        [ENTITY_SERIALIZE_ID_HURT_TILE]: HurtTile
      }[key]
      maps[key].forEach(([x, y, w, h]) => {
        forRectangularRegion(x, y, x + w - 1, y + h - 1, (xi, yi) => TheWorld.addTile(new entityType(xi, yi)))
      })
    }

    entities.forEach(entity => {
      switch (entity[0]) {
        case ENTITY_SERIALIZE_ID_PLAYER_START:
          TheWorld.setPlayer(new Player(entity[1], entity[2]))
          break
        case ENTITY_SERIALIZE_ID_MOVING_PLATFORM:
          TheWorld.addSolidEntity(new MovingPlatform(entity[1], entity[2], entity[3], entity[4], entity[5]))
          break
        case ENTITY_SERIALIZE_ID_GOAL:
          TheWorld.addEntity(new Goal(entity[1], entity[2]))
          break
        case ENTITY_SERIALIZE_ID_TEXT:
          TheWorld.addEntity(new InfoText(entity[1], entity[2], entity[3]), BACKGROUND_LAYER)
          break
        case ENTITY_SERIALIZE_ID_CHECKPOINT:
          TheWorld.addEntity(new Checkpoint(entity[1], entity[2]))
          break
      }
    })

    if (this.levelNumber === 0) {
      TheWorld.addEntity(new MainTitle(), FOREGROUND_LAYER)
    }

    TheWorld.updateDimensions()
  }
}
