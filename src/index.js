import createCanvas from './util/create-canvas'
import chunkString from './util/chunk-string'
import getCanvasImageData from './util/get-canvas-image-data'

function verifyStrategy (strategy) {
  if (!strategy) throw Error('No strategy provided!')

  if (!strategy.encode || typeof strategy.encode !== 'function') throw Error('Strategy lacks encode method!')
  if (!strategy.decode || typeof strategy.decode !== 'function') throw Error('Strategy lacks decode method!')
  if (!strategy.canStoreMessage || typeof strategy.canStoreMessage !== 'function') throw Error('Strategy lacks canStoreMessage method!')
}

export default function steganogre (strategy, canvas = createCanvas()) {
  verifyStrategy(strategy)

  return {
    _strategy () {
      return strategy
    },
    _canvas () {
      return canvas
    },

    canStoreMessage (message) {
      return strategy.canStoreMessage(
        getCanvasImageData(canvas),
        message
      )
    },

    encode (message) {
      const msgChunks = chunkString(message)

      if (this.canStoreMessage(message)) {
        return this._strategy().encode(msgChunks)
      }
    }
  }
}
