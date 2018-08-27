import {
  generateSound,
  applyEnvelope,
  highPassFilter,
  sampleNoise
} from '../SoundGeneration'

export default function createSound (frequency, velocity) {
  let volumeEnvelope = [
    [0, velocity, 0.2],
    [1, 0]
  ]

  return applyEnvelope(highPassFilter(generateSound(0.4, sampleNoise), 3000), volumeEnvelope)
}
