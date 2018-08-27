import {
  generateSound,
  sampleEnvelope,
  applyEnvelope,
  getFrequencyDelta,
  lowPassFilter
} from '../SoundGeneration'

export default function createSound (frequency, length) {
  const attack = 0.1
  const release = 0.2
  length += release
  const delta = getFrequencyDelta(frequency)

  const waveForm = [
    [0, -0.5, 2],
    [0.1, 1, 2],
    [1, -1]
  ]

  function getSample (t) {
    return sampleEnvelope(t % 1, waveForm)
  }

  let p = 0
  let detune1 = 1.01
  let detune2 = 1 / 1.01
  function getNextSample () {
    let sample = getSample(p) / 2
    sample += getSample(p * detune1) / 3
    sample += getSample(p * detune2) / 6
    p += delta
    return sample
  }

  const volumeEnvelope = [
    [0, 0],
    [attack / length, 1],
    [(length - release) / length, 0.5],
    [1, 0]
  ]

  const filterFreqEnvelope = [
    [0, 200, 0.5],
    [attack / length, 2000, 0.5],
    [(length - release) / length, 1000, 0.5],
    [1, 200]
  ]

  return lowPassFilter(
    applyEnvelope(
      generateSound(length, getNextSample),
      volumeEnvelope
    ),
    filterFreqEnvelope
  )
}
