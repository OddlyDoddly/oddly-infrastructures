import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

/**
 * Test setup file
 * 
 * Global test configuration and cleanup.
 */

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Extend Vitest matchers with jest-dom
expect.extend({})
