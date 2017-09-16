// lilinkfields.js
// Fields when getting a user profile from LinkedIn
// Copyright © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

// scrubbed 130216
// linkedin introduced r_fullprofile

exports.fields = fields

function fields() {
	// spaces not allowed
	var result = [
		// r_basicprofile permission
		'id',
		'first-name',
		'last-name',
		'maiden-name',
		'formatted-name',
		'phonetic-first-name',
		'phonetic-last-name',
		'formatted-phonetic-name',
		'headline',
		'location:(name,country:(code))',
		'industry',
		'distance',
		'relation-to-viewer:(distance)',
		'current-share',
		'num-connections',
		'num-connections-capped',
		'summary',
		'specialties',
		'positions',
		'picture-url',
		'site-standard-profile-request',
		'api-standard-profile-request:(url,headers)',
		'public-profile-url',

		// r_emailaddress permission
		'email-address',


		// r_fullprofile permission
		'last-modified-timestamp', // out of order?
		'proposal-comments',
		'associations',
		'honors',
		'interests',
		'publications',
		'patents',
		'languages',
		'skills',
		'certifications',
		'educations',
		'courses',
		'volunteer',
		'three-current-positions',
		'three-past-positions',
		'num-recommenders',
		'recommendations-received',
		'mfeed-rss-url',
		'following',
		'job-bookmarks',
		'suggestions', // gives 403 with people api
		'date-of-birth',
		'member-url-resources:(url,name)',
		'related-profile-views',

		// r_contactinfo permission
		'phone-numbers',
		'bound-account-types',
		'im-accounts',
		'main-address',
		'twitter-accounts',
		'primary-twitter-account',

		// r_network permission
		//'connections', // list of many profiles

		// rw_groups permission
		'group-memberships',

		// rw_nus permission
		'network', // gives 403 with people api
	]

	return result
}
