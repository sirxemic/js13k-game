import {
  addNotes,
  offsetNotes,
  repeatNotes
} from '../../SongGeneration'
import createHiHat from '../../MusicSamples/HiHat'

export default function createHiHatTrack (output, bpm) {
  let notes = offsetNotes(repeatNotes([[0, 0, 0.25], [0.5, 0, 1]], 1, 64), 64)

  notes = [...notes, ...offsetNotes(repeatNotes([[14.25, 0, 0.5], [15.25, 0, 0.5]], 16, 4), 64)]

  addNotes(notes, output, createHiHat, bpm)
}
