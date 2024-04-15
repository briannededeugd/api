import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import passport from "passport";
import compression from "compression";

const MongoDBStore = connectMongoDBSession(session);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app); // Create HTTP server using Express app
const io = new Server(server); // Create Socket.IO server

/**============================================
 *               MONGODB
 *=============================================**/

const port = process.env.PORT || 2000;
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@apis.sobzsh5.mongodb.net/?retryWrites=true&w=majority&appName=apis`;

async function main() {
	await mongoose.connect(uri, {
		dbName: process.env.DB_NAME,
	});
	console.log("Succesfully connected to MongoDB");
}

main().catch((err) => console.log(err));

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

/**============================================
 *               SOCKET.IO
 *=============================================**/

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

/**============================================
 *      HANDLING THE WEBSOCKET VIA PUSHER
 *=============================================**/

import Pusher from "pusher";

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	// Additional configuration options if needed
});

/**============================================
 *               PAGES
 *=============================================**/
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/chatroom", (req, res) => {
	res.sendFile(path.join(__dirname + "/views" + "/pages" + "/chat.html"));
});

app.get("/overview", (req, res) => {
	res.sendFile(path.join(__dirname + "/views" + "/pages" + "/overview.html"));
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
