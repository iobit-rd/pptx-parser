'use strict'

// import processPptx from '../process.js'
const workerUrl = new URL('../process.js', import.meta.url)
importScripts(workerUrl)

processPptx(
  (messageHandler, errorHandler) => {
    self.onmessage = e => messageHandler(e.data)
    self.onerror = e => errorHandler(e)
  },
  msg => self.postMessage(msg)
)
