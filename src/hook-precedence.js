const precedenceOrder = {
	useState: 0,
	useRef: 1,
	useCallback: 2,
	useEffect: 3,
}

export const PRECEDENCE_ERROR = (elementOne, elementTwo) =>
	`${elementOne} should be after ${elementTwo}. It's recommended to follow the following order ${Object.keys(
		precedenceOrder,
	).join(', ')}`

const getClosestExpression = node => {
	if (node.type === 'ExpressionStatement') {
		return node
	}
	return getClosestExpression(node.parent)
}

const getVariableDeclaration = node => {
	if (!node) {
		return false
	}
	if (node.type === 'VariableDeclaration') {
		return node
	}
	return getVariableDeclaration(node.parent)
}

const getHookBasedBlock = node => {
	let block = false
	switch (node.name) {
		case 'useEffect': {
			block = getClosestExpression(node)
			break
		}
		case 'useState': {
			block = getVariableDeclaration(node)
			break
		}
		case 'useRef': {
			block = getVariableDeclaration(node)
			break
		}
		case 'useCallback': {
			block = getVariableDeclaration(node)
			if (!block) {
				block = getClosestExpression(node)
			}
			break
		}
	}
	return block
}

export default {
	meta: {
		fixable: 'code',
		type: 'layout',
		docs: {
			description: 'Informs about better laying out of generic react hooks',
			category: 'Unexpected Problems',
			recommended: 'true',
		},
	},
	create(context) {
		let currentHooksOrder = []
		return {
			Identifier(node) {
				if (node.parent.type === 'ImportSpecifier') {
					return
				}

				const hooksToGrab = Object.keys(precedenceOrder)

				if (hooksToGrab.indexOf(node.name) > -1) {
					currentHooksOrder.push(node)
				}
			},
			'Program:exit': function () {
				for (let i = 0; i < currentHooksOrder.length; i++) {
					const element = currentHooksOrder[i]

					for (let j = currentHooksOrder.length; j > i; j--) {
						const nextItem = currentHooksOrder[j] || false

						if (!nextItem) {
							continue
						}

						if (
							precedenceOrder[element.name] <= precedenceOrder[nextItem.name]
						) {
							continue
						}

						context.report({
							node: element,
							message: PRECEDENCE_ERROR(element.name, nextItem.name),
							fix: function* (fixer) {
								const sourceBlock = getHookBasedBlock(element)
								const targetBlock = getHookBasedBlock(nextItem)

								if (!targetBlock || !sourceBlock) {
									return
								}

								const sourceBlockCode = context
									.getSourceCode()
									.getText(sourceBlock)

								yield fixer.remove(sourceBlock)
								yield fixer.insertTextAfter(targetBlock, '\n' + sourceBlockCode)

								return
							},
						})
					}
				}
			},
		}
	},
}
