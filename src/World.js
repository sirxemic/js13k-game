import { TAG_IS_SOLID, TAG_IS_DEATH, TAG_IS_COLLECTIBLE, BACKGROUND_LAYER, MAIN_LAYER, FOREGROUND_LAYER } from './constants'
import { ThePlayer, setThePlayer, TheCamera } from './globals'
import { overlapping, getCellX, getCellY } from './utils'

import { Player } from './Entities/Player'
import { Tileset } from './Entities/Tileset'
import { Fade } from './Entities/Fade'

import { TheGraphics } from './Graphics'
import { TheRenderer } from './Renderer'
import { TileRenderer } from './Renderers/TileRenderer'
import { BackgroundRenderer } from './Renderers/BackgroundRenderer'

export class World {
  constructor () {
    this.tiles = new Tileset()
    this.solidEntities = new Set()

    this.layers = {
      [BACKGROUND_LAYER]: new Set(),
      [MAIN_LAYER]: new Set(),
      [FOREGROUND_LAYER]: new Set()
    }

    this.guiEntities = new Set()

    this.entities = new Set()

    this.tileRenderer = new TileRenderer(this.tiles)
    this.bgRenderer = new BackgroundRenderer()

    this.addGuiEntity(new Fade('#fff', 1))
  }

  async initEntities () {
    await this.bgRenderer.prerender()
    await this.tileRenderer.prerender()

    for (let entity of this.entities) {
      if (entity.initialize) {
        await entity.initialize()
      }
    }
  }

  updateDimensions () {
    this.width = 0
    this.height = 0
    this.tiles.forEachTile(tile => {
      this.width = Math.max(this.width, tile.x * 8)
      this.height = Math.max(this.height, tile.y * 8)
    })
  }

  setPlayer (player) {
    setThePlayer(player)

    this.playerSpawnX = player.startX
    this.playerSpawnY = player.startY
  }

  respawnPlayer () {
    for (let entity of this.entities) {
      if (entity.reset) {
        entity.reset()
      }
    }
    setThePlayer(new Player(this.playerSpawnX, this.playerSpawnY))
  }

  /**
   * Entities
   */
  addEntity (entity, layer = MAIN_LAYER) {
    this.layers[layer].add(entity)
    this.entities.add(entity)
    entity.__layer = layer
  }

  removeEntity (entity) {
    this.entities.delete(entity)
    this.layers[entity.__layer].delete(entity)
  }

  /**
   * Solids
   */
  addSolidEntity (entity) {
    this.solidEntities.add(entity)
    this.addEntity(entity)
  }

  removeSolidEntity (entity) {
    this.solidEntities.delete(entity)
    this.removeEntity(entity)
  }

  /**
   * Tiles
   */
  addTile (tile) {
    this.tiles.addTile(tile)
  }

  /**
   * GUI
   */
  addGuiEntity (entity) {
    this.guiEntities.add(entity)
  }

  removeGuiEntity (entity) {
    this.guiEntities.delete(entity)
  }

  /**
   * Querying the world
   */
  collideAt (x, y, width, height, { tags = TAG_IS_SOLID | TAG_IS_DEATH | TAG_IS_COLLECTIBLE, ignore = null } = {}) {
    if (tags & TAG_IS_SOLID) {
      let result = this.solidAt(x, y, width, height, { ignore })
      if (result) {
        return result
      }
    }

    let left = getCellX(x)
    let top = getCellY(y)
    let right = getCellX(x + width - 1)
    let bottom = getCellY(y + height - 1)

    for (let ix = left; ix <= right; ix++) {
      for (let iy = top; iy <= bottom; iy++) {
        let tile = this.tiles.getTileAt(ix, iy, tags)
        if (tile) {
          return tile
        }
      }
    }

    return null
  }

  solidAt (x, y, width, height, { ignore = null } = {}) {
    let left = getCellX(x)
    let top = getCellY(y)
    let right = getCellX(x + width - 1)
    let bottom = getCellY(y + height - 1)

    for (let ix = left; ix <= right; ix++) {
      for (let iy = top; iy <= bottom; iy++) {
        let tile = this.tiles.getTileAt(ix, iy, TAG_IS_SOLID)
        if (tile) {
          return tile
        }
      }
    }

    for (let solidEntity of this.solidEntities) {
      if (solidEntity === ignore || !solidEntity.collidable) {
        continue
      }

      if (overlapping({ x, y, width, height }, solidEntity)) {
        return solidEntity
      }
    }

    return null
  }

  step () {
    if (this.delay) {
      this.delay--
      return
    }

    for (let entity of this.entities) {
      entity.step()
    }

    ThePlayer && ThePlayer.step()

    for (let entity of this.guiEntities) {
      entity.step()
    }

    TheCamera.step()
  }

  render () {
    TheRenderer.clear()

    this.bgRenderer.render()

    // Background layer
    TheRenderer.updateViewMatrix(BACKGROUND_LAYER)

    for (let entity of this.layers[BACKGROUND_LAYER]) {
      entity.render()
    }

    // Main layer
    TheRenderer.updateViewMatrix(MAIN_LAYER)

    this.tileRenderer.render()

    for (let entity of this.layers[MAIN_LAYER]) {
      entity.render()
    }

    ThePlayer && ThePlayer.render()

    // Foreground layer
    TheRenderer.updateViewMatrix(FOREGROUND_LAYER)

    for (let entity of this.layers[FOREGROUND_LAYER]) {
      entity.render()
    }

    // Foreground / UI effects
    TheGraphics.setTransform(1, 0, 0, 1, 0, 0)
    for (let entity of this.guiEntities) {
      entity.render()
    }
  }
}
