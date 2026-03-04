import '@testing-library/jest-dom'

// Stub crypto.randomUUID globally for jsdom
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2),
  },
})
