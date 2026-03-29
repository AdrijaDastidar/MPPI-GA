const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const dist = path.join(root, 'dist')

test('dist output exists', () => {
  assert.ok(fs.existsSync(dist), 'dist directory missing')
  assert.ok(fs.existsSync(path.join(dist, 'index.html')), 'dist/index.html missing')
})

test('dist index uses GitHub Pages base path', () => {
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  assert.ok(html.includes('/MPPI-GA/'), 'dist index does not contain /MPPI-GA/ base path')
})
