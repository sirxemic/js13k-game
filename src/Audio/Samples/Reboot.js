import { generateSound, applyEnvelope, sampleEnvelope, getFrequencyDelta, sampleTriangle, sampleSawtooth } from '../SoundGeneration'

export default function createSound () {
  let phase = 0
  let freqEnvelope = [
    [0, 440, 0.2],
    [1, 2200]
  ]
  function getNextSineSample (bufferPosition) {
    let freq = sampleEnvelope(bufferPosition, freqEnvelope)
    phase += getFrequencyDelta(freq)
    return (sampleTriangle(phase) + sampleSawtooth(phase)) / 2
  }
  const volumeEnvelope = [
    [0, 0, 0.5],
    [0.1, 1, 0.5],
    [1, 0]
  ]

  return (
    applyEnvelope(generateSound(0.5, getNextSineSample), volumeEnvelope)
  )
}
