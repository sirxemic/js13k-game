import { allSprites } from './Assets/sprites'

import createDashSound from './Audio/Samples/Dash'
import createImpactSound from './Audio/Samples/Impact'
import createJumpSound from './Audio/Samples/Jump'
import createDeathSound from './Audio/Samples/Death'
import createRebootSound from './Audio/Samples/Reboot'
import createReverbIR from './Audio/Samples/ReverbIR'
import createSong1 from './Audio/Songs/Song1'

import { TheAudioContext, setReverbDestination } from './Audio/Context'
import { showProgress } from './utils'

export let DashSound
export let ImpactSound
export let JumpSound
export let DeathSound
export let RebootSound
export let Song1

function float32ArrayToAudioBuffer (arr) {
  const result = TheAudioContext.createBuffer(1, arr.length, TheAudioContext.sampleRate)
  result.getChannelData(0).set(arr)
  return result
}

function createReverb () {
  const reverb = TheAudioContext.createConvolver()
  const ir = createReverbIR()
  const irBuffer = TheAudioContext.createBuffer(2, ir[0].length, TheAudioContext.sampleRate)
  irBuffer.getChannelData(0).set(ir[0])
  irBuffer.getChannelData(1).set(ir[1])

  reverb.buffer = irBuffer

  setReverbDestination(reverb)
}

export async function loadAssets () {
  await Promise.all(allSprites.map((spriteObject) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        spriteObject.image = img
        resolve()
      }
      img.src = spriteObject.dataUrl
    })
  }))

  await showProgress('Generating sound samples...')
  DashSound = float32ArrayToAudioBuffer(createDashSound())
  await showProgress()
  ImpactSound = float32ArrayToAudioBuffer(createImpactSound())
  await showProgress()
  JumpSound = float32ArrayToAudioBuffer(createJumpSound())
  await showProgress()
  DeathSound = float32ArrayToAudioBuffer(createDeathSound())
  await showProgress()
  RebootSound = float32ArrayToAudioBuffer(createRebootSound())
  await showProgress()
  createReverb()
  await showProgress('Generating music...')
  Song1 = await createSong1()
  await showProgress('Done!')

  document.body.classList.remove('loading')
}
