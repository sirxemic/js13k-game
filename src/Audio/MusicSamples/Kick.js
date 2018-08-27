import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleEnvelope,
  sampleSine,
  sampleTriangle
} from '../SoundGeneration'

export default function createSound () {
  let pitchEnvelope = [
    [0, 380, 0.1],
    [0.8, 30]
  ]
  let volumeEnvelope = [
    [0, 0],
    [0.01, 1, 0.2],
    [1, 0]
  ]

  let p = 0
  let sample
  function getNextSample (bufferPosition) {
    sample = (sampleSine(p) + sampleTriangle(p)) / 2
    p += getFrequencyDelta(sampleEnvelope(bufferPosition, pitchEnvelope))
    return sample
  }

  return applyEnvelope(generateSound(0.4, getNextSample), volumeEnvelope)
}
