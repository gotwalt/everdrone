var everlapse = require('./bin/everlapse');
var needle = require('needle');

everlapse.createClip(function(clip) {
  everlapse.createFrame(clip.id, function(frame) {
    console.log('Created - ' + clip.id);
    var upload_params = frame.upload_params;
    upload_params['file'] = { file: './../sample.jpg', content_type: 'image/jpeg' }
    var options = { multipart: true, follow: 3 }
    needle.post(frame.upload_url, upload_params, options, function(error, response, body) {
      if (response.statusCode == 303) {
        needle.head(response.headers.location, {follow: 3}, function() {
          console.log('Uploaded')
          everlapse.submitFrames(clip.id, [frame.id], function(data) {
            console.log('Frame Submitted - ' + frame.id)
            everlapse.publishClip(clip.id, {title: 'Test Clip'}, function(data) {
              console.log('Published');
              everlapse.destroyClip(clip.id, function(data) {
                console.log('Destroyed')
              })
            })
          })
        })
      }
    })
  })

})
