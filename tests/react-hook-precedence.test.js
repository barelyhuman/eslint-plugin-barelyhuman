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

testCases.invalid.push({
	code: `
  const ref = React.useRef()
  const ref2 = React.useRef()
  React.useEffect(()=>{},[])
  const cb = React.useCallback(()=>{},[])
  const state = React.useState()
  `,

	errors: [PRECEDENCE_ERROR],
})

test('eslint', async t => {
	ruleTester.run('hook-precedence', rule, testCases)
	t.pass('eslint-hook-precedence')
	t.end()
})
