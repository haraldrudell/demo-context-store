// createlostfriend.js
// write an entry to the database that does not exist in facebook friendslist

var monger = require('../lib/monger.js')

var item = { id: '17',
	name: 'Akihisa Kaneko',
	first_name: 'Akihisa',
	last_name: 'Kaneko',
	link: 'http://www.facebook.com/profile.php?id=100001979111331',
	birthday: '03/29/1979',
	hometown: { id: '108490552509253', name: 'Noda-shi, Chiba, Japan' },
	location: { id: '104022926303756', name: 'Palo Alto, California' },
	bio: 'LinkedIn: http://www.linkedin.com/pub/akihisa-kaneko/3b/a35/524\n\nBrazilian Jiu-Jitsu\n- Belt: Purple\n- Weight: Pena\n- Last Competition: 11th Pogona Cup (15 Nov 2008)\n-- Blue Leve: 1st place\n-- Blue Absoluto: 2nd place\n\nMy Bike: Marin Corte Madera (Jan 2010-)',
	work: 
	 [ { employer: [Object],
			 location: [Object],
			 position: [Object],
			 description: 'H-Star,\nWorking with Persuasive Technology Lab.',
			 start_date: '2011-09' },
		 { employer: [Object],
			 location: [Object],
			 position: [Object],
			 description: '2004.4-2007.7 Camera module,\n2007.7-?? ????,\n??-2011.8 Sony Tablet,\n2011.9- Study at Stanford Univ.,',
			 start_date: '2004-04' } ],
	sports: [ { id: '175448275807249', name: 'brazilian jiu jitsu' } ],
	favorite_athletes: 
	 [ { id: '190458020990147', name: 'Leonardo Vieira (Leozinho)' },
		 { id: '177794548935036', name: 'Ichiro Suzuki' },
		 { id: '73279813255', name: 'Hideki Matsui' } ],
	education: 
	 [ { school: [Object], type: 'High School' },
		 { school: [Object], year: [Object], type: 'High School' },
		 { school: [Object], year: [Object], type: 'High School' },
		 { school: [Object], year: [Object], type: 'College' },
		 { school: [Object], type: 'College' },
		 { school: [Object],
			 degree: [Object],
			 year: [Object],
			 concentration: [Object],
			 type: 'Graduate School' } ],
	gender: 'male',
	locale: 'ja_JP',
	updated_time: '2012-02-11T00:41:45+0000',
}

var coll = 'fb-775861653'

monger.open(function(err) {
	if (err) console.log('open:', err)
	else {
		//deleteNonId(next)
		//printNonId('17', closeDb)
		//printNonId('100000061522311', closeDb)
		//printNonId('9', closeDb)
		//printNonId({ $exists: false}, closeDb)
		next()
	}

	function next() {
		hasTheId(item.id)
	}

})

function printNonId(id, next) {
	monger.getId(coll, id, function(err, item) {
		if (err) console.log('deleteId:', err)
		else console.log('non-id-item:', item)
		next()
	})
}

function deleteNonId(next) {
	monger.deleteId(coll, { $exists: false}, function(err, item) {
		if (err) console.log('deleteId:', err)
		else console.log('deteted-non-id')
		next()
	})
}

function hasTheId(id) {
	monger.getId(coll, id, function(err, item) {
		if (err) console.log('getId:', err)
		else {
			if (item == null) createId(id)
			else deleteId(id)
		}
//	monger.getIds(coll, function(err, ids) {
//		if (err) console.log('getIds:', err)
//		else {
//			console.log('ids-before:', Object.keys(ids).length)
//			if (ids[item.id]) deleteId(id)
//			else createId(id)
//		}
	})
}

function deleteId(id) {
	console.log('deleting:', item.id)
	monger.deleteId(coll, item.id, function(err, item) {
		if (err) console.log('deleteId:', err)
		closeDb()
	})
}

function createId(id) {
	console.log('creating:', item.id)
	monger.writeItem(coll, item, function(err, item) {
		if (err) console.log('writeItem:', err)
		closeDb()
	})
}

function closeDb() {
	monger.close()
}
