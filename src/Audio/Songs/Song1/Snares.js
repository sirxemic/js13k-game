import {
  addNotes,
  offsetNotes,
  repeatNotes
} from '../../SongGeneration'
import createSnare from '../../MusicSamples/Snare'

export default function createSnareTrack (output, bpm) {
  let melodyNotes = offsetNotes(repeatNotes([[1], [3], [5], [7], [7.75]], 8, 8), 64)

  addNotes(melodyNotes, output, createSnare, bpm)
}
