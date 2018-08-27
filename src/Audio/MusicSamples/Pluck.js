import { generateSound, applyEnvelope, getFrequencyDelta, sampleSine, sampleNoise } from '../SoundGeneration'
import { TheAudioContext } from '../Context'

export default function createSound (frequency) {
  const delta = getFrequencyDelta(frequency)

  let p = 0
  let i = 0
  let sample
  let randomUpdatePeriod = 1 / 8000
  function getNextSample() {
    let value = (
            1 * sampleSine(p) +
            1 * sampleSine(p / 2) +
          0.1 * sampleSine(p * 2) +
        0.001 * sampleSine(p * 3) +
      0.0001 * sampleSine(p * 4)
    ) / 2.111

    sample = Math.round(5 * value) / 5

    p += delta

    i += 1 / TheAudioContext.sampleRate
    if (i >= randomUpdatePeriod) {
      p += sampleNoise() * delta * 0.6
      i -= randomUpdatePeriod
    }

    return sample
  }

  const volumeEnvelope = [
    [0, 0, 0.5],
    [0.001, 1, 0.1],
    [1, 0]
  ]

  return applyEnvelope(generateSound(3, getNextSample), volumeEnvelope)
}
