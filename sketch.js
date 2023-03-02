let video;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let confTreshold = 0.98;
let cLabel = ""; // current label
let pLabel = "";
let sound;

let speech;

let sounds = [];
let soundFiles = ["good-job-josh.mp3"];

let audioMap = {
  "Hello, I'm Cheerio, your AI cheerleader!": "hello-im-cheerio-your-ai-cheerleader.mp3",
  "Let's get started!": "lets-get-started.mp3",
  "Show me something in 3 seconds": "show-me-something-in-3-seconds.mp3",
  "1": "1.mp3",
  "2": "2.mp3",
  "3": "3.mp3",
  "Great, great! Now don't show me anything": "great-great-now-dont-show-me-anything.mp3",
  "Show me nothing! Go!": "show-me-nothing-go.mp3",
  "Keep going!": "keep-going.mp3",
  "BOOM": "boom.mp3",
  "We're starting in 3!!!": "were-starting-in-3.mp3",

};

// CONFETTI: Pass in the id of an element
let confetti = new Confetti('startBtn');

// Edit given parameters
confetti.setCount(150);
confetti.setSize(30);
confetti.setPower(100);
confetti.setFade(true);
confetti.destroyTarget(false);


function preload() {
  for (let i = 0; i < soundFiles.length; i++) {
    sounds[i] = loadSound('assets/' + soundFiles[i]);
  }
}

function voiceReady() {
  console.log(speech.voices);
  speech.setVoice('Daniel');
  speech.setLang('en-US');

}

function setup() {
  sound = loadSound('assets/good-job-josh.mp3');
  speech = new p5.Speech(voiceReady); //callback, speech synthesis object

  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  noCanvas();
  video = createCapture(VIDEO);
  video.parent('videoContainer');
  
  let bgBtn = document.querySelector('#bgBtn');
  let onBtn = document.querySelector('#onBtn');
  let offBtn = document.querySelector('#offBtn');
  let runBtn = document.querySelector('#runBtn');
  let clearBtn = document.querySelector('#clearBtn');
  let startBtn = document.querySelector('#startBtn');

  startBtn.addEventListener('click', startExperience);

  bgBtn.addEventListener('click', () => {
    addExample('bg');
  });
  
  onBtn.addEventListener('click', () => {
    addExample('on');
  });
  
  offBtn.addEventListener('click', () => {
    addExample('off');
  });
  
  runBtn.addEventListener('click', classify);
  clearBtn.addEventListener('click', clearAllLabels);
}

function modelReady(){  select('#status').html('FeatureExtractorfleNet model) Loaded')
}

function addExample(label) {
  const features = featureExtractor.infer(video);
  knnClassifier.addExample(features, label);
  updateCounts();
}

function classify() {
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  const features = featureExtractor.infer(video);
  knnClassifier.classify(features, gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    if (result.label) {
      //console.log(result);
      select('#result').html(result.label);
      select('#confidence').html(`${confidences[result.label] * 100} %`);
      
      if (confidences[result.label] > confTreshold) {        
        cLabel = result.label;
        
        if (cLabel == 'on' && pLabel == 'off') {
          //console.log("trigger");
          sound.play();
        }
        
        pLabel = cLabel;
      }
      
    }
  }
  
  // confidence
  /*
    classIndex: 0
    label: "bg"
    confidences: Object
      0: 0.6666666666666666
      1: 0
      2: 0.3333333333333333
    confidencesByLabel: Object
    bg: 0.6666666666666666
    on: 0
    off: 0.3333333333333333
  */
  classify();
}

async function say(something) {
  console.log(something);
  speech.speak(something); 
  await new Promise(resolve => speech.ended(resolve));
  //await wait(1000);
}

async function startExperience() {
  await say("Hello, I'm Cheerio, your AI cheerleader!");
  document.getElementById('react-emoji').src = "./assets/explosion.png"
  await wait(100);

  await say("Let's get started!");
  await wait(100);

  await say("Show me something in 3 seconds");
  await wait(100);

  await say("3");
  await wait(100);

  await say("2");
  await wait(100);

  await say("1");
  await wait(100);

  await say("Show me something");

  for (var i = 0; i < 20; i++) {
    await wait(100);
    addExample('on');
    
    if (Math.random() < 0.1) {
      await say("Keep going!");
    }
  }

  await say("Great, great! Now don't show me anything");
  await wait(100);

  await say("3");
  await wait(100);

  await say("2");
  await wait(100);

  await say("1");
  await wait(100);

  await say("Show me nothing! Go!");

  for (var i = 0; i < 20; i++) {
    await wait(100);
    addExample('off');
    
    if (Math.random() < 0.1) {
      await say("Keep going!");
    }
  }

  await say("BOOM");

  await say("We are good to go, chief!");

  await say("We are starting in 3!!!");
  await wait(100);

  await say("3");
  await wait(100);

  await say("2");
  await wait(100);

  await say("1");
  await wait(100);

  await say("BOOM");


  classify();



  // start the experience


  // Train bg class
  // Countdown

  // Train something class

  // Train nothing class

  // Run
  // Be ready for cancel

  //console.log("sound started playing");
  //sound.play();

  // Welcome message

  await new Promise(resolve => sound.onended(resolve));
  console.log("sound finished playing");

}

function updateCounts() {
  const counts = knnClassifier.getCountByLabel();
  select('#status').html(JSON.stringify(counts, null, 2));
}

function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
