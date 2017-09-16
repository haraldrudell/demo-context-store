// follow.js
!function(d,s,id) {
	var js
	// get the first script element of the page
	var fjs = d.getElementsByTagName(s)[0]

	if(!d.getElementById(id)) {
		// if there is no element with id 'twitter-wjs'
		// insert a script element with that id
		// before the first script element of the page
		js=d.createElement(s)
		js.id=id
		js.src="//platform.twitter.com/widgets.js"
		fjs.parentNode.insertBefore(js,fjs)
	}
}(document,"script","twitter-wjs")
