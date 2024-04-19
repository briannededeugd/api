console.log("HERE'S THE WINDOW:", window.location.origin);
// Determine the socket.io URL based on the environment
var socketUrl =
	window.location.hostname === "localhost"
		? "http://localhost:2800"
		: window.location.origin;

// Load the socket.io library by adding a script tag to the the documents with a reference to socket
var script = document.createElement("script");
script.src = socketUrl + "/socket.io/socket.io.js";
document.head.appendChild(script); // and append it to the head of the document

// Connect to the socket.io server
script.onload = function () {
	// store socket with the correct socket url in a variable called socket so that I can use it later
	var socket = io(socketUrl);
	var chat = document.getElementById("messages"); // messages is the chat div I made in which all chats are displayed

	// This function runs when the document is fully loaded and ready (it's a shorthand for $(document).ready())
	$(function () {
		// Selecting HTML elements and assigning them to variables so I can use them later on
		var form = $("#form");
		var input = $("#input");
		var messages = $("#messages");

		// Change the new chat name to a contact name and update it in the sidebar
		var chatNameInput = document.getElementById("name-defined");
		var contactNameElement = document.getElementById("contact-name");

		chatNameInput.addEventListener("input", () => {
			contactNameElement.textContent = chatNameInput.textContent;
			contactName = chatNameInput.value;
		});

		// Adding the current date (in Date Month like 19 April) to the top of the chat
		var messageDate = new Date().toLocaleDateString("en", {
			day: "numeric",
			month: "long",
		});
		var dateElement = $("<p class='date'>").text(messageDate);
		messages.append(dateElement);

		//! REMOVE THIS ONCE SAVING THE CHAT WORKS ; HERE

		// Adding a disclaimer to the top of the chat that the chat will disappear
		var disclaimer = $("<p class='disclaimer'>")
			.text("This conversation disappears when you exit or refresh the chat.") // Setting the text of the disclaimer
			.css("display", "block"); // Setting its display property to block to make it visible
		messages.append(disclaimer); // Appending the disclaimer element to the messages container

		//! TO HERE

		// Setting up a form submission handler, so that when an input is sent
		// it creates a new message
		form.submit(function () {
			socket.emit("chat message", input.val()); // Emit a "chat message" event with the input message
			input.val(""); // Clear the input field after sending the message
			return false; // Here I prevent the form from actually submitting and refreshing the page
		});

		// What happens when a "chat message" (as I called it in form.submit) is sent
		// (received on the server)
		socket.on("chat message", function (data) {
			// Determining the class of the message based on whether it was sent by the current user
			var msgClass = data.sender === socket.id ? "sent" : "received";

			// Getting the time and to hour and minute like 14:12
			var messageTime = new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});

			// Creating a message element (a list item) with the appropriate class and text
			var messageElement = $("<li class='" + msgClass + "'>").text(data.msg);

			// Creating a timestamp element with the current time
			var messageTimeStamp = $("<span class='time'>").text(messageTime);

			// Appending the message and timestamp elements to the chat interface
			messages.append(messageElement, messageTimeStamp);

			// Hiding the disclaimer once a message is received
			disclaimer.css("display", "none");

			// Scrolling to the bottom of the chat interface to show the latest message
			scrollToBottom();
		});
	});

	function scrollToBottom() {
		chat.scrollTop = chat.scrollHeight;
	}
};
