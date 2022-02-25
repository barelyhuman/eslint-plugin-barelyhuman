import {RuleTester} from 'eslint'
import test from 'tape'
import rule, {PRECEDENCE_ERROR} from '../src/hook-precedence'

const ruleTester = new RuleTester({
	parserOptions: {ecmaVersion: 6},
	parser: require.resolve('@babel/eslint-parser'),
})

const testCases = {
	valid: [],
	invalid: [],
}

testCases.valid.push(`
  const state = React.useState()
  const ref = React.useRef()
  const cb = React.useCallback(()=>{},[])
  React.useEffect(()=>{},[])
`)

// will fix one thing, which is move ref down to be after state
testCases.invalid.push({
	code: `const ref = React.useRef()
const ref2 = React.useRef()
React.useEffect(()=>{},[])
const cb = React.useCallback(()=>{},[])
const state = React.useState()
`,

	errors: [
		PRECEDENCE_ERROR('useRef', 'useState'),
		PRECEDENCE_ERROR('useRef', 'useState'),
		PRECEDENCE_ERROR('useEffect', 'useState'),
		PRECEDENCE_ERROR('useEffect', 'useCallback'),
		PRECEDENCE_ERROR('useCallback', 'useState'),
	],
	output: `
const ref2 = React.useRef()
React.useEffect(()=>{},[])
const cb = React.useCallback(()=>{},[])
const state = React.useState()
const ref = React.useRef()
`,
})

testCases.invalid.push({
	code: `
React.useEffect(()=>{},[]);
const state = React.useState();
`,
	errors: [PRECEDENCE_ERROR('useEffect', 'useState')],
	output: `

const state = React.useState();
React.useEffect(()=>{},[]);
`,
})

testCases.invalid.push({
	code: `useEffect(()=>{},[]);
const callbackHandler = useCallback(()=>{},[]);
`,
	errors: [PRECEDENCE_ERROR('useEffect', 'useCallback')],
	output: `
const callbackHandler = useCallback(()=>{},[]);
useEffect(()=>{},[]);
`,
})

testCases.invalid.push({
	code: `useEffect(()=>{},[]);
useCallback(()=>{},[]);
`,
	errors: [PRECEDENCE_ERROR('useEffect', 'useCallback')],
	output: `
useCallback(()=>{},[]);
useEffect(()=>{},[]);
`,
})

test('eslint', async t => {
	ruleTester.run('hook-precedence', rule, testCases)
	t.pass('eslint-hook-precedence')
	t.end()
})
