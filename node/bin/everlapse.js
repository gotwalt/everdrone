var http = require('https');
var needle = require('needle');

var everlapse = module.exports = {};

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
        callback.call(null, JSON.parse(body))
      }
    })
  }

  this.publishClip = function(clip_id, data, callback) {
    needle.post(this.url('/clips/' + clip_id + '/publish'), JSON.stringify(data), this.options, function(error, response, body) {
      if (response.statusCode >= 200 & response.statusCode < 400) {
        callback.call(null, body)
      } else {
        console.log(body)
      }
    })
  }

  this.submitFrames = function(clip_id, frame_ids, callback) {
    needle.post(this.url('/clips/' + clip_id + '/submit_frames'), JSON.stringify({ frame_ids: frame_ids }), this.options, function(error, response, body) {
      if (response.statusCode >= 200 & response.statusCode < 400) {
        callback.call(null, body)
      }
    })
  }

  this.options = {
    headers: {'Authorization': 'Bearer ' + process.env.EVERLAPSE_TOKEN, 'Content-Type': 'application/json'},
  }

  this.url = function(path) {
    return 'https://everlapse.com/api/v1' + path
  }
}).call(everlapse);
