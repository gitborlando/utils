import { execFileSync } from 'node:child_process'

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

function readPackageJson(objectName) {
  return JSON.parse(git(['show', objectName]))
}

function hasHead() {
  try {
    git(['rev-parse', '--verify', 'HEAD'])
    return true
  } catch {
    return false
  }
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

if (!hasHead()) {
  process.exit(0)
}

let headPackage
let stagedPackage

try {
  headPackage = readPackageJson('HEAD:package.json')
} catch {
  fail('Cannot read package.json from HEAD.')
}

try {
  stagedPackage = readPackageJson(':package.json')
} catch {
  fail('Cannot read staged package.json. Make sure package.json is staged.')
}

if (!headPackage.version || !stagedPackage.version) {
  fail('package.json must contain a version field.')
}

if (headPackage.version === stagedPackage.version) {
  fail(
    `package.json version must change before commit. Current version: ${headPackage.version}`,
  )
}
