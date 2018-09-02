import { TheWorld } from '../globals'
import {
  ENTITY_SERIALIZE_ID_SOLID_TILE,
  ENTITY_SERIALIZE_ID_HURT_TILE,
  ENTITY_SERIALIZE_ID_PLAYER_START,
  ENTITY_SERIALIZE_ID_MOVING_PLATFORM,
  ENTITY_SERIALIZE_ID_GOAL,
  ENTITY_SERIALIZE_ID_TEXT,
  ENTITY_SERIALIZE_ID_CHECKPOINT
} from '../constants'

import { makeRectangleCollection } from './SerializerUtils'

import { EditorSolidTile } from './Entities/EditorSolidTile'
import { EditorHurtTile } from './Entities/EditorHurtTile'
import { PlayerStart } from './Entities/PlayerStart'
import { EditorMovingPlatform } from './Entities/EditorMovingPlatform'
import { EditorGoal } from './Entities/EditorGoal'
import { EditorText } from './Entities/EditorText'
import { EditorCheckpoint } from './Entities/EditorCheckpoint';

export class LevelSerializer {
  constructor () {}

  serialize () {
    let { minX, maxX, minY, maxY } = TheWorld.getExtremes()

    let width = maxX - minX + 1
    let height = maxY - minY + 1

    let maps = {
      [ENTITY_SERIALIZE_ID_SOLID_TILE]: {},
      [ENTITY_SERIALIZE_ID_HURT_TILE]: {}
    }
    let entities = []

    TheWorld.forEachEntity(entity => {
      let x = entity.x - minX
      let y = entity.y - minY
      if (entity instanceof EditorSolidTile) {
        maps[ENTITY_SERIALIZE_ID_SOLID_TILE][x + ';' + y] = 1
      }
      if (entity instanceof EditorHurtTile) {
        maps[ENTITY_SERIALIZE_ID_HURT_TILE][x + ';' + y] = 1
      }
      if (entity instanceof PlayerStart) {
        entities.push([ENTITY_SERIALIZE_ID_PLAYER_START, x, y])
      }
      if (entity instanceof EditorMovingPlatform) {
        entities.push([ENTITY_SERIALIZE_ID_MOVING_PLATFORM, x, y, entity.width, entity.height, entity.xSpeed, entity.ySpeed])
      }
      if (entity instanceof EditorGoal) {
        entities.push([ENTITY_SERIALIZE_ID_GOAL, x, y])
      }
      if (entity instanceof EditorText) {
        entities.push([ENTITY_SERIALIZE_ID_TEXT, x, y, entity.text])
      }
      if (entity instanceof EditorCheckpoint) {
        entities.push([ENTITY_SERIALIZE_ID_CHECKPOINT, x, y])
      }
    })

    for (let key in maps) {
      maps[key] = makeRectangleCollection(width, height, maps[key])

      // Sort lexically for better compression
      maps[key].sort()
    }

    // Sort lexically for better compression
    entities.sort()

    return JSON.stringify({
      maps,
      entities
    })
  }
}
