const express = require("express");
const app = express();
const socketIO = require("socket.io");
// const dialogflow = require("@google-cloud/dialogflow");
// const sessionClient = new dialogflow.SessionsClient({
// 	keyFilename: "YOUR KEY JSON FILE SO SOMETHING LIKE ./key.json IF YOU RENAME IT",
// });
// const projectId = "YOUR PROJECT ID";

app.use(express.static("public"));

const server = app.listen(5004, () => {
	console.log("listening on port 5004!!!!!!");
});

const io = socketIO(server);

io.on("connection", (socket) => {
	console.log("new user:" + socket.id);

// 	socket.on("send to dialogflow", (data) => {
// 		console.log(data.query);
// 		socket.emit("response", "hi!!!!!!");

// 		sessionClient
// 			.detectIntent({
// 				session: sessionClient.projectAgentSessionPath(projectId, "12345"),
// 				queryInput: { text: { text: data.query, languageCode: "en-US" } },
// 			})
// 			.then((response) => {
// 				const result = response[0].queryResult;
// 				console.log(result);

// 				let text = result.fulfillmentText;
//                 let params = result.parameters.fields;
//                 let intent = result.intent.displayName;

// 				socket.emit("stuff from df", { text, params, intent });
// 			});
// 	});
});
