var http = require('https');
var needle = require('needle');

var lapse = module.exports = {};

(function() {

  this.me = function(callback) {
    this.makeRequest('GET', '/api/v1/me', {}, callback);
  };

  this.createClip = function(callback) {
    needle.post(this.url('/clips'), {}, this.options, function(error, response, body) {
      if (response.statusCode >= 200 & response.statusCode < 400) {
        callback.call(null, body)
      }
    })
  }

  this.destroyClip = function(id, callback) {
    needle.delete(this.url('/clips/' + id), {}, this.options, function(error, response, body) {
      if (response.statusCode >= 200 & response.statusCode < 400) {
        callback.call(null, body)
      }
    })
  }

  this.createFrame = function(clip_id, callback) {
    needle.post(this.url('/clips/' + clip_id + '/frames'), {}, this.options, function(error, response, body) {
      if (response.statusCode >= 200 & response.statusCode < 400) {
        callback.call(null, body)
      }
    })
  }

  this.options = {
    headers: {'Authorization': 'Bearer 2O0P1T0E0d3Q0W0R1U2l2B1z2D0q2O0T'}
  }

  this.url = function(path) {
    return 'https://everlapse.com/api/v1' + path
  }

  this.makeRequest = function(verb, path, data, callback) {
    var options = {
      host: 'everlapse.com',
      port: 443,
      path: path,
      method: verb,
      headers: {
        'Authorization': 'Bearer 2O0P1T0E0d3Q0W0R1U2l2B1z2D0q2O0T'
      }
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      var results = [];
      res.on('data', function (chunk) {
        results.push(chunk);
      });
      res.on('end', function() {
        var result = results.join('');
        var json = (result.length > 0) ? JSON.parse(result) : {};
        callback.call(json, json)
      })
    });
    req.end();
  }
}).call(lapse);

lapse.createClip(function(clip) {
  console.log(clip);
  lapse.createFrame(clip.id, function(frame) {
    console.log(frame);

    lapse.destroyClip(clip.id, function(data) {
      console.log('Destroyed')
    })
  })

})

// lapse.me(function(data) {
//   console.log(data)
// })
