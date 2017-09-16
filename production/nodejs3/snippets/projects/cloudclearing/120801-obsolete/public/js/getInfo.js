var glob = {}
var stats = {};
var responses = 0
var reqlist = [ 'activities', "groups", "likes", "questions", 
                "videos", "notes", "photos", 
                "checkins", "interests", "events" ];


function addStat(name, response) {
    // console.log("---- addStat: " + name);
    if (response && response.data) {
        stats[name] = response.data.length;
        console.log(name + " len=" + response.data.length);
    } else {
        console.log("no response: " + response);
    }
    console.log('*')
    if (++responses == reqlist.length) {
        console.log(JSON.stringify(stats))
    }
}

function getInfo(id1, id2) {
    console.log("get info");

    // debugger;
    // FB.api('/me', function(response) {
	  //            console.log("user id: " + response.id);
    //        });

//    var uid = '/29844/';
    var uid = '/775861653/';


    for (var i = 0; i < reqlist.length; i++) {
        var req = reqlist[i];
        var url = uid + req;
        getActivity(url);
    }
}


function getActivity(url) {
    console.log(url);
    FB.api( url, function(response) {
        addStat(url, response);
    });
}
