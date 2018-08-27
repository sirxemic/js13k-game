import {
  addNotes,
  offsetNotes,
  repeatNotes
} from '../../SongGeneration'
import createKick from '../../MusicSamples/Kick'

export default function createKickTrack (output, bpm) {
  let melodyNotes = offsetNotes(repeatNotes([[0], [2.5], [4], [5.5], [6.5]], 8, 8), 64)

  addNotes(melodyNotes, output, createKick, bpm)
}
