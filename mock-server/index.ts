if (typeof window !== 'undefined') {
  console.log('starting msw browser')
  const { worker } = require('./browser')
  worker.start()
}

export {}
