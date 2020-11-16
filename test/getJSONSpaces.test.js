const fs = require('fs')
const path = require('path')
const { getJSONSpaces, getIndent } = require("../src")

let tabIndentedJson
let spaceIndentedJson

beforeEach(() => {
	tabIndentedJson = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
	spaceIndentedJson = fs.readFileSync(path.join(process.cwd(), 'package2.json'), 'utf-8')
})

test("current implementation can't detect tab indentation correctly", () => {
	expect(getJSONSpaces(tabIndentedJson)).toBeNull()
})

test('current implementation can detect space indentation correctly', () => {
	expect(getJSONSpaces(spaceIndentedJson)).toBe(4)
})

test('using `detect-indent` for tab indented `package.json`', () => {
	expect(getIndent(tabIndentedJson)).toBe('\t')
})

test('using `detect-indent` for space indented `package.json`', () => {
	expect(getIndent(spaceIndentedJson)).toBe('    ')
})
