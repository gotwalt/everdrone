var gphoto2 = require('gphoto2'),
  fs = require('node-fs'),
  GPhoto = new gphoto2.GPhoto2();

console.log('Hello, there.');

// List cameras / assign list item to variable to use below options
GPhoto.list(function(list){
  if(list.length === 0) return;
  var camera = list[0];
  console.log("Found", camera.model);

  function prettyJSON(obj) {
    console.log(JSON.stringify(obj, null, 2));
  }

  camera.setConfigValue('imagesize', 'Medium 2', function(er){
  });

  camera.getConfig(function(er, settings){
    prettyJSON(settings);
  });

  //})

  /* 
  camera.takePicture({download:true, targetPath: './test.jpg'},  function(er, data){
    fs.writeFile("picture.jpg", data, 'binary');
    console.log('Done.');
  });
  camera.setConfigValue('imagesize', 'Small', function(er){
  })
  */

});


