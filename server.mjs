import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app); // Create HTTP server using Express app
const io = new Server(server); // Create Socket.IO server

const port = 3000;

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});

	socket.on("chat message", (msg) => {
		console.log("message: " + msg);
		// Emit message along with sender information
		io.emit("chat message", { msg: msg, sender: socket.id });
	});
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html"); // Serve index.html file
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
