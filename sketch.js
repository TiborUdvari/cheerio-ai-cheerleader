let video;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let confTreshold = 0.98;
let cLabel = ""; // current label
let pLabel = "";
let sound;

let sounds = [];
let soundFiles = ["good-job-josh.mp3"];

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

function setup() {
  sound = loadSound('assets/good-job-josh.mp3');

  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  noCanvas();
  video = createCapture(VIDEO);
  video.parent('videoContainer');
  
  let bgBtn = document.querySelector('#bgBtn');
  let onBtn = document.querySelector('#onBtn');
  let offBtn = document.querySelector('#offBtn');
  let runBtn = document.querySelector('#runBtn');
  let clearBtn = document.querySelector('#clearBtn');
  
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

async function startExperience() {
  console.log("sound started playing");
  sound.play();

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
