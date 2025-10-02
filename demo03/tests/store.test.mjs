import assert from 'assert'

// Provide a minimal in-memory localStorage mock for Node
globalThis.localStorage = (function () {
  let _store = Object.create(null)
  return {
    getItem(key) { return Object.prototype.hasOwnProperty.call(_store, key) ? _store[key] : null },
    setItem(key, value) { _store[key] = String(value) },
    removeItem(key) { delete _store[key] },
    _dump() { return _store }
  }
})()

import { load, save, clear } from '../todo-app/js/store.js'

// ensure clean
clear()
assert.deepStrictEqual(load(), [], 'load after clear should be empty array')

const items = [{ id: 't1', title: 'Test 1' }]
const ok = save(items)
assert.strictEqual(ok, true, 'save should return true')
const loaded = load()
assert.strictEqual(Array.isArray(loaded), true, 'loaded should be an array')
assert.strictEqual(loaded.length, 1, 'loaded length should be 1')
assert.strictEqual(loaded[0].title, 'Test 1')

clear()
assert.deepStrictEqual(load(), [], 'after clear load should be empty')

console.log('✅ store tests passed')
