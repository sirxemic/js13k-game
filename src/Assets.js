import _FlowersSprite from './Assets/FlowersSprite'
import _Font from './Assets/Font'
import _ParticlesSprite from './Assets/ParticlesSprite'
import _PlayerSprite from './Assets/PlayerSprite'
import _WingSprite from './Assets/WingSprite'

import createDashSound from './Audio/Samples/Dash'
import createImpactSound from './Audio/Samples/Impact'
import createJumpSound from './Audio/Samples/Jump'
import createDeathSound from './Audio/Samples/Death'
import createRebootSound from './Audio/Samples/Reboot'
import createReverbIR from './Audio/Samples/ReverbIR'
import createSong1 from './Audio/Songs/Song1'

import { TheAudioContext, setReverbDestination } from './Audio/Context'
import { waitForNextFrame } from './utils'

export let FlowersSprite
export let Font
export let ParticlesSprite
export let PlayerSprite
export let WingSprite

export let DashSound
export let ImpactSound
export let JumpSound
export let DeathSound
export let RebootSound
export let Song1

async function createAudioSampleAsset (createSampleFunction) {
  const array = createSampleFunction()
  const result = TheAudioContext.createBuffer(1, array.length, TheAudioContext.sampleRate)
  result.getChannelData(0).set(array)

  await waitForNextFrame()

  return result
}

async function createReverb () {
  const reverb = TheAudioContext.createConvolver()
  const ir = createReverbIR()
  const irBuffer = TheAudioContext.createBuffer(2, ir[0].length, TheAudioContext.sampleRate)
  irBuffer.getChannelData(0).set(ir[0])
  irBuffer.getChannelData(1).set(ir[1])

  reverb.buffer = irBuffer

  setReverbDestination(reverb)

  await waitForNextFrame()
}

function augmentWithImage (spriteObject) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      spriteObject.renderable = img
      resolve(spriteObject)
    }
    img.src = spriteObject.dataUrl
  })
}

export async function loadAssets () {
  ;[
    FlowersSprite,
    Font,
    ParticlesSprite,
    PlayerSprite,
    WingSprite
  ] = await Promise.all(
    [
      _FlowersSprite,
      _Font,
      _ParticlesSprite,
      _PlayerSprite,
      _WingSprite
    ].map(augmentWithImage)
  )

  await waitForNextFrame()

  ;[
    DashSound,
    ImpactSound,
    JumpSound,
    DeathSound,
    RebootSound
  ] = await Promise.all(
    [
      createDashSound,
      createImpactSound,
      createJumpSound,
      createDeathSound,
      createRebootSound
    ].map(createAudioSampleAsset)
  )

  createReverb()

  Song1 = await createSong1()

  document.body.classList.remove('loading')
}
