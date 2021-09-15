// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK
let video;
let poseNet;
let pose;
let skeleton;

let brain;

let state = 'waiting';
let targeLabel;

/*bool to check detected status before and after*/
var previousDetection = new Boolean(false);
var currentDetection = new Boolean(false); 

var firstQuestion = new Boolean(true);

/*set speechSynthesis*/
const synth = window.speechSynthesis;
var voices = synth.getVoices();

/*Siri questions*/
/*6 pools of questions*/
var siriQuestions = [
  {text: "What does Siri mean?"},
  {text: "Are you a robot?"},
  {text: "What do you dream about?"},
  {text: "When will Spiderman return?"},
  {text: "How fast can you run?"},
  {text: "Are you smarter than Google Assistant?"},
  {text: "What’s your education?"}
  ]


function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  poseNet.on('pose', humanDetectedStatus);

}

/*Talk if human is detected*/
// function humanDetectedStatus(poses){
//     if(poses.length > 0){
//       currentDetection = true;
//       if(previousDetection != currentDetection) 
//       {
//         console.log("Found human");
//         speak("Hey siri, what's the weather?");   // speak the text inside the ()
//       }
//       previousDetection = true;
//     }
//     else {
//       previousDetection = false;
//     }
// }

/*Talk if human dissapears*/
function humanDetectedStatus(poses){
  if(poses.length > 0){
    currentDetection = true;
    previousDetection = true;
    firstQuestion = true;   // set it to true, so that once human is gone it can ask question
  synth.cancel();
  }
  else {
    currentDetection = false;
    var num = generateRandomInteger(5);
    
    if(firstQuestion) 
    {
      speak("Hey siri, " + "......." + siriQuestions[num].text); 
      // firstQuestion = false;
    }

  //   else{
  //     setTimeout(function(){
  //     console.log("Human gone"+num);
  //     speak("Hey siri, " + "......." + siriQuestions[num].text);   // speak the text inside the ()
  //   }, 10000);
  // }
  }
}

// function speak(text) {} --> this is the same as below
const speak = (text) => {
	if (synth.speaking) {
		console.error("it's speaking already");
		return;
	}

	let utterThis = new SpeechSynthesisUtterance(text);
	// optional parameters below, you can find more info at:
	// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance

  for(i = 0; i < voices.length ; i++) {
    if(voices[i].name === "Samantha") {
      utterThis.voice = voices[i];
    }
  }

	// utterThis.lang = "de-de";
	// utterThis.pitch = 1.2;
	utterThis.rate = 0.8;
	synth.speak(utterThis);

  // utterThis.onend = function(event) {
  //   console.log('Utterance has finished being spoken');
  // }
};

function gotPoses(poses) {
  // console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
    }
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

// function draw() {
//   push();
//   translate(video.width, 0);
//   scale(-1, 1);
//   image(video, 0, 0, video.width, video.height);

//   if (pose) {
//     for (let i = 0; i < skeleton.length; i++) {
//       let a = skeleton[i][0];
//       let b = skeleton[i][1];
//       strokeWeight(2);
//       stroke(0);

//       line(a.position.x, a.position.y, b.position.x, b.position.y);
//     }
//     for (let i = 0; i < pose.keypoints.length; i++) {
//       let x = pose.keypoints[i].position.x;
//       let y = pose.keypoints[i].position.y;
//       fill(0);

//       ellipse(x, y, 16, 16);
//     }
//   }

//   pop();
// }

function generateRandomInteger(max) {
  return Math.floor(Math.random() * max) + 1;
}

/*skeletons*/
//0:head
//1:leftEye
//2:rightEye
//5:leftArm
//9:leftHand
//10:rightHand
//11:leftPelvis
//12:rightPelvis
//13:leftKnee
//14:rightKnee