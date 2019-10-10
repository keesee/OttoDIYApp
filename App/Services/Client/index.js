
import Bluetooth from 'App/Services/Bluetooth'
import WebSocket from 'App/Services/WebSocket'

import Simulator from './Simulator'
import Otto from './Otto'

const simulator = new Simulator()
const otto = new Otto()

const isConnectedToSocket = () => {
  return WebSocket.getInstance().isConnected
}

const isConnectedToBluetooth = async () => {
  return Bluetooth.isConnected()
}

export const isConnected = async () => {
  return isConnectedToSocket() || isConnectedToBluetooth()
}

export default class Client {
  getClient = async () => {
    if (isConnectedToSocket()) {
      return simulator
    } else if (await isConnectedToBluetooth()) {
      return otto
    }
    return null
  }

  getConfig = async () => {
    const client = await this.getClient()
    return (client) ? client.getConfig() : null
  }

  getSounds = async () => {
    const client = await this.getClient()
    return (client) ? client.getSounds() : []
  }

  setSpeed = async (speed) => {
    const client = await this.getClient()
    if (client) {
      client.setSpeed(speed)
    }
  }

  stop = async (delay) => {
    const client = await this.getClient()
    if (client) {
      client.stop(delay)
    }
  }

  play = async (sound) => {
    const client = await this.getClient()
    if (client) {
      client.play(sound)
    }
  }

  move = async (touch) => {
    const client = await this.getClient()
    if (client) {
      client.move(touch)
    }
  }

  moveAndStop = async (touch) => {
    const client = await this.getClient()
    if (client) {
      client.moveAndStop(touch)
    }
  }

  doSkill = async (cmd, stopAtEnd) => {
    const client = await this.getClient()
    if (client) {
      client.doSkill(cmd, stopAtEnd)
    }
  }

  run = async (instructions, stopAtEnd = true) => {
    const client = await this.getClient()
    if (client) {
      client.run(instructions, stopAtEnd)
    }
  }
}
