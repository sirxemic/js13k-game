import { TheAudioContext } from '../../Context'
import {
  addNotes,
  zipRhythmAndNotes,
  offsetNotes,
  repeatNotes
} from '../../SongGeneration'
import createPluck from '../../MusicSamples/Pluck'

function createMainLoop (bpm) {
  const beats = 32
  const lengthInSeconds = beats / bpm * 60
  const output = new Float32Array(lengthInSeconds * TheAudioContext.sampleRate)

  const bassRhythm = [ 0.5, 1.25 ]

  const bassPattern1 = zipRhythmAndNotes(bassRhythm, [ -12, -12 ])
  const bassPattern2 = zipRhythmAndNotes(bassRhythm, [ -15, -15 ])
  const bassPattern3 = zipRhythmAndNotes(bassRhythm, [ -19, -19 ])
  const bassPattern4 = zipRhythmAndNotes(bassRhythm, [ -17, -17 ])

  const pluckNotes = [
    ...repeatNotes(bassPattern1, 2, 4),
    ...offsetNotes(repeatNotes(bassPattern2, 2, 4), 8),
    ...offsetNotes(repeatNotes(bassPattern3, 2, 4), 16),
    ...offsetNotes(repeatNotes(bassPattern4, 2, 4), 24)
  ]

  addNotes(pluckNotes, output, createPluck, bpm)

  return output
}

export default function createPlucksTrack (output, bpm) {
  const mainLoop = createMainLoop(bpm)

  output.set(mainLoop, 0)
  output.set(mainLoop, mainLoop.length)
  output.set(mainLoop, mainLoop.length * 2)
  output.set(mainLoop, mainLoop.length * 3)
}
