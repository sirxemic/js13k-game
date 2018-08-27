import { RectangleCoverage } from './RectangleCoverage'

export function makeRectangleCollection (width, height, map) {
  return new RectangleCoverage(width, height, map).solve()
}