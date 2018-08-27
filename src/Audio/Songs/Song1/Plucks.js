import { TheAudioContext } from '../../Context'
import {
  addNotes,
  zipRhythmAndNotes,
  offsetNotes,
  addOctave
} from '../../SongGeneration'
import createPluck from '../../MusicSamples/Pluck'

function createMainLoop (bpm) {
  const beats = 32
  const lengthInSeconds = beats / bpm * 60
  const output = new Float32Array(lengthInSeconds * TheAudioContext.sampleRate)

  const arpRhythm = [ 0, 0.75, 1.5, 2, 2.75, 3.5, 4, 4.75, 5.5, 6, 6.75, 7.5 ]

  const arp = [
    ...zipRhythmAndNotes(arpRhythm, [
      4,7,11,4,7,11, 12,11,4,12,11,4
    ]),
    ...offsetNotes(zipRhythmAndNotes(arpRhythm, [
      4,7,11,4,7,11, 12,11,4,12,11,4
    ]), 8),
    ...offsetNotes(zipRhythmAndNotes(arpRhythm, [
      4,5,12,4,5,12, 12,11,4,12,11,4
    ]), 16),
    ...offsetNotes(zipRhythmAndNotes(arpRhythm, [
      2,7,11,2,7,11, 12,11,2,12,11,2
    ]), 24)
  ]
  arp.push(
    [30.5, 14]
  )

  addNotes(arp, output, createPluck, bpm)

  return output
}

export default function createPlucksTrack (output, bpm) {
  const mainLoop = createMainLoop(bpm)

  output.set(mainLoop, 0)
  output.set(mainLoop, mainLoop.length)
  output.set(mainLoop, mainLoop.length * 2)
  output.set(mainLoop, mainLoop.length * 3)

  let melodyNotes = offsetNotes(addOctave([
    [0, 16],
    [4, 17],
    [6, 19],
    [8, 21],

    [16, 24],
    [20, 23],
    [22, 24],
    [24, 19]
  ]), 32)

  addNotes(melodyNotes, output, createPluck, bpm)
}
