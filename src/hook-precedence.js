const precendenceOrder = {
	useState: 0,
	useRef: 1,
	useCallback: 2,
	useEffect: 3,
}

export const PRECEDENCE_ERROR = `Your hooks should follow the following order  ${Object.keys(
	precendenceOrder,
)
	.join('->')
	.replace(/(->)$/, '')}`

export default {
	meta: {
		type: 'layout',
		docs: {
			description: 'Informs about better laying out of generic react hooks',
			category: 'Unexpected Problems',
			recommended: 'true',
		},
	},
	create(context) {
		let currentComponentOrder = []
		return {
			Identifier(node) {
				const hooksToGrab = Object.keys(precendenceOrder)

				if (hooksToGrab.indexOf(node.name) > -1) {
					currentComponentOrder.push(node)
				}
			},
			'Program:exit': function () {
				for (const [index, element] of currentComponentOrder.entries()) {
					const nextItem = currentComponentOrder[index + 1] || false
					if (!nextItem) {
						continue
					}

					if (
						precendenceOrder[element.name] > precendenceOrder[nextItem.name]
					) {
						return context.report({
							node: element,
							message: PRECEDENCE_ERROR,
						})
					}
				}
			},
		}
	},
}
