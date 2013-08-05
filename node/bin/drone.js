var gphoto2 = require('gphoto2'),
  fs = require('fs'),
  gm = require('gm'),
  exec = require('child_process').execFile,
  GPhoto = new gphoto2.GPhoto2();

console.log('Hello, there.');


fs.unlink('./capt0000.jpg', function(err) {
  exec('gphoto2', ['--capture-image-and-download'], { cwd: "./" }, function(a,b,c) {
    gm('./capt0000.jpg').thumb(640, 640, './picture.jpg', 100, function(err) {
      fs.unlink('./capt0000.jpg');
      console.log('Done.');
    });
  });
});

//, function(data) {
//})
////// List cameras / assign list item to variable to use below options
//GPhoto.list(function(list){
//  if(list.length === 0) return;
//  var camera = list[0];
//  console.log("Found", camera.model);
//  
//
//
////  camera.takePicture({download:true},  function(er, data){
////    fs.writeFileSync("picture.jpg", data);
////
////    console.log('done');
////    gm('./picture.jpg').thumb(200, 200, './picture2.jpg', 100, function(err) {
////      console.log(err);  
////      console.log('Done.');
////    });
//
////  });
//  
//
//});
//
//
