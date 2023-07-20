'use strict'

// import processPptx from '../process.js'
importScripts('../process.js')

processPptx(
  (messageHandler, errorHandler) => {
    self.onmessage = e => messageHandler(e.data)
    self.onerror = e => errorHandler(e)
  },
  msg => self.postMessage(msg)
)
