import {
  multiplySounds,
  getFrequencyDelta,
  applyEnvelope,
  sampleTriangle,
  sampleNoise,
  generateSound,
  sampleEnvelope,
  distort
} from '../SoundGeneration'
import { TheAudioContext } from '../Context'

export default function createSound () {
  let phase = 0
  let freqEnvelope = [
    [0, 40, 0.2],
    [1, 20]
  ]
  function getNextSineSample (bufferPosition) {
    let freq = sampleEnvelope(bufferPosition, freqEnvelope)
    phase += getFrequencyDelta(freq)
    return 40 * sampleTriangle(phase)
  }

  let val = sampleNoise()
  function getNextStaticNoiseSample() {
    if (Math.random() < 500 / TheAudioContext.sampleRate) {
      val = sampleNoise()
    }
    return val
  }

  const volumeEnvelope2 =  [
    [0, 1, 0.5],
    [1, 0]
  ]

  return multiplySounds(
    [
      generateSound(
        0.2,
        getNextSineSample
      ),

      applyEnvelope(
        distort(
          generateSound(
            0.2,
            getNextStaticNoiseSample
          ),
          3
        ),
        volumeEnvelope2
      )
    ]
  )
}
