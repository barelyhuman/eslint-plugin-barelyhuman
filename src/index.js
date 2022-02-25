import hookPrecedence from './hook-precedence'

export const rules = {
	'react-hook-precedence': hookPrecedence,
}

export const configs = {
	recommended: {
		plugins: ['@barelyhuman/eslint-plugin'],
		rules: {
			'@barelyhuman/react-hook-precedence': 'warn',
		},
	},
}
