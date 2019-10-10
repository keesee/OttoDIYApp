
import Bluetooth from 'App/Services/Bluetooth'

import Config from './Config'

const STOP = 'stop'

const DELAY = 600 // Delay between commands

const sounds = [
  {key: '1', name: 'Beep'},
  {key: '2', name: 'Bye'},
  {key: '3', name: 'Surprise'},
  {key: '4', name: 'OhOoh'},
  {key: '6', name: 'Cuddly'},
  {key: '7', name: 'Sleeping'},
  {key: '8', name: 'Happy'},
  {key: '9', name: 'Super Happy'},
  {key: '11', name: 'Sad'},
  {key: '12', name: 'Confused'},
  {key: '14', name: 'Fart'}
]

const cmdFromTouch = (touch) => {
  if (touch.dy <= -40) {
    return 'M 1' // up
  } else if (touch.dy >= 40) {
    return 'M 2' // down
  } else if (touch.dx >= 40) {
    return 'M 4' // right
  } else if (touch.dx <= -40) {
    return 'M 3' // left
  } else {
    return 'M 0'
  }
}

const cmdFromInstruction = (instruction) => {
  if (instruction === 'up') {
    return 'M 1' // up
  } else if (instruction === 'down') {
    return 'M 2' // down
  } else if (instruction === 'right') {
    return 'M 4' // right
  } else if (instruction === 'left') {
    return 'M 3' // left
  } else if (instruction === STOP) {
    return 'M 0' // stop
  } else if (instruction === 'updown') {
    return 'M 5' // updown
  } else if (instruction === 'moonwalkright') {
    return 'M 6' // moonwalkright
  } else if (instruction === 'moonwalkleft') {
    return 'M 7' // moonwalkleft
  } else if (instruction === 'swing') {
    return 'M 8' // swing
  } else if (instruction === 'crossright') {
    return 'M 9' // crossright
  } else if (instruction === 'crossleft') {
    return 'M 10' // crossleft
  } else if (instruction === 'flapfront') {
    return 'M 12' // flapfront
  } else if (instruction === 'flapback') {
    return 'M 13' // flapback
  } else if (instruction === 'tiptoe') {
    return 'M 14' // tiptoe
  } else if (instruction === 'bendright') {
    return 'M 15' // bendright
  } else if (instruction === 'bendleft') {
    return 'M 16' // bendleft
  } else if (instruction === 'shakeright') {
    return 'M 17' // shakeright
  } else if (instruction === 'shakeleft') {
    return 'M 18' // shakeleft
  } else if (instruction === 'jitter') {
    return 'M 19' // jitter
  } else if (instruction === 'ascend') {
    return 'M 20' // ascend
  } else {
    return instruction
  }
}

export default class Otto {
  lastCmdSent = null
  speed = 1000

  getConfig = () => {
    return Config
  }

  getSounds = () => {
    return sounds
  }

  setSpeed = async (speed) => {
    if (speed === 'medium') {
      this.speed = 1000
    } else if (speed === 'slow') {
      this.speed = 1500
    } else if (speed === 'fast') {
      this.speed = 500
    }
  }

  stop = async (delay) => {
    if (!delay) {
      const cmd = cmdFromInstruction(STOP)
      return Bluetooth.write(cmd)
    }
    setTimeout(() => { this.stop() }, delay)
  }

  play = async (sound) => {
    return Bluetooth.write('K ' + sound.key)
  }

  move = (touch) => {
    const cmd = cmdFromTouch(touch) + ' ' + this.speed
    if (!this.lastCmdSent || this.lastCmdSent !== cmd) {
      Bluetooth.write(cmd)
      this.lastCmdSent = cmd
    }
  }

  moveAndStop = (touch) => {
    this.move(touch)
    this.stop(DELAY)
  }

  doSkill = (cmd, stopAtEnd) => {
    Bluetooth.write(cmd)
    this.stop(DELAY)
  }

  run = (instructions, stopAtEnd = true) => {
    let delay = 0
    if (stopAtEnd) {
      // Always finish with stop if stopAtEnd is true
      instructions.push(STOP)
    }
    instructions.forEach((instruction) => {
      setTimeout(() => {
        const cmd = (
          instruction === 'up' || instruction === 'down' ||
          instruction === 'right' || instruction === 'left')
          ? cmdFromInstruction(instruction) + ' ' + this.speed
          : cmdFromInstruction(instruction)
        Bluetooth.write(cmd)
      }, delay)
      delay += DELAY
    })
  }
}
