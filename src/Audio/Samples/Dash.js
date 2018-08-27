import { sumSounds, applyEnvelope, highPassFilter, bandPassFilter, sampleNoise, generateSound, sampleEnvelope } from '../SoundGeneration'
import { TheAudioContext } from '../Context'

export default function createSound () {
  const probabilityEnvelope = [
    [0, 0.01, 2],
    [1, 0]
  ]
  const volumeEnvelope = [
    [0, 0],
    [0.1, 1, 0.8],
    [0.2, 0.3, 0.9],
    [1, 0]
  ]

  let val = sampleNoise()

  function getNextSample1() {
    if (Math.random() < 5000 / TheAudioContext.sampleRate) {
      val = sampleNoise()
    }
    return val
  }

  function getNextSample2(bufferPosition) {
    if (Math.random() < sampleEnvelope(bufferPosition, probabilityEnvelope)) {
      val = sampleNoise()
    }
    return val
  }

  return applyEnvelope(
    sumSounds(
      [
        highPassFilter(
          generateSound(0.3, getNextSample1),
          900
        ),
        bandPassFilter(
          generateSound(0.3, getNextSample2),
          100
        )
      ]
    ),
    volumeEnvelope
  )
}
