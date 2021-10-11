const SpeechRecognition = webkitSpeechRecognition; //eslint-disable-line
const gallery = document.getElementById('gallery');

const imageIndexs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const descrip = document.getElementById("descrip");

var description = "";
var galleryContent;
var img = "";

const model = new rw.HostedModel({
    url: "https://attngan-63a75f28.hosted-models.runwayml.cloud/v1/",
    token: "s0c3OdfZu6sxaZ8D88J6Eg==",
});

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

const generate = (phrase) => {
    // console.log("generate image");
    // const caption = document.getElementById('memory').value;
    const caption = phrase;
    const inputs = {
        "caption": caption
    };
    model.query(inputs).then(outputs => {
        const { result } = outputs;

        /* Third way */
        var newDiv = document.createElement('div');

        // Date Stamp
        var dateDiv = document.createElement('dateDiv');
        dateDiv.classList.add('date');
        var datePool = randomDate('01/01/2021', '02/26/1993');  // Change the latest date as today
        var date = document.createTextNode(datePool);
        dateDiv.appendChild(date);
        newDiv.appendChild(dateDiv);

        // Image
        img = document.createElement("img");
        img.src = result;
        img.alt = phrase;
        img.classList.add('galleryImg');
        newDiv.appendChild(img);

        // Hover text
        var hoverText = document.createElement('hoverText');
        hoverText.classList.add('altText');
        var text = document.createTextNode(phrase);
        hoverText.appendChild(text);
        newDiv.appendChild(hoverText);

        img.addEventListener('click', () => {
            console.log(phrase);
            descrip.textContent = phrase;
        });

        // Append to gallery
        gallery.appendChild(newDiv);

        // second way
        // var img = document.createElement("img");
        // img.src = result;
        // img.classList.add('galleryImg');
        // img.id = 'img';

        // var date = randomDate('01/01/2021', '02/26/1993');  // Change the latest date as today
        // var convertedDate = document.createTextNode(date);
        // convertedDate.classList.add('stampDate');
        // convertedDate.id = 'convertedDate';
        // convertedDate = convertedDate;

        // gallery.insertBefore(img, gallery.firstChild);
        // gallery.insertBefore(convertedDate, gallery.firstChild);

        // first try
        // imageIndexs.forEach(i => {
        //     var img = document.createElement('img')
        //     img.src = result;
        //     img.alt = phrase;
        //     description = phrase;
        //     img.classList.add('galleryImg');

        //     // append the gallery with soure of the memory image being result & dateStamp as convertedDate
        //     // First create div, and append image and text
        //     // Append that div

        //     gallery.append(img);
        //     document.querySelector('#memory').src = result;
        // });

        // // Adding date stamp
        // var date = randomDate('01/01/2021', '02/26/1993');  // Change the latest date as today
        // var convertedDate = document.createTextNode(date);
        // document.getElementById('dateStamp').appendChild(convertedDate);
        // document.getElementById('dateStamp').textContent = date;
        // // Adding alt text
        // document.getElementById('text-div').appendChild(phrase);
    });
};


// adding alt text

// for (var i = 0; i < img.length; i++) {
gallery.addEventListener("mouseover", function () {
    // console.log("mouse over");
    // console.log(img.alt);
    // altText.textContent = description;
});
// }

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

//// You can use the info() method to see what type of input object the model expects
// model.info().then(info => console.log(info));

// why dosen't document.onload work?
window.onload = () => {
    console.log("page loaded");
    getSpeech();
};

