import { TheCanvas } from '../Graphics'
import { TheCamera } from '../globals'
import { TheRenderer } from '../Renderer'
import { generateImage, forRectangularRegion } from '../utils'

const CHUNK_PIXEL_SIZE = 480
const CHUNK_TILE_COUNT = CHUNK_PIXEL_SIZE / 8

function getChunkCoord (x) {
  return Math.floor(x / 8 / CHUNK_TILE_COUNT)
}

export class TileRenderer {
  constructor (tiles) {
    this.chunks = {}
    this.tiles = tiles
  }

  async prerender () {
    this.tiles.forEachTile((tile, x, y) => {
      let chunkX = Math.floor(x / CHUNK_TILE_COUNT)
      let chunkY = Math.floor(y / CHUNK_TILE_COUNT)
      let chunkKey = chunkX + ';' + chunkY
      this.chunks[chunkKey] = this.chunks[chunkKey] || {
        x: chunkX,
        y: chunkY,
        tiles: []
      }
      this.chunks[chunkKey].tiles.push(tile)
    })

    await Promise.all(Object.values(this.chunks).map(chunk => this.prerenderChunk(chunk)))
  }

  async prerenderChunk (chunk) {
    chunk.renderable = await generateImage(CHUNK_TILE_COUNT * 8, CHUNK_TILE_COUNT * 8, ctx => {
      ctx.translate(-chunk.x * CHUNK_PIXEL_SIZE, -chunk.y * CHUNK_PIXEL_SIZE)

      chunk.tiles.forEach(tile => tile.render(this.tiles, ctx))
    })
  }

  render () {
    let topIndex = getChunkCoord(TheCamera.viewYToWorldY(0))
    let bottomIndex = getChunkCoord(TheCamera.viewYToWorldY(TheCanvas.height - 1))
    let leftIndex = getChunkCoord(TheCamera.viewXToWorldX(0))
    let rightIndex = getChunkCoord(TheCamera.viewXToWorldX(TheCanvas.width - 1))

    forRectangularRegion(leftIndex, topIndex, rightIndex, bottomIndex, (xi, yi) => {
      let chunk = this.chunks[`${xi};${yi}`]
      if (chunk) {
        let x = xi * 8 * CHUNK_TILE_COUNT
        let y = yi * 8 * CHUNK_TILE_COUNT
        TheRenderer.drawImage(chunk.renderable, x, y)
      }
    })
  }
}
