import { applyEnvelope, generateSound, sampleNoise } from '../SoundGeneration'

export default function createSound () {
  const e = 1e-7
  const delayDuration = 3/16
  function createDelayPattern (isLeft) {
    let t = 0
    let result = []
    do {
      result.push([t, isLeft ? 1 : .45])

      isLeft = !isLeft
      t += delayDuration

      result.push([t - e, 0])
    } while (t <= 1)

    return result
  }
  const volumeEnvelope1 = createDelayPattern(true)
  const volumeEnvelope2 = createDelayPattern(false)

  const globalEnvelope = [
    [0, 0, 0.5],
    [0.05, 1, 0.5],
    [1, 0]
  ]

  return [
    applyEnvelope(applyEnvelope(generateSound(4, sampleNoise), volumeEnvelope1), globalEnvelope),
    applyEnvelope(applyEnvelope(generateSound(4, sampleNoise), volumeEnvelope2), globalEnvelope)
  ]
}
