var everlapse = require('./bin/everlapse');
var needle = require('needle');
var async = require('async');

async.waterfall([
  function(callback) {
    everlapse.createClip(function(clip) { callback(null, clip) })
  },
  function(clip, callback) {
    everlapse.createFrame(clip.id, function(frame) { callback(null, frame) })
  },
  function(frame, callback) {
    var upload_params = frame.upload_params;
    upload_params['file'] = { file: './../sample.jpg', content_type: 'image/jpeg' }
    var options = { multipart: true, follow: 3 }
    needle.post(frame.upload_url, upload_params, options, function(error, response, body) {
      needle.head(response.headers.location, {follow: 3}, function() { callback(null, frame) })
    });
  },
  function(frame, callback) {
    everlapse.submitFrames(frame.clip_id, [frame.id], function(data) { callback(null, frame) })
  },
  function(frame, callback) {
    everlapse.publishClip(frame.clip_id, {title: 'Test Clip'}, function(clip) { callback(null, clip) })
  },
  function(clip, callback) {
    console.log('published clip - ' + clip.slug);
    everlapse.destroyClip(clip.id, function(clip) { callback(null, clip) })
  },
  function(clip, callback) {
    console.log('destroyed clip')
  }
])
