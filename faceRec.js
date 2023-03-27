let video;  // webcam input
let model;  // Face Landmarks machine-learning model
let face;   // detected face

// print details when a face is
// first found
let firstFace = true;
let vid;
let dist=0;
let latestData = "waiting for data";
let pic=[];
function preload() {
  for(let i=0;i<5;i++){
    pic[i]=loadImage(str(i+1)+".png");
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  //  vid = createVideo("iwaswrong.mp4");
  //  vid.loop()
  video = createCapture(VIDEO,640,480);
  video.hide();

  // like in the BlazeFace example, we have
  // to load the model in an asynchronous function
  loadFaceModel();
}

async function loadFaceModel() {
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh, 

    // optional: limit results to just one face
  { 
  maxFaces: 
    1
  }
  );
}
let st=0;
function draw() {
  background(0);
  image(video,0,0,width,height);
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }
  if (face !== undefined) {
    if (firstFace) {
      console.log(face);
      firstFace = false;
    }
    let leftEye =  scalePoint(face.annotations.leftEyeIris[0]);
    let rightEye = scalePoint(face.annotations.rightEyeIris[0]);

    // then use the face's overall bounding box to scale them
    let topLeft =     scalePoint(face.boundingBox.topLeft);
    let bottomRight = scalePoint(face.boundingBox.bottomRight);
    let w = bottomRight.x - topLeft.x;
    let h = bottomRight.x - topLeft.x;
    image(pic[st],topLeft.x,topLeft.y,w,h);
  }else{
    st=int(random(0,5));
  }
}


// converts points from video coordinates to canvas
function scalePoint(pt) {
  let x = map(pt[0], 0, video.width, 0, width);
  let y = map(pt[1], 0, video.height, 0, height);
  return createVector(x, y);
}


// gets face points from video input
async function getFace() {
  const predictions = await model.estimateFaces( {
  input: 
    document.querySelector('video')
  }
  ); 
  if (predictions.length === 0) {
    face = undefined;
  } else {
    face = predictions[0];
    console.log(face);
  }
}
