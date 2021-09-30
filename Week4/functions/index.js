const functions = require("firebase-functions");
const { dialogflow } = require("actions-on-google");
// const Sentiment = require("sentiment");

// const sentiment = new Sentiment();
const app = dialogflow();

var axios = require('axios');
// var fetch = require('node-fetch');
var marriageApiResponse;

// fetch other data
axios.get('https://api.quotable.io/random?tags=love').then(aRes => {
    marriageApiResponse = aRes.data.content;
});

app.intent("Default Welcome Intent", (conv) => {
    conv.ask("I'm here!"
        //`<speak>Hi class!<break time="2s"/>Okay.<prosody rate="slow" pitch="-2st">Cool times.</prosody></speak>`
    );
});

app.intent("Marriage", (conv) => {
    // Answer pool
    var marriageTextArray = [
        'Did someone say the word marriage?',
        'I heard a word... marriage. Am I right?',
        `Did someone just ask her about marriage?`
    ];
    var randomNumber = Math.floor(Math.random() * marriageTextArray.length);    // random number creator

    conv.ask(marriageTextArray[randomNumber]);
});

app.intent("MarriageYes", (conv) => {
    // Answer pool
    var marriageYesTextArray = [
        "Okay. I don't think that's the right topic to bring up.",
        "If you ask that question to me, I'll say it's none of your business.",
        `People say these things about marriage. ${marriageApiResponse}. This is sugarcoated. Don't you agree?`
    ];
    var randomNumber = Math.floor(Math.random() * marriageYesTextArray.length);    // random number creator

    conv.ask(marriageYesTextArray[randomNumber]);
});

app.intent("Baby", (conv) => {
    conv.ask(testResponse);
    // conv.ask("Did someone say baby?");
});

app.intent("Job", (conv, params) => {
    // conv.ask("Did" + params.name + "say job?");
    conv.ask(`Did, ${params.name}, say job? How about you? Do you have a job?`);
});


// fetch('https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=542ffd081e67f4512b705f89d2a611b2')
//     .then(response => response.json())
//     .then((result) => {
//         // console.log(result);
//         testResponse = data['main']['temp'];
//     });

exports.Guardian = functions.https.onRequest(app);

// app.intent("how_are_you", (conv) => {
// 	conv.ask(
// 		`<speak><audio src="https://storage.googleapis.com/crying-robot/crying.wav">crying</audio></speak>`
// 	);
// });

// app.intent("get_fortune", (conv, params) => {
//     conv.data.myFavoriteFood = "ice cream"; // just an example to show how to use conv.data
//     conv.data.personsName = params.name; // conv.data = {personsName: "Bob"}
// 	// conv.ask("Hello, " + params.name + ", you're gonna have a cool life.");
// 	conv.ask(`Hello, ${params.name}, what did you dream about last night?`);
// });

// app.intent("dream", (conv) => {
// 	let dream = conv.query;
// 	let dreamSentiment = sentiment.analyze(dream);

// 	let result = "";

// 	if (dreamSentiment.score < -2) {
// 		result = "You're gonna have a horrifying life.";
// 	} else if (dreamSentiment.score >= -2 && dreamSentiment.score < 2) {
// 		result = "You're going to have a calm, but boring life.";
// 	} else {
// 		result =
// 			"You're in luck! Your life will be excellent and you will be successful.";
// 	}

// 	conv.close(`${conv.data.personsName}. ${result}`);
// });