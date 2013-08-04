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

  // get configuration tree
  camera.getConfig(function(er, settings){
    prettyJSON(settings);
  });

  // Take picture with camera object obtained from list()
  camera.takePicture({download:true}, function(er, data){
    console.log('here');
    fs.writeFile("picture.jpg", data);
  });



/*

  // Set configuration values
  camera.setConfigValue('capturetarget', 1, function(er){
    //...
  })

*/
});


