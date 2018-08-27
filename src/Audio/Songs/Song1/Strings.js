import {
  addNotes,
  offsetNotes
} from '../../SongGeneration'
import createStrings from '../../MusicSamples/Strings'

export default function createStringsTrack (output, bpm) {
  const f = 60 / bpm
  let melodyNotes = offsetNotes([
    [0, -8, 4 * f],
    [4, -7, 2 * f],
    [6, -5, 2 * f],
    [8, -3, 4 * f],
    [12, -1, 2 * f],
    [14, 0, 2 * f],
    [16, 0, 4 * f],
    [20, -1, 2 * f],
    [22, 0, 2 * f],
    [24, 2, 3 * f],
    [27, 0, 1 * f],
    [28, -1, 4 * f]
  ], 64).concat(offsetNotes([
    [0, 0, 4 * f],
    [0, 4, 4 * f],
    [4, -1, 2 * f],
    [4, 2, 2 * f],
    [6, -3, 2 * f],
    [6, 0, 2 * f],
    [8, -3, 4 * f],
    [8, 0, 4 * f],
    [12, -3, 2 * f],
    [12, 0, 2 * f],
    [14, -5, 2 * f],
    [14, -1, 2 * f],
    [16, -7, 4 * f],
    [16, -3, 4 * f],
    [20, -5, 2 * f],
    [20, -1, 2 * f],
    [22, -3, 2 * f],
    [22, 0, 2 * f],
    [24, -5, 4 * f],
    [24, 0, 4 * f],
    [28, -5, 4 * f],
    [28, -1, 4 * f]
  ], 96))

  addNotes(melodyNotes, output, createStrings, bpm)
}
