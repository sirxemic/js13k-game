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
  gamepad: null,

  isPressed (button) {
    return Input.gamepad.buttons[button].pressed
  },

  getKey (input) {
    return !!Input.current[input]
  },

  getKeyDown (input) {
    return !!Input.current[input] && !Input.previous[input]
  },

  getKeyUp (input) {
    return !Input.current[input] && !!Input.previous[input]
  },

  preUpdate () {
    if (Input.gamepad) {

      Input.current[LEFT_DIRECTION] = Input.gamepad.axes[0] < -0.3 || Input.isPressed(14)
      Input.current[RIGHT_DIRECTION] = Input.gamepad.axes[0] > 0.3 || Input.isPressed(15)
      Input.current[UP_DIRECTION] = Input.gamepad.axes[1] < -0.3 || Input.isPressed(12)
      Input.current[DOWN_DIRECTION] = Input.gamepad.axes[1] > 0.3 || Input.isPressed(13)
      Input.current[BOOST_TOGGLE] = (
        Input.isPressed(2) ||
        Input.isPressed(3) ||
        Input.isPressed(4) ||
        Input.isPressed(5) ||
        Input.isPressed(6) ||
        Input.isPressed(7)
      )
      Input.current[JUMP_OR_DASH] = Input.isPressed(0) || Input.isPressed(1)
    }
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

window.addEventListener('gamepadconnected', event => {
  if (!Input.gamepad) {
    // Closure Compiler would rename the property if we don't set it like this
    window.gamepad = Input.gamepad = event['gamepad']
  }
})
