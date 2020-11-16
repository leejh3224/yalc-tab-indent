const fs = require('fs')
const path = require('path')
const { readPackageManifest, writePackageManifest, getIndent } = require('../src')

test('writing package manifest should preserve original indent', () => {
	const pkg = readPackageManifest()
	writePackageManifest(process.cwd(), pkg)
	const packageJson = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
	expect(getIndent(packageJson)).toBe('\t')
})
