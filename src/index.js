const detectIndent = require('detect-indent')
const path = require('path')
const fs = require('fs')

const getJSONSpaces = (jsonStr) => {
	let match = jsonStr.match(/^[^{]*{.*\n([ ]+?)\S/)
	return match && match[1] ? match[1].length : null
}

const getIndent = (jsonStr) => {
	return detectIndent(jsonStr).indent
}

function readPackageManifest(workingDir = process.cwd()) {
	let pkg
	const packagePath = path.join(workingDir, 'package.json')
	try {
		const fileData = fs.readFileSync(packagePath, 'utf-8')
		pkg = JSON.parse(fileData)
	  	if (!pkg.name && pkg.version) {
			console.log(
			'Package manifest',
			packagePath,
			'should contain name and version.'
			)
			return null
	 	}
	  	const indent = getIndent(fileData) || '  '
	  	pkg.__Indent = indent
	  	return pkg
	} catch (e) {
	  	console.error('Could not read', e)
	  	return null
	}
}

const sortDependencies = (dependencies) => {
	return Object.keys(dependencies)
	  .sort()
	  .reduce(
		(deps, key) => Object.assign(deps, { [key]: dependencies[key] }),
		{}
	  )
}

function writePackageManifest(workingDir, pkg) {
	pkg = Object.assign({}, pkg)
	if (pkg.dependencies) {
	  pkg.dependencies = sortDependencies(pkg.dependencies)
	}
	if (pkg.devDependencies) {
	  pkg.devDependencies = sortDependencies(pkg.devDependencies)
	}
	const indent = pkg.__Indent
	delete pkg.__Indent
	const packagePath = path.join(workingDir, 'package.json')
	try {
	  fs.writeFileSync(
		packagePath,
		JSON.stringify(pkg, null, indent) + '\n'
	  )
	} catch (e) {
	  console.error('Could not write ', packagePath)
	}
}

module.exports = {
	getJSONSpaces,
	getIndent,
	readPackageManifest,
	writePackageManifest
}
