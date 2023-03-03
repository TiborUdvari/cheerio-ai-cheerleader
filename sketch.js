// hold a rep
// rest 5 seconds
// send image to middle
// show / hide counter

let video;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let confTreshold = 0.98;
let cLabel = ""; // current label
let pLabel = "";
let sound;
let reactEmoji;
let speech;
let emojiContainer;

let startBtn;
let progressP;
let stopClassify = false;
let countEl;
let counter = 0;

let sounds = [];
let soundFiles = ["good-job-josh.mp3"];

let audioMap = {
  "Hello, I'm Cheerio, your AI cheerleader!": "hello-im-cheerio-your-ai-cheerleader.mp3",
  "Let's get started!": "lets-get-started.mp3",
  "Show me something": "show-me-something.mp3",
  "Show me something in 3 seconds": "show-me-something-in-3-seconds.mp3",
  "1": "1.mp3",
  "2": "2.mp3",
  "3": "3.mp3",
  "Great, great! Now don't show me anything": "great-great-now-dont-show-me-anything.mp3",
  "Show me nothing! Go!": "show-me-nothing-go.mp3",
  "Keep going!": "keep-going.mp3",
  "BOOM": "boom.mp3",
  "We're starting in 3!!!": "were-starting-in-3.mp3",
  "Keep it up": "keep-it-up.mp3",
  "You're doing great": "youre-doing-great.mp3",
  "You've got this": "youve-got-this.mp3",
  "Focus":  "focus.mp3",
  "One more" : "one-more.mp3",
  "Go, go, go": "go-go-go.mp3",
  "Stay strong": "stay-strong.mp3",
  "You can do it": "you-can-do-it.mp3",
  "Amazing": "amazing.mp3",
  "Great job": "great-job.mp3",
  "Wow": "wow.mp3",
  "Awesome": "awesome.mp3",
  "Fantastic": "fantastic.mp3",
  "Incredible": "incredible.mp3",
  "You're the best": "youre-the-best.mp3",
  "cheering": "cheering.mp3",

  "Great, great! Now rest for a few seconds.": "great-great-now-rest-for-a-few-seconds.mp3",
  "Hold a rep, starting in 3!": "hold-a-rep-starting-in-3.mp3",
  "Hold a rep" : "hold-a-rep.mp3",
  "Now rest for a sec!": "now-rest-for-a-sec.mp3"
};

let imgs = ["1.png", "2.png", "3.png", "100.png", "cam.png", "cool.png", "douglas.png", "explosion.png", "eyes.png", "fist.png", "hi5.png", "ok.png", "pump.png", "star.png", "star2.png", "star3.png", "stopwatch.png", "standing.png"];
let emojiImgs = [];


function preload() {
  document.querySelector("main").style.display = "none";

  audioMap = Object.assign(
    {},
    ...Object.keys(audioMap).map((key) => ({
      [key]: loadSound("assets/audio/" + audioMap[key]),
    }))
  );

  emojiImgs = imgs.map((img) => loadImage("assets/" + img));
}

function voiceReady() {
  console.log(speech.voices);
  speech.setVoice("Daniel");
  speech.setLang("en-US");
}

function setup() {
  
  document.querySelector("main").style.display = "inherit";

  reactEmoji = document.getElementById("react-emoji");

  sound = loadSound("assets/good-job-josh.mp3");
  speech = new p5.Speech(voiceReady); //callback, speech synthesis object

  featureExtractor = ml5.featureExtractor("MobileNet", modelReady);
  noCanvas();
  video = createCapture(VIDEO);
  video.parent("videoContainer");

  let bgBtn = document.querySelector("#bgBtn");
  let onBtn = document.querySelector("#onBtn");
  let offBtn = document.querySelector("#offBtn");
  let runBtn = document.querySelector("#runBtn");
  let clearBtn = document.querySelector("#clearBtn");
  emojiContainer = document.querySelector("#emoji-container");
  startBtn = document.querySelector("#startBtn");
  countEl = document.getElementById('counter-value');
  progressP = document.querySelector("#progress");

  startBtn.addEventListener("click", startBtnPushed);

  bgBtn.addEventListener("click", () => {
    addExample("bg");
  });

  onBtn.addEventListener("click", () => {
    addExample("on");
  });

  offBtn.addEventListener("click", () => {
    addExample("off");
  });

  runBtn.addEventListener("click", classify);
  clearBtn.addEventListener("click", clearAllLabels);
}

function modelReady() {
  select("#status").html("FeatureExtractorfleNet model) Loaded");
}

function addExample(label) {
  const features = featureExtractor.infer(video);
  knnClassifier.addExample(features, label);
  updateCounts();
}

function classify() {
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error("There is no examples in any label");
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
      select("#result").html(result.label);
      select("#confidence").html(`${confidences[result.label] * 100} %`);

      if (confidences[result.label] > confTreshold) {
        cLabel = result.label;

        if (cLabel == "on" && pLabel == "off") {
          rep();
        }

        pLabel = cLabel;
      }
    }
  }

  if (stopClassify) {
    stopClassify = false;
    return;
  }

  classify();
}

function rep(){
  let anims = ["bounce", "flash", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing", "tada", "wobble", "jello", "heartBeat"];

  let rand = Math.floor(Math.random() * anims.length);
  let randAnim = anims[rand];
  animateCSS(reactEmoji, randAnim);
  animateCSS(countEl, randAnim);

  counter++;
  countEl.textContent = counter;
  // sound.play();
  let encouragements = [
    "Keep it up",
    "You're doing great",
    "You've got this",
    "Focus",
    "One more",
    "Go, go, go",
    "Stay strong",
    "You can do it",
    "Amazing",
    "Great job",
    "Wow",
    "Awesome",
    "Fantastic",
    "Incredible",
    "You're the best"
  ];

  let successEmojis = [
    "clap.png",
    "douglas.png",
    "clap.png",
    "star2.png"
  ];

  // say random encouragement
  say(encouragements[Math.floor(Math.random() * encouragements.length)]);

  // do fun stuff
  confetti();
  // fun anims

  // show counter if not divisible by 5
  if (counter % 5 == 0) {
    // hide counter, show emoji fun emoji
    // remove class from emojiContainer
    emojiContainer.classList.add("emoji-middle");
    reactEmoji.src = "assets/" + successEmojis[Math.floor(Math.random() * successEmojis.length)];
    // show random emoji
  } else {
    // show counter
    emojiContainer.classList.remove("emoji-middle");

  }

}

function setProgress(progress) {
  let on = "█";
  let off = "▒";
  let max = 5;

  let str = "";
  for (let i = 0; i < max; i++) {
    let extra = (i + 1) / max < progress ? on : off;
    str += extra;
  }

  progressP.textContent = str;
}

async function say(something) {
  console.log(something);
  // load and play a sound file if exits
  if (audioMap[something]) {
    audioMap[something].play();
    await new Promise((resolve) => audioMap[something].onended(resolve));

    // let audio = new Audio('./assets/audio/' + audioMap[something]);
    // audio.play();
    // await new Promise(resolve => audio.ended(resolve));
  } else {
    speech.speak(something);
    console.error("No audio file for " + something);
    await new Promise((resolve) => speech.ended(resolve));
  }
}


function startBtnPushed() {
  if (startBtn.textContent == "START") {
    startExperience();
  } else if (startBtn.textContent == "DONE") {
    done();
  } else if (startBtn.textContent == "AGAIN") {
    startExperience();
  }
}

function done() {
  stopClassify = true;
  
  reactEmoji.src = "./assets/star3.png";

  // reset other vars
  say("Amazing job, you're the best!");
  say("cheering");
  confetti();
  startBtn.textContent = "AGAIN";

  setTimeout(shoot, 0);
  setTimeout(shoot, 200);
  setTimeout(shoot, 400);

  knnClassifier.clearAllLabels();
}

var defaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ['star'],
  colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ['star']
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ['circle']
  });
}


async function startExperience() {
  startBtn.textContent = "DONE";
  startBtn.style.visibility = "hidden";

  // reactEmoji.src = await new Promise((resolve) =>
  //   resolve("./assets/explosion.png")
  // );
  animateCSS(reactEmoji, "bounce");

  await say("Hello, I'm Cheerio, your AI cheerleader!");
  await wait(100);

  await say("Let's get started!");
  await wait(100);

  await say("Hold a rep, starting in 3!");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/3.png"));

  await say("3");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/2.png"));

  await say("2");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/1.png"));

  await say("1");
  await wait(100);

  await say("Hold a rep");

  progressP.style.display = "block";
  reactEmoji.src = "./assets/pump.png";
  setProgress(1 / 20);

  for (var i = 0; i < 20; i++) {
    await wait(100);
    addExample("on");
    setProgress(i / 20);
    if (Math.random() < 0.1) {
      await say("Keep going!");
    }
  }

  progressP.style.display = "none";
  reactEmoji.src = "";


  await say("Great, great! Now rest for a few seconds.");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/3.png"));
  await say("3");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/2.png"));

  await say("2");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/1.png"));

  await say("1");
  await wait(100);

  await say("Now rest for a sec!");

  progressP.style.display = "block";
  reactEmoji.src = "./assets/standing.png";
  setProgress(1 / 20);

  for (var i = 0; i < 20; i++) {
    await wait(100);
    addExample("off");

    if (Math.random() < 0.1) {
      await say("Keep going!");
    }
    setProgress(i / 20);
  }

  progressP.style.display = "none";
  reactEmoji.src = "";

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/explosion.png"));
  animateCSS(reactEmoji, "heartBeat");
  await say("BOOM");

  // add heartbeat animation

  await say("We are good to go, buddy!");

  await say("We're starting in 3!!!");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/3.png"));

  await say("3");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/2.png"));

  await say("2");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/1.png"));
  await say("1");
  await wait(100);

  reactEmoji.src = await new Promise((resolve) => resolve("./assets/explosion.png"));
  await say("BOOM");
  animateCSS(reactEmoji, "heartBeat");

  classify();

  await wait(5 * 1000); // 5 secs, change here for video
  startBtn.style.visibility = "visible";


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

  await new Promise((resolve) => sound.onended(resolve));
  console.log("sound finished playing");
}

function updateCounts() {
  const counts = knnClassifier.getCountByLabel();
  select("#status").html(JSON.stringify(counts, null, 2));
}

function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });