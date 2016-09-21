var loopback = require('loopback');
var boot = require('loopback-boot');
var friendsList = require('../common/models/friends-list.js');
var app = module.exports = loopback();

app.get('/fb/friends', function(req, res, next){
    
    var FB = require('fb');
    
    //var accessToken = req.query.access_token;
      //      console.log('access token',accessToken);
    //var dataSource = app.datasources.mongoDs;
//var persistedModel = 
            FB.api('/oauth/access_token', {client_id : '1821836508051644', client_secret: '32d5e54ae21e9cc7902d9a9f1167cc29', grant_type:'client_credentials'}, function(response){
                 console.log(response.access_token);
                if (response) 
                {                          
                    FB.api('/1582967178671000/posts', {access_token:response.access_token}, function(response){
                        //122455541166857 - Badminton Academy
                        res.send(response);
                    });
                }
        
});
});

app.get('/tweets', function(req, res, next){
    
var R = require('request');
    var Twitter = require('twitter');
    var base64 = require('base-64');
    var utf8 = require('utf8');
    var consumerKey = utf8.encode('gyiETErkOmpsCDxFZAa0C5bwD');
    var consumerSecret = utf8.encode('710wpNFxR4Lj5gplmHSCwbuGYsXgBLQYquRYGOPb0VYdy6qS7J'); 
    var credentials = base64.encode(consumerKey+':'+consumerSecret);
    var bearerToken;
    var url = 'https://api.twitter.com/oauth2/token';
    console.log("******************************************"+req.query.screen_name);
    R({ url: url,
        method:'POST',
        headers: {
            "Authorization": "Basic " + credentials,
            "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: "grant_type=client_credentials"

    }, function(err, resp, body) {

        var response = JSON.parse(body);
        console.log(response.access_token);
        bearerToken = response.access_token;
        url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

    R({ url: url,
        method:'GET',
        qs:{"screen_name":req.query.screen_name,"count":"100", "include_rts":"false", "exclude_replies":"true"},
        json:true,
        headers: {
            "Authorization": "Bearer " + bearerToken
        }

    }, function(err, resp, body) {

        console.dir(body);
        res.send(body);
    });
    
    });
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
