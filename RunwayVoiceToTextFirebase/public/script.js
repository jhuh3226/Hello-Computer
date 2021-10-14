// import { config } from './config.js' // Get token code
// const {config} = require('./config.js');  // Get token code

console.log("Page loaded, hello");
const socket = io.connect();    // Installing socket io in client side 

const SpeechRecognition = webkitSpeechRecognition;
const synth = window.speechSynthesis;

const descrip = document.getElementById("descrip");
const popup = document.getElementById("popup");
const selectedImage = document.getElementById('selectedImage');
const googlePhotoButton = document.getElementById("googlePhotoButton");
const sidenav = document.getElementsByClassName("sidenav");
const bg = document.getElementsByClassName("bg");
const container = document.getElementsByClassName("container");
const blocked = document.getElementsByClassName("blocked");

var alarm = new Audio('assets/alarm.mp3');

var description = "";
var galleryContent;
var img = "";
var imgCount = 0;
var aiSpeak = false;
var accessBlocked = false;

// Show and Hide html element
// Class ruetuns array of elements so has to go through the array, with the ID you can ignore making arrays
googlePhotoButton.addEventListener('click', () => {
    console.log("Clicked google photo button");

    googlePhotoButton.style.display = "none";
    Array.from(bg).forEach((x) => {
        x.style.display = "none";
    })

    if (!accessBlocked) {
        // Show both sidenav and container
        Array.from(sidenav).forEach((x) => {
            x.style.display = "block";
        })
        Array.from(container).forEach((x) => {
            x.style.display = "block";
        })
    }

    let utterThis = new SpeechSynthesisUtterance("Oh, Hey!");
    synth.speak(utterThis);

    aiSpeak = true;
});

// Hide sidebar and container unless user clicks 'Move to google photo'
const hideSideBarWithContainer = () => {
    Array.from(sidenav).forEach((x) => {
        x.style.display = "none";
    })
    Array.from(container).forEach((x) => {
        x.style.display = "none";
    })

    Array.from(blocked).forEach((x) => {
        x.style.display = "none";
    })
};

const accessBlockedScreen = () => {
    Array.from(sidenav).forEach((x) => {
        x.style.display = "none";
    })
    Array.from(container).forEach((x) => {
        x.style.display = "none";
    })

    Array.from(blocked).forEach((x) => {
        x.style.display = "block";
    })
};

// Runway authen
const model = new rw.HostedModel({
    url: "https://attngan-8f348bb8.hosted-models.runwayml.cloud/v1/",
    token: config.token     // Get the token from config.js-this is git-ignored file
});

// Speech synthesis
const speak = (text) => {
    if (aiSpeak) {
        let utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
    }
};

const getSpeech = () => {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        console.log(speechResult);
        generate(speechResult);
    };

    recognition.onend = () => {
        console.log("it is over");
        recognition.stop();

        getSpeech();
    };

    recognition.onerror = (event) => {
        console.log("something went wrong: " + event.error);
    };
};

// Generate runway image in 'container' div
const generate = (phrase) => {
    const caption = phrase;
    const inputs = {
        "caption": caption
    };
    model.query(inputs).then(outputs => {
        const { result } = outputs;

        const keywords = ["young", "child", "kid", "memory", "memories", "childhood", "remember", "memorize", "memorized", "little girl", "little boy", "old days", "age of diaper", "dad", "parents", "little baby", "when I was little", "when I was baby", "grew up", "grow up", "used to", "home town", "four years old", "years old", "growing up", "mom", "grandma", "grandpa"]

        // Add new photo only when keywords are detected
        if (keywords.some(keyword => phrase.includes(keyword))) {
            console.log("found the keyword");

            var newDiv = document.createElement('div');

            // Date Stamp
            var dateDiv = document.createElement('dateDiv');
            dateDiv.classList.add('date');
            var datePool = randomDate('10/01/2021', '02/26/1993');  // Change the latest date as today
            var date = document.createTextNode(datePool);
            dateDiv.appendChild(date);
            newDiv.appendChild(dateDiv);

            // Create image only when it is not talking to the user
            if (!aiSpeak) {
                imgCount++; // Count the images in photo album
                img = document.createElement("img");
                img.src = result;
                img.alt = phrase;
                img.classList.add('galleryImg');
                newDiv.appendChild(img);
            }

            // If the number of photos go over _, alert the user
            if (imgCount > 3 && !aiSpeak) {
                console.log("AI wans to show the album with " + imgCount + " images");
                alarm.play();
            }

            // Hover text
            var hoverText = document.createElement('hoverText');
            hoverText.classList.add('altText');
            var text = document.createTextNode(phrase);
            hoverText.appendChild(text);
            // newDiv.appendChild(hoverText);

            img.addEventListener('click', () => {
                console.log(phrase);
                // descrip.textContent = phrase;
                speak(phrase);

                // Popup stuff
                popup.style.transform = 'translateY(0)';
                selectedImage.src = result;
            });

            // Append to gallery
            gallery.appendChild(newDiv);
        }
    });

    // Send what they said to the server
    // "Name of the event"
    // query: data I am sending
    socket.emit("send to dialogflow", { query: caption });
};

popup.addEventListener('click', () => {
    popup.style.transform = 'translateY(-100%)';
    popup.src = '';
});

socket.on("response", (data) => {
    console.log(data);
});

// receive from server
socket.on("stuff from df", (data) => {
    // Speak this only after user clicked the 'move to google photo button'
    if (aiSpeak) {
        console.log(data.text);
        speak(data.text);

        if (data.text == "I shouldn't have shared it with you. Bye.") {
            console.log("Block access");
            accessBlocked = true;
            accessBlockedScreen();
        }
    }
});

gallery.addEventListener("mouseover", function () {
    // console.log("mouse over");
    // altText.textContent = description;
});

// Create random date between two period
// https://stackoverflow.com/questions/31378526/generate-random-date-between-two-dates-and-times-in-javascript?lq=1
function randomDate(date1, date2) {
    function randomValueBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if (date1 > date2) {
        return new Date(randomValueBetween(date2, date1)).toLocaleDateString()
    } else {
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()

    }
}

// Don't know why but 'document.onload' does not work
window.onload = () => {
    console.log("page loaded");
    getSpeech();
    hideSideBarWithContainer();
};

// Need this to play the alert sound
// play() failed because the user didn't interact with the document first
// https://developer.chrome.com/blog/autoplay/#iframe-delegation
document.body.addEventListener("click", function () {
})


// You can use the info() method to see what type of input object the model expects
// model.info().then(info => console.log(info));

// document.querySelector("#my-button").onclick = () => {
// };
