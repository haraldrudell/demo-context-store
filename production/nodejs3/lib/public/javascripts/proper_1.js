// proper_1.js
if (typeof $ == 'undefined') alert('jQuery is missing')
else (function () {
	updateStatus('Connecting to server')
	$.ajax(location.href + '?q=').done(function (response) {
		setTags(response, 'sources')
		setTags(response, 'titles')
		updateStatus()
	})

	function setTags(response, property) {
		var tags = $('<div>')
		if (response && Array.isArray(response[property])) {
			response[property].forEach(function (entry) {
				tags.append('<option value="' + entry + '"">' + entry + '</option>')
			})
		}
		$('.' + property).html(tags.html())
	}

	function updateStatus(text, time) {
		if (!text) text = 'Ready'
		if (!time) time = new Date
		$('.status').html(text + ' at ' + time.toISOString())
	}

	$(function () {
		$('.rq').click(function () {
			var time
			updateStatus('Fetching data')
			$.ajax(location.href + 
				'?source=' + $('.sources').val() +
				'&title=' + $('.titles').val()
				).done(function (result) {
					time = new Date
					var tags = $('<div>')
					if (result && Array.isArray(result.result)) {
						tags.append('<p>Results:' + result.result.length + ' at ' + time.toISOString() + '</p>')
						if (result.result.length) {
							var table = $('<table>')

							// header row
							var tr = $('<tr>')
							tr.append('<th>No</th>')
							Object.keys(result.result[0]).forEach(function (heading) {
								var h = heading.substring(0, 1).toUpperCase() + heading.substring(1)
								tr.append('<th>' + h + '</th>')
							})
							tr.append('<th>List</th>')
							table.append(tr)

							// data rows
							result.result.forEach(function (row, index) {
								var tr = $('<tr>')
								tr.append('<td>' + (index + 1) + '</td>')
								for (var column in row) {
									var data = String(row[column])
									if (data.indexOf('://') != -1) {
										var url = data
										data = '<a href="' + url + '">link</a>'
									}
									tr.append('<td>' + data + '</td>')
								}
								tr.append('<td><a href="' + result.sourceMap[row.sourceName].url + '">list</a></td>')
								table.append(tr)
							})
							tags.append(table)
						}
					} else {

						// some error
						tags.append('<p>Bad value from server: ' + JSON.stringify(result) + '</p>')
					}
					if (result.warnings) {
						var w = '<h1>Warnings</h1>' +
						'<p>' + JSON.stringify(result.warnings) + '</p>'
						tags.append(w)
					}
					$('.data').html(tags.html())
					updateStatus(null, time)
				}) // ajax
		}) // click
	}) // on ready
})()