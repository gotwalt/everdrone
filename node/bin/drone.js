var gphoto2 = require('gphoto2'),
  fs = require('node-fs'),
  GPhoto = new gphoto2.GPhoto2();

console.log('Hello, there.');

// List cameras / assign list item to variable to use below options
GPhoto.list(function(list){
  if(list.length === 0) return;
  var camera = list[0];
  console.log("Found", camera.model);

  // Take picture with camera object obtained from list()
  camera.takePicture({download:true}, function(er, data){
	console.log('here');
    fs.writeFile("picture.jpg", data);
  });

/*
  // get configuration tree
  camera.getConfig(function(er, settings){
    console.log(settings);
  });

  // Set configuration values
  camera.setConfigValue('capturetarget', 1, function(er){
    //...
  })

*/
});


