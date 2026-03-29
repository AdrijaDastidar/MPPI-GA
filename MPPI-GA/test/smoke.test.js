/**
 * Lightweight CI checks (no Jest/Vitest) — Node 18+ built-in test runner.
 */
const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

test('package.json is valid and names the app', () => {
  const raw = fs.readFileSync(path.join(root, 'package.json'), 'utf8')
  const pkg = JSON.parse(raw)
  assert.strictEqual(pkg.name, 'mppi-ga')
  assert.ok(typeof pkg.scripts?.test === 'string', 'scripts.test missing')
})

test('Vue entry and main visualizer exist', () => {
  assert.ok(fs.existsSync(path.join(root, 'src', 'main.js')))
  assert.ok(fs.existsSync(path.join(root, 'src', 'App.vue')))
  assert.ok(fs.existsSync(path.join(root, 'src', 'components', 'PathfindingVisualizer.vue')))
})
