import { TheWorld, TheCamera, TheSceneManager, TheEditorLevel } from '../globals'
import { TheGraphics } from '../Graphics'

import { LineBrush } from './Brushes/LineBrush'
import { RectangleBrush } from './Brushes/RectangleBrush'

import { PlayerStart } from './Entities/PlayerStart'
import { EditorSolidTile } from './Entities/EditorSolidTile'
import { EditorHurtTile } from './Entities/EditorHurtTile'
import { EditorMovingPlatform } from './Entities/EditorMovingPlatform'
import { Input } from '../Input'
import {
  JUMP_OR_DASH,

  ENTITY_SERIALIZE_ID_SOLID_TILE,
  ENTITY_SERIALIZE_ID_HURT_TILE,
  ENTITY_SERIALIZE_ID_PLAYER_START,
  ENTITY_SERIALIZE_ID_MOVING_PLATFORM,
  ENTITY_SERIALIZE_ID_GOAL,
  ENTITY_SERIALIZE_ID_TEXT,
  ENTITY_SERIALIZE_ID_CHECKPOINT
} from '../constants'
import { LevelLoaderEditorPlayable } from './LevelLoaderEditorPlayable'
import { LevelSerializer } from './LevelSerializer'
import { EditorGoal } from './Entities/EditorGoal'
import { EditorText } from './Entities/EditorText'

import { levels } from '../Assets/levels'
import { forRectangularRegion } from '../utils'
import { EditorCheckpoint } from './Entities/EditorCheckpoint'

const DRAW_SOLID = 1
const DRAW_DEATH = 2
const DRAW_PLAYER = 3
const DRAW_MOVING_PLATFORM = 4
const DRAW_GOAL = 5
const DRAW_TEXT = 6
const DRAW_CHECKPOINT = 7

function copyToClipboard (str) {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export class EditorController {
  constructor () {
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    this.mode = DRAW_SOLID
  }

  init (levelNumber) {
    if (this.inited) {
      return
    }

    TheCamera.addMouseListener(this)

    this.playerInstance = new PlayerStart(0, 0)
    TheWorld.addEntity(this.playerInstance)

    this.inited = true

    this.loadLevel(levelNumber)
  }

  loadLevel (levelNumber) {
    const { maps, entities } = levels[levelNumber]

    TheWorld.clear()

    for (let key in maps) {
      let entityType = {
        [ENTITY_SERIALIZE_ID_SOLID_TILE]: EditorSolidTile,
        [ENTITY_SERIALIZE_ID_HURT_TILE]: EditorHurtTile
      }[key]
      maps[key].forEach(([x0, y0, w, h]) => {
        forRectangularRegion(x0, y0, x0 + w - 1, y0 + h - 1, (xi, yi) => TheWorld.addEntity(new entityType(xi, yi)))
      })

      TheCamera.setBoundaries(TheWorld.getExtremes())
    }

    entities.forEach(entity => {
      switch (entity[0]) {
        case ENTITY_SERIALIZE_ID_PLAYER_START:
          this.setPlayerPosition(entity[1], entity[2])
          break
        case ENTITY_SERIALIZE_ID_GOAL:
          TheWorld.addEntity(new EditorGoal(entity[1], entity[2]))
          break
        case ENTITY_SERIALIZE_ID_MOVING_PLATFORM:
          TheWorld.addEntity(new EditorMovingPlatform(entity[1], entity[2], entity[3], entity[4], entity[5]))
          break
        case ENTITY_SERIALIZE_ID_TEXT:
          TheWorld.addEntity(new EditorText(entity[1], entity[2], entity[3]))
          break
        case ENTITY_SERIALIZE_ID_CHECKPOINT:
          TheWorld.addEntity(new EditorCheckpoint(entity[1], entity[2]))
          break
      }
    })
  }

  drawSolid (x, y) {
    TheWorld.addEntity(new EditorSolidTile(x, y))
  }

  drawHurtTile (x, y) {
    TheWorld.addEntity(new EditorHurtTile(x, y))
  }

  drawMovingPlatform (x, y, width, height, direction) {
    TheWorld.addEntity(new EditorMovingPlatform(x, y, width, height, direction))
  }

  drawGoal (x, y) {
    TheWorld.addEntity(new EditorGoal(x, y))
  }

  drawInfoText (x, y) {
    let text = prompt('Text?')
    text = text.toUpperCase()
      .replace(/!/g, '[')
      .replace(/\./g, '\\')
      .replace(/,/g, ']')
      .replace(/[^A-Z\\[\] \n#]/g, '')

    if (text.length === 0) {
      return
    }

    TheWorld.addEntity(new EditorText(x, y, text))
  }

  drawSolidRectangle (x0, y0, x1, y1) {
    forRectangularRegion(x0, y0, x1, y1, (x, y) => this.drawSolid(x, y))
  }

  drawHurtRectangle (x0, y0, x1, y1) {
    forRectangularRegion(x0, y0, x1, y1, (x, y) => this.drawHurtTile(x, y))
  }

  eraseRectangle (x0, y0, x1, y1) {
    forRectangularRegion(x0, y0, x1, y1, (x, y) => this.eraseAt(x, y))
  }

  eraseAt (x, y) {
    TheWorld.removeAt(x, y)
  }

  setPlayerPosition (x, y) {
    if (TheWorld.getEntityAt(this.playerInstance.x, this.playerInstance.y) === this.playerInstance) {
      TheWorld.removeAt(this.playerInstance.x, this.playerInstance.y)
    }

    this.playerInstance.x = x
    this.playerInstance.y = y

    TheWorld.addEntity(this.playerInstance)
  }

  addOrUpdateMovingPlatform (x0, y0, x1, y1) {
    if (x0 === x1 && y0 === y1) {
      let entity = TheWorld.getEntityAt(x0, y0)
      if (entity instanceof EditorMovingPlatform) {
        entity.direction *= -1
        return
      }
    }

    TheWorld.addEntity(new EditorMovingPlatform(x0, y0, x1 - x0 + 1, y1 - y0 + 1, 1))
  }

  addCheckpoint (x, y) {
    TheWorld.addEntity(new EditorCheckpoint(x, y))
  }

  handleKeyDown (event) {
    switch (event.key) {
      case '1':
        this.mode = DRAW_SOLID
        break
      case '2':
        this.mode = DRAW_DEATH
        break
      case '3':
        this.mode = DRAW_MOVING_PLATFORM
        break
      case '4':
        this.mode = DRAW_GOAL
        break
      case '5':
        this.mode = DRAW_PLAYER
        break
      case '6':
        this.mode = DRAW_TEXT
        break
      case '7':
        this.mode = DRAW_CHECKPOINT
        break
      case 'c':
        if (event.ctrlKey) {
          event.preventDefault()

          const serializer = new LevelSerializer()
          copyToClipboard(serializer.serialize())
        }
        break
      case '0':
        this.loadLevel(Number(prompt('Level number')))
        break
      case 'Escape':
        TheSceneManager.loadNewLevel(TheEditorLevel)
        break
    }
  }

  handleMouseDown (event) {
    if (event.rightDown) {
      this.currentBrush = new RectangleBrush(this.eraseRectangle.bind(this))
    } else {
      switch (this.mode) {
        case DRAW_SOLID:
          this.currentBrush = new RectangleBrush(this.drawSolidRectangle.bind(this))
          break
        case DRAW_DEATH:
          this.currentBrush = new RectangleBrush(this.drawHurtRectangle.bind(this))
          break
        case DRAW_PLAYER:
          this.currentBrush = new LineBrush(this.setPlayerPosition.bind(this))
          break
        case DRAW_GOAL:
          this.currentBrush = new LineBrush(this.drawGoal.bind(this))
          break
        case DRAW_MOVING_PLATFORM:
          this.currentBrush = new RectangleBrush(this.addOrUpdateMovingPlatform.bind(this))
          break
        case DRAW_TEXT:
          this.currentBrush = new LineBrush(this.drawInfoText.bind(this))
          break
        case DRAW_CHECKPOINT:
          this.currentBrush = new LineBrush(this.addCheckpoint.bind(this))
          break
      }
    }
    this.currentBrush.start(event.tileX, event.tileY)
  }

  handleMouseMove (event) {
    if (this.currentBrush && this.currentBrush.drawing) {
      this.currentBrush.update(event.tileX, event.tileY)
    }
  }

  handleMouseUp () {
    if (this.currentBrush && this.currentBrush.drawing) {
      this.currentBrush.end()
      this.currentBrush = null
    }

    TheCamera.setBoundaries(TheWorld.getExtremes())
  }

  step () {
    if (Input.getKeyDown(JUMP_OR_DASH)) {
      TheSceneManager.loadNewLevel(new LevelLoaderEditorPlayable(TheWorld))
    }
  }

  render () {
    if (this.currentBrush && this.currentBrush.drawing) {
      this.currentBrush.render()
    }

    TheGraphics.save()
    TheGraphics.setTransform(1, 0, 0, 1, 0, 0)
    let mode = {
      [DRAW_SOLID]: 'solid rectangle',
      [DRAW_DEATH]: 'hurt rectangle',
      [DRAW_PLAYER]: 'player',
      [DRAW_GOAL]: 'goal',
      [DRAW_MOVING_PLATFORM]: 'moving platform',
      [DRAW_TEXT]: 'text',
      [DRAW_CHECKPOINT]: 'checkpoint',
    }[this.mode]
    let text = 'Current mode: ' + mode
    TheGraphics.font = '32px sans-serif'
    TheGraphics.fillStyle = '#000'
    TheGraphics.fillText(text, 2, 34)
    TheGraphics.fillStyle = '#fff'
    TheGraphics.fillText(text, 0, 32)
    TheGraphics.restore()
  }
}
