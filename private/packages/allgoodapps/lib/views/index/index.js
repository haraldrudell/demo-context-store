// view/index/index.js
// render Cloud Clearing root url using webfiller
// © Harald Rudell 2012

exports.getHandler = function handleIndex(defaults, view) {
	return function renderIndex(request, response) {
		var opts = {
			title: defaults.view.index.title,
			bindings: exports.fragments.index,
		}
		response.render(view, opts)
	}
}

exports.fragments = {
	index: {
		'': {
			fragment: ['head'],
		},
		h1: 'title',
	},
	head: {
		title: 'title',
	},
}
