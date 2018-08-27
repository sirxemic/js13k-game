import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleEnvelope,
  highPassFilter,
  sumSounds,
  bandPassFilter,
  sampleSine,
  sampleNoise
} from '../SoundGeneration'

export default function createSound () {
  let pitchEnvelope = [
    [0, 400, 0.07],
    [1, 80]
  ]
  let volumeEnvelope = [
    [0, 1, 0.2],
    [1, 0]
  ]

  let phase = 0
  let sample
  function getBodySample (bufferPosition) {
    sample = sampleSine(phase)
    phase += getFrequencyDelta(sampleEnvelope(bufferPosition, pitchEnvelope))
    return sample
  }

  let body = generateSound(0.4, getBodySample)
  let noise = bandPassFilter(generateSound(0.4, sampleNoise), 3000, 1)

  return highPassFilter(applyEnvelope(sumSounds([body, noise]), volumeEnvelope), 400)
}
