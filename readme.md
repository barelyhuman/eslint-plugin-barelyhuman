# eslint-plugin-barelyhuman

Plugin wrapper for a set of rules for structured development

## Installation

```bash
npm install @barelyhuman/eslint-plugin --save-dev
```

for yarn users:

```bash
yarn add -D @barelyhuman/eslint-plugin

```

## Usage

Add `@barelyhuman/eslint-plugin` to the `extends` section of your `.eslintrc` configuration file.

```json
{
	"extends": ["plugin:@barelyhuman/eslint-plugin/recommended"]
}
```

Alternatively, you can enable rules in the plugin, selectively.

```json
{
	"rules": {
		"@barelyhuman/react-hook-precedence": "warn"
	}
}
```

## Why

This plugin helps with various standards the I follow and it would be easier to automate fixing of most of these
