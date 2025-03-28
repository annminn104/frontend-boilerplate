const fs = require('node:fs')
const path = require('node:path')

const initCwd = process.env.INIT_CWD

if (initCwd) {
  const filePath = path.join(initCwd, 'lint-staged.config.js')
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `module.exports = require('@fe-boilerplate/lint-staged-config');`)
  }
} else {
  console.error('INIT_CWD environment variable is not defined')
}
