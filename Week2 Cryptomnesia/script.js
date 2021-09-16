// to run a simple server, cd in your terminal to the folder these files are in and run:
// python -m SimpleHTTPServer 3000
// then go to http://localhost:3000 in your browser

const SpeechRecognition = webkitSpeechRecognition; //eslint-disable-line
const unsplashAPIKey = "5TGHDJRvDLdB2QaSsXifnYyRI8ov4PHLY-4e8NUkNuo"; // sign up and create an app to get one: https://developers.giphy.com/

const getSpeech = () => {
	const recognition = new SpeechRecognition();
	recognition.lang = "en-US";
	recognition.start();

	recognition.onresult = (event) => {
		const speechResult = event.results[0][0].transcript;
		console.log(speechResult);
		getImg(speechResult);
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

const getImg = (phrase) => {
	// same as:
	// let url = "http://api.giphy.com/v1/gifs/random?api_key=" + giphyAPIKey + "&tag=" + phrase;
	// more info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

	const url = 'https://api.unsplash.com/search/photos?client_id=5TGHDJRvDLdB2QaSsXifnYyRI8ov4PHLY-4e8NUkNuo' + '&query=' + phrase;
	//const url = 'https://api.unsplash.com/photos/?client_id=giphyAPIKey';
	// const url = `https://api.unsplash.com/photos?page=1`;
	// const url = `https://api.giphy.com/v1/gifs/random?api_key=${giphyAPIKey}&tag=${phrase}`;

	// more info: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

	var num = generateRandomInteger(10);

	fetch(url)
		.then((response) => response.json())
		.then((result) => {
			console.log(result);
			let imgUrl = result.results[num].urls.raw + "&w=250";
			console.log(imgUrl);
			console.log(num)

			// sorte the image only if system recognizes certain keywords
			// keywords are young/ child/ kid/ momory
			// https://stackoverflow.com/questions/46914159/look-for-keywords-in-a-string-in-js
			const keywords = ["young", "child", "kid", "memory", "memories", "childhood", "remember", "old town", "memorize", "memorized"]

			if (keywords.some(keyword => phrase.includes(keyword))) {
				console.log("found the keyword");

				var image = new Image();
				image.src = imgUrl;
				document.getElementById("the-img").appendChild(image);

				var date = randomDate('01/01/2021', '02/26/1993');
				var theDiv = document.getElementById("date-div");
				var content = document.createTextNode(date);
				theDiv.appendChild(content);

				// document.getElementById("date-div").appendChild(date);
				// document.querySelector("#date-div").textContent = date;
				console.log(date);
			}
		});
};

function generateRandomInteger(max) {
	return Math.floor(Math.random() * max) + 1;
}

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



// why dosen't document.onload work?
window.onload = () => {
	console.log("page loaded");
	getSpeech();
};

// document.querySelector("#my-button").onclick = () => {
// 	getSpeech();
// };
