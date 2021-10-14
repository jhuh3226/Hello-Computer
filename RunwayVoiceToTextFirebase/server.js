const express = require("express");
const app = express();
const socketIO = require("socket.io");
const dialogflow = require("@google-cloud/dialogflow");
const sessionClient = new dialogflow.SessionsClient({
	keyFilename: "./key2.json",
});
const projectId = "falsememorysyndrome2-eugw";

app.use(express.static("public"));

// It was originally 5004
const server = app.listen(3000, () => {
	console.log("listening on port 3000!!!!!!");
});

const io = socketIO(server);

io.on("connection", (socket) => {
	console.log("new user:" + socket.id);

	socket.on("send to dialogflow", (data) => {
		console.log(data.query);	// What I get from the browser
		socket.emit("response", "hi from sever");	// Send response

		// Do this after doing quick set up in google cloud 
		sessionClient
			.detectIntent({
				session: sessionClient.projectAgentSessionPath(projectId, "12345"),
				// Receive data.query and send it to dialogflow
				queryInput: { text: { text: data.query, languageCode: "en-US" } },
			})
			.then((response) => {
				const result = response[0].queryResult;
				console.log(result);

				let text = result.fulfillmentText;      // Get back the fulfilment text and pass that to script.js

				socket.emit("stuff from df", {text: text});
			});
	});
});
