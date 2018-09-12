import {
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
  UP_DIRECTION,
  DOWN_DIRECTION,
  BOOST_TOGGLE,
  JUMP_OR_DASH
} from './constants'

export let Input = {
  current: {},
  previous: {},

  getKey (input) {
    return !!Input.current[input]
  },

  getKeyDown (input) {
    return !!Input.current[input] && !Input.previous[input]
  },

  getKeyUp (input) {
    return !Input.current[input] && !!Input.previous[input]
  },

  postUpdate () {
    [
      LEFT_DIRECTION,
      RIGHT_DIRECTION,
      UP_DIRECTION,
      DOWN_DIRECTION,
      BOOST_TOGGLE,
      JUMP_OR_DASH
    ].forEach(key => {
      Input.previous[key] = Input.current[key]
    })
  }
}

let inputKeyMapping = {
  37: LEFT_DIRECTION,
  39: RIGHT_DIRECTION,
  38: UP_DIRECTION,
  40: DOWN_DIRECTION,
  16: BOOST_TOGGLE,
  90: JUMP_OR_DASH,
  32: JUMP_OR_DASH
}

document.addEventListener('keydown', ({ keyCode }) => {
  let input = inputKeyMapping[keyCode]
  if (!input) {
    return
  }
  Input.previous[input] = Input.current[input]
  Input.current[input] = true
}, false)

document.addEventListener('keyup', ({ keyCode }) => {
  let input = inputKeyMapping[keyCode]
  if (!input) {
    return
  }
  Input.previous[input] = Input.current[input]
  Input.current[input] = false
}, false)
