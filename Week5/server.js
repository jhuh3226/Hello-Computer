const express = require("express");
const app = express();

app.use(express.static("public"));

const server = app.listen(5004, () => {
	console.log("listening on port 5004!!!!!!");
});