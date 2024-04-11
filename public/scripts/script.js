console.log("HERE'S THE WINDOW:", window.location.origin);
// Determine the socket.io URL based on the environment
var socketUrl =
	window.location.hostname === "localhost"
		? "http://localhost:3000"
		: window.location.origin;

// Load the socket.io library
var script = document.createElement("script");
script.src = socketUrl + "/socket.io/socket.io.js";
document.head.appendChild(script);

// Connect to the socket.io server
script.onload = function () {
	var socket = io(socketUrl);
	var chat = document.getElementById("messages");

	$(function () {
		var form = $("#form");
		var input = $("#input");
		var messages = $("#messages");

		// Date at the top of the chat
		var messageDate = new Date().toLocaleDateString([], {
			day: "numeric",
			month: "long",
		});
		var dateElement = $("<p class='date'>").text(messageDate);
		messages.append(dateElement);

		// Disclaimer at the top of the chat
		var disclaimer = $("<p class='disclaimer'>").text(
			"This conversation disappears when you exit or refresh the chat."
		);
		messages.append(disclaimer);

		form.submit(function () {
			socket.emit("chat message", input.val());
			input.val("");
			return false;
		});

		socket.on("chat message", function (data) {
			var msgClass = data.sender === socket.id ? "sent" : "received";
			var messageTime = new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
			var messageElement = $("<li class='" + msgClass + "'>").text(data.msg);
			var messageTimeStamp = $("<span class='time'>").text(messageTime);
			messages.append(messageElement, messageTimeStamp);
			disclaimer.style.opacity = 0;
			scrollToBottom();
		});
	});

	function scrollToBottom() {
		chat.scrollTop = chat.scrollHeight;
	}

	var cursor = document.querySelector(".blob");

	document.addEventListener("mousemove", function (e) {
		var x = e.clientX;
		var y = e.clientY;
		cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
	});
};
