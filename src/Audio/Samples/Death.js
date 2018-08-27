import {
  getFrequencyDelta,
  applyEnvelope,
  sampleNoise,
  generateSound,
  sampleEnvelope
} from '../SoundGeneration'

export default function createSound () {
  let val = sampleNoise()
  let t = 0
  let freqEnvelope2 = [
    [0, 2000, 0.2],
    [1, 200]
  ]
  function getNextStaticNoiseSample(bufferPosition) {
    if (t >= 1) {
      val = sampleNoise()
      t -= 1
    }
    let freq = sampleEnvelope(bufferPosition, freqEnvelope2)
    t += getFrequencyDelta(freq)
    return val
  }

  const volumeEnvelope = [
    [0, 0.5, 0.5],
    [1, 0]
  ]

  return applyEnvelope(
    generateSound(
      0.3,
      getNextStaticNoiseSample
    ),
    volumeEnvelope
  )
}
