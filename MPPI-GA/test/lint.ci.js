const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..', 'src')
const exts = new Set(['.js', '.vue'])
const banned = [/console\.log\(/, /debugger\b/]

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      walk(full, out)
    } else if (exts.has(path.extname(name))) {
      out.push(full)
    }
  }
  return out
}

const offenders = []
for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8')
  for (const rule of banned) {
    if (rule.test(text)) {
      offenders.push(`${path.relative(path.join(__dirname, '..'), file)} matches ${rule}`)
    }
  }
}

if (offenders.length) {
  console.error('Lint CI failed:')
  for (const line of offenders) console.error(`- ${line}`)
  process.exit(1)
}

console.log('Lint CI passed.')
