import { TheAudioContext } from './Context'


export function sampleSine (position) {
  return Math.sin(2 * Math.PI * position)
}

export function sampleSawtooth (position) {
  return (position % 1) * 2 - 1
}

export function sampleTriangle (position) {
  return Math.abs((position % 1) * 2 - 1) * 2 - 1
}

export function sampleSquare (position) {
  return samplePulse(position, 0.5)
}

export function samplePulse (position, length) {
  return (position % 1 < length) * 2 - 1
}

export function sampleNoise () {
  return Math.random() * 2 - 1
}

export function sampleEnvelope (position, envelope) {
  for (let i = 0; i < envelope.length - 1; i++) {
    let [t1, v1, curve = 1] = envelope[i]
    let [t2, v2] = envelope[i + 1]
    if (t1 <= position && position < t2) {
      let t = (position - t1) / (t2 - t1)
      if (curve > 1) {
        t = Math.pow(t, curve)
      } else {
        t = 1 - Math.pow((1 - t), 1 / curve)
      }
      return v1 + t * (v2 - v1)
    }
  }
  return envelope[envelope.length - 1][1]
}

function ensureEnvelope (envelopeOrValue) {
  if (typeof envelopeOrValue === 'number') {
    return [[0, envelopeOrValue], [1, envelopeOrValue]]
  }
  return envelopeOrValue
}

function coefficients (b0, b1, b2, a0, a1, a2) {
  return [
    b0 / a0,
    b1 / a0,
    b2 / a0,
    a1 / a0,
    a2 / a0
  ]
}

function getHighPassCoefficients (frequency, Q) {
  let n = Math.tan(Math.PI * frequency / TheAudioContext.sampleRate)
  let nSquared = n * n
  let invQ = 1 / Q
  let c1 = 1 / (1 + invQ * n + nSquared)

  return coefficients(
    c1, c1 * -2,
    c1, 1,
    c1 * 2 * (nSquared - 1),
    c1 * (1 - invQ * n + nSquared)
  )
}

function getLowPassCoefficients (frequency, Q) {
  let n = 1 / Math.tan(Math.PI * frequency / TheAudioContext.sampleRate)
  let nSquared = n * n
  let invQ = 1 / Q
  let c1 = 1 / (1 + invQ * n + nSquared)

  return coefficients(
    c1, c1 * 2,
    c1, 1,
    c1 * 2 * (1 - nSquared),
    c1 * (1 - invQ * n + nSquared)
  )
}

function getBandPassCoefficients (frequency, Q) {
  let n = 1 / Math.tan(Math.PI * frequency / TheAudioContext.sampleRate)
  let nSquared = n * n
  let invQ = 1 / Q
  let c1 = 1 / (1 + invQ * n + nSquared)

  return coefficients(
    c1 * n * invQ, 0,
    -c1 * n * invQ, 1,
    c1 * 2 * (1 - nSquared),
    c1 * (1 - invQ * n + nSquared)
  )
}

function filter (buffer, coeffFunction, frequencies, Qs) {
  let lv1 = 0
  let lv2 = 0

  for (let i = 0; i < buffer.length; ++i) {
    let freq = sampleEnvelope(i / (buffer.length - 1), frequencies)
    let Q = sampleEnvelope(i / (buffer.length - 1), Qs)
    let coeffs = coeffFunction(freq, Q)

    let inV = buffer[i]
    let outV = (inV * coeffs[0]) + lv1
    buffer[i] = outV

    lv1 = (inV * coeffs[1]) - (outV * coeffs[3]) + lv2
    lv2 = (inV * coeffs[2]) - (outV * coeffs[4])
  }

  return buffer
}

export function lowPassFilter (buffer, frequencies, Q = Math.SQRT1_2) {
  return filter(buffer, getLowPassCoefficients, ensureEnvelope(frequencies), ensureEnvelope(Q))
}

export function highPassFilter (buffer, frequencies, Q = Math.SQRT1_2) {
  return filter(buffer, getHighPassCoefficients, ensureEnvelope(frequencies), ensureEnvelope(Q))
}

export function bandPassFilter (buffer, frequencies, Q = Math.SQRT1_2) {
  return filter(buffer, getBandPassCoefficients, ensureEnvelope(frequencies), ensureEnvelope(Q))
}

export function distort (buffer, amount) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] *= amount
    if (buffer[i] < -1) buffer[i] = -1
    else if (buffer[i] > 1) buffer[i] = 1
    else buffer[i] = Math.sin(buffer[i] * Math.PI / 2)
    buffer[i] /= amount
  }
  return buffer
}

function combineSounds (buffers, func) {
  let maxLength = 0
  buffers.forEach(buffer => { maxLength = Math.max(maxLength, buffer.length) })

  const outputBuffer = new Float32Array(maxLength)

  buffers.forEach((buffer, j) => {
    for (let i = 0; i < buffer.length; i++) {
      func(outputBuffer, j, buffer, i, buffers.length)
    }
  })

  return outputBuffer
}

export function sumSounds (buffers) {
  return combineSounds(buffers, (data, bufferIndex, bufferData, sampleIndex, bufferCount) => {
    data[sampleIndex] += bufferData[sampleIndex] / bufferCount
  })
}

export function multiplySounds (buffers) {
  return combineSounds(buffers, (data, bufferIndex, bufferData, sampleIndex, bufferCount) => {
    if (bufferIndex === 0) {
      data[sampleIndex] = 1
    }
    data[sampleIndex] *= bufferData[sampleIndex] / bufferCount
  })
}

export function generateSound (length, sampleFunction) {
  const buffer = new Float32Array(length * TheAudioContext.sampleRate)

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = sampleFunction(i / buffer.length, i / TheAudioContext.sampleRate)
  }

  return buffer
}

export function applyEnvelope (buffer, envelope) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] *= sampleEnvelope(i / buffer.length, envelope)
  }

  return buffer
}

export function getFrequencyDelta (freq) {
  return freq / TheAudioContext.sampleRate
}
