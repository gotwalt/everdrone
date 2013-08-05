var gphoto2 = require('gphoto2'),
    fs = require('fs'),
    gm = require('gm'),
    exec = require('child_process').execFile,
    everlapse = require('./bin/everlapse'),
    needle = require('needle'),
    async = require('async'),
    argv = require('optimist').argv,

    GPhoto = new gphoto2.GPhoto2(),
    aNewClip = argv['new-clip'],
    aToken = argv['token'];

console.log('Starting Everbot.');

if(aToken) {

console.log('Token set, thank you. ("' + aToken + '")');

  everlapse.setToken(aToken);

  function takePhotoAndAppendFrame(clipId, done) {

    console.log('Performing frame operations for clipId: ' + clipId);

    async.waterfall(
      [
        function(callback) {

          fs.readdir('./img', function(err, files) {
            async.each(files, function(file, callback) {
              console.log('Cleaning up: "' + file + '"')
              fs.unlink('./img/' + file, function() { callback() })
            }, function(err) {

              console.log('Capturing image...');
              exec('gphoto2', ['--capture-image-and-download'], { cwd: "./img" }, function(a,b,c) {
                fs.readdir('./img', function(err, files) {
                  console.log('Resizing "' + files[0] + '"...')

                  gm('./img/' + files[0]).thumb(640, 640, './img/picture.jpg', 100, function(err) {
                    console.log('Image processing complete.')
                    callback()
                  })
                })
              })

            })
          })
        
        },
        function(callback) {
          console.log('Creating frame for clipId: ' + clipId);
          everlapse.createFrame(clipId, function(frame) { callback(null, frame) })
        },
        function(frame, callback) {
          console.log('Posting frame. (url: "' + frame.upload_url + '")');
          var upload_params = frame.upload_params;
          upload_params['file'] = { file: './img/picture.jpg', content_type: 'image/jpeg' }
          var options = { multipart: true, follow: 3 }
          needle.post(frame.upload_url, upload_params, options, function(error, response, body) {
            console.log('Frame uploaded, making head request...', response.headers.location);
            console.log('Sleeping 5 seconds...')
            needle.head(response.headers.location, {follow: 3}, function() {
              setTimeout(function() {
                console.log('Frame created.'); 
                callback(null, frame) 
              }, 5000);
            })
          });
        },
        function(frame, callback) {
          console.log('Submitting frame...')
          everlapse.submitFrames(frame.clip_id, [frame.id], function(data) { callback(null, frame) })
        },
        function(frame) {
          console.log('Frame submitted.')
          done(frame)
        }
      ]
    )
  }

  function createNewClip() {
    async.waterfall(
      [
        function(callback) {
          console.log('Creating new clip...')
          everlapse.createClip(function(clip) { callback(null, clip) })
        },
        function(clip, callback) {
          console.log('Clip created, clipId: ' + clip.id)
          fs.writeFileSync('.everlapse', clip.id)
          takePhotoAndAppendFrame(clip.id, function(frame) {
            callback(null, frame);
          })
        },
        function(frame, callback) {
          console.log('Publishing clip, clipId: ' + frame.clip_id)
          everlapse.publishClip(frame.clip_id, {title: 'Test Clip'}, function(clip) { callback(null, clip) })
        },
        function() {
          console.log('Clip published.');
          console.log('Done.');
        }
      ]
    )
  }

  if(aNewClip) {
    createNewClip();
  } else {
    var clipId = -1
    fs.readFile('.everlapse', function(err, data) {
      if(!err && data) {
        clipId = data
        takePhotoAndAppendFrame(clipId, function() {
          console.log('Done.');
        });
      } else {
        console.log('The everlapse dotfile is not set. Run with --new-clip or put the clipId in the dotfile.')
        console.log('Done.')
      }
    })
  }
} else {
  console.log('You need to pass a valid token with the --token switch.');
  console.log('Done.');
}

//  function(clip, callback) {
//    console.log('published clip - ' + clip.slug);
//    everlapse.destroyClip(clip.id, function(clip) { callback(null, clip) })
//  },
//  function(clip, callback) {
//    console.log('destroyed clip')
//  }

