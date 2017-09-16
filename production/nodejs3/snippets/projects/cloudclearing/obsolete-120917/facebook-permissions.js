// facebook-permissions.js

// https://developers.facebook.com/docs/authentication/permissions/#user_friends_perms

var userFields = [
	'id',
	'name',
	'first_name',
	'middle_name',
	'last_name',
	'gender',
	'locale',
	'languages',
	'link',
	'username',
	'third_party_id',
	'installed',
	'timezone',
	'updated_time',
	'verified',
	'bio',
	'birthday',
	'cover',
	'currency',
	'devices',
	'education',
	'email',
	'hometown',
	'interested_in',
	'location',
	'political',
	'favorite_athletes',
	'favorite_teams',
	'picture',
	'quotes',
	'relationship_status',
	'religion',
	'security_settings',
	'significant_other',
	'video_upload_limits',
	'website',
	'work',
]

var friendsPermissions = [
	'friends_about_me',
	'friends_activities',
	'friends_birthday',
	'friends_checkins',
	'friends_education_history',
	'friends_events',
	'friends_groups',
	'friends_hometown',
	'friends_interests',
	'friends_likes',
	'friends_location',
	'friends_notes',
	'friends_photos',
	'friends_questions',
	'friends_relationships',
	'friends_relationship_details',
	'friends_religion_politics',
	'friends_status',
	'friends_subscriptions',
	'friends_videos',
	'friends_website',
	'friends_work_history',
]

// https://developers.facebook.com/docs/reference/api/user/

var userConnections = [
	'video_upload_limits',
	'website',
	'work',
	'accounts',
	'achievements',
	'activities',
	'albums',
	'apprequests',
	'books',
	'checkins',
	'events',
	'family',
	'feed',
	'friendlists',
	'friendrequests',
	'friends',
	'games',
	'groups',
	'home',
	'inbox',
	'interests',
	'likes',
	'links',
	'locations',
	'movies',
	'music',
	'mutualfriends',
	'notes',
	'notifications',
	'outbox',
	'payments',
	'permissions',
	'photos',
	'picture',
	'pokes',
	'posts',
	'questions',
	'scores',
	'statuses',
	'subscribedto',
	'subscribers',
	'tagged',
	'television',
	'updates',
	'videos',
]

//friend filtering work fbfriends.js
var allPossibleFriendsFields = [
	'id',
	'name',
	'first_name',
	'middle_name',
	'last_name',
	'gender',
	'locale',
	'languages',
	'link',
	'username',
	'third_party_id',
	'installed',
	'timezone',
	'updated_time',
	'verified',
	'bio',
	'birthday',
	'cover',
	'currency',
	'devices',
	'education',
	'email',
	'hometown',
	'interested_in',
	'location',
	//'movies',not interesting
	//'music',not interesting
	'political',
	'favorite_athletes',
	'favorite_teams',
	'picture',
	'quotes',
	'relationship_status',
	'religion',
	'security_settings',
	'significant_other',
	'video_upload_limits',
	'website',
	'work',
	//'accounts', always for the user, not friends
	//'achievements',
	'activities',
	//'albums', not interesting
	//'apprequests', not interesting
	'books',
	//'checkins', not interesting
	//'events', not interesting
	'family',
	//'feed', not interesting
	//'friendlists', // gives unsupported operation
	//'friendrequests', extended permissions: read_requests
	//'friends', //gives unsupported operation Facebook status code: 500
	'games',
	'groups',
	//'home', not for friends
	//'inbox', not for friends
	'interests',
	'likes',
	'links',
	'locations',
	'movies',
	'music',
	//'mutualfriends', required parameter user
	'notes',
	//'notifications', requires manage_notifications
	//'outbox', not for friends
	//'payments',This method must be called with an app access_token.","type":"OAuthException","code":15
	//'permissions',not interesting
	'photos',
	'picture',

	//'pokes',
	//'posts', not interesting
	//'questions',
	//'scores', not interesting
	//'statuses',not interesting
	'subscribedto',
	'subscribers',
	//'tagged', not interesting
	//'television', not interesting
	//'updates', not for friends
	//'videos',not interesting
/*
*/
]
