export class FSM {
  constructor (fsm, initialState) {
    this.fsm = fsm
    this.activeState = initialState
  }

  setState (name, ...params) {
    this.fsm[this.activeState].leave && this.fsm[this.activeState].leave(this)

    this.activeState = name

    this.fsm[this.activeState].enter && this.fsm[this.activeState].enter(...params)
  }

  step () {
    this.fsm[this.activeState].execute && this.fsm[this.activeState].execute(this)
  }
}
