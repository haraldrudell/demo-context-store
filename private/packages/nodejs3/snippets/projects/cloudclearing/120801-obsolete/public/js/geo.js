function getCommonLikes(response) {
    var output = '';
    
    navigator.geolocation.getCurrentPosition(function(location) {
        $.ajax({url: 'api.php', type: "POST", dataType: 'json', data: { method: "getCommonLikes", location: location.coords }, success: function(data) {
            output = '';
            
            console.log(data);
            
            for (var i = 0; i < data.likes.length; i++) {
                output += '<h3>' + data.likes[i].like_name + '<h3>';
                
                if (data.likes[i].uids) {
                    output += '<h4>Shared with</h4>';
                    for (var n = 0; n < data.likes[i].uids.length; n++) {
                        output += '<img src="http://graph.facebook.com/' + 
                            data.likes[i].uids[n].id + 
                            '/picture"> ' + data.likes[i].uids[n].name;
                    }
                    output += '<br><br>';
                }
            }
            
            $("body").append(output);
            console.log(output);
        }});
    },
                                             function(error) {
                                                 alert('You need to allow location, first.  Please refresh.');
                                             });
}
