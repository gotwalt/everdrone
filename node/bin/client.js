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

  this.publishClip = function(clip_id, data, callback) {
    needle.post(this.url('/clips/' + clip_id + '/publish'), JSON.stringify(data), this.options, function(error, response, body) {
      if (response.statusCode >= 200 & response.statusCode < 400) {
        callback.call(null, body)
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
    parse: true
  }

  this.url = function(path) {
    return 'https://everlapse.com/api/v1' + path
  }
}).call(lapse);

lapse.createClip(function(clip) {
  lapse.createFrame(clip.id, function(frame) {
    var upload_params = frame.upload_params;
    upload_params['file'] = { file: '/Users/gotwalt/src/everdrone/sample.jpg', content_type: 'image/jpeg' }
    var options = {
      multipart: true,
      follow: 3
    }
    needle.post(frame.upload_url, upload_params, options, function(upload) {
      console.log('Uploaded')
      lapse.submitFrames(clip.id, [frame.id], function() {
        console.log('Frames submitted')
        lapse.publishClip(clip.id, {title: 'Test Clip'}, function(data) {
          console.log('Published');
          console.log(data)
          lapse.destroyClip(clip.id, function(data) {
            console.log('Destroyed')
          })
        })
      })
    })
  })

})

// lapse.me(function(data) {
//   console.log(data)
// })
