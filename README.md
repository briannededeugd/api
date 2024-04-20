# KozyKorner
KozyKorner is my assignment for the course Application Programming Interface during the minor Web Design & Development at the Amsterdam University of Applied Sciences, academic year 2023-2024. This course was about the use of API's in web applications and the exchange of information across servers and devices. The goals set by the administrators of this course were as follows:

- Be able to make server-side rendered applications;
- Be able to create exciting user experiences;
- Expand knowledge and understanding of the web and its possibilities.

I have chosen to create a chat-application, inspired by Whatsapp and Signal but with a standard dark interface and lilac accents. Chat applications have always been something I have been curious about - what's the _behind the scenes_ of such an application, and what permits it to exchange information between two endpoints so easily and quickly? My goal was to strip this process down to its bare bones to understand the process and apply it myself, and out came KozyKorner.

## Table of Contents
1. [Features](#features)
2. [Installation Guide](#installation-guide)
3. [Process](#process)
    - [Week One](#week-one)
        - [Feedback](#week-one-feedback)
    - [Week Two](#week-two)
        - [Feedback](#week-two-feedback)
    - [Last Additions](#last-additions)
4. [Reflection](#reflection)
    - [Prides](#prides)
    - [The Let-Go's](#the-let-gos)
5. [Sources](#sources)

## Features
As mentioned before, KozyKorner is a chat-application that allows for two participants. Regardless of the physical distance between them, these two participants merely have to visit the same URL (as linked on the right side of this page), and they'll automatically be connected. From there on out, they can start a new chat and both send new messages, that'll be marked as 'sent' and 'received' appropiately for both.

Aside from the main function, which is live chatting, the user experience is improved with static pages like the chat overview page and the homepage. Both of these are streamlined with the chatpage in terms of style and tone-of-voice to simulate a feeling of completeness - something that wouldn't merely have to be merely a feeling if I had a bit more time (more about my let-go's in my [reflection](#reflection)!), but regardless, KozyKorner keeps its promise of being a safe, secure and fast chat-application!

## Installation Guide
This application is online and accessible [here](https://api-xazi.onrender.com/), but you can also run it in your local computer environment:

1. Download all contents of the repository from the [Code page](https://github.com/briannededeugd/api);
2. You should find them in your `Downloads` folder;
2. Open your Command Line Interface (Terminal);
3. Navigate to your Downloads folder using `cd Downloads` (meaning Change Directories to Downloads);<br>
3a. OPTIONAL: Type `pwd` to check what folder you're in. This should return Downloads.<br>
3b. OPTIONAL: Type `ls` to check the contents of your Downloads folder. This returns a list that should include `api`.<br>
4. Navigate to the `api` folder using `cd api` (meaning Change Directories to api);
5. Type `npm i` to install all necessary npm dependencies (pieces of other people's code the project depends on);
6. Type `npm start` to initialize the app. This should return `Running on localhost:[XXXX]`, in which `[XXXX]` is a four-digit number.
7. Open a browser and navigate to the address `localhost:[XXXX]` that was returned.

Now you should be able to view and use the application!

## Process
Instead of the intended four weeks, I ended up having to make due with only two. Unforeseen personal circumstances meant I had to start this project a week later than my peers, and since I was scheduled to have my review at the start of week four, I was left with fifteen days to create this app. That being said, I have reduced my process chapter to week one and week two to illustrate what steps I've taken in the time I had.

### Week One 
Week one was mainly idea generation. I looked into Socket.io and Websockets, as well as various deployment methods. My first step was to make the chat function work, since this is what my app would be all about. I dove into some documentation and was able to make a plan of approach based on importance of completion.

First: Connecting with Socket.io. My research told me that I needed client-side code and server-side code, and I was already fairly familiar with this due to my experience with Express and Node.JS (things I learned during my second year at AUAS, where I also worked with MongoDB, routing and components). My server-side code would be all about laying the foundation for the entire app, like making sure the routing worked and my sessions were defined. It was also responsible for defining Socket and its server-side necessities.

Next: Translating this backend Socket functionality to the client-side. I quickly discovered that I needed to define a Socket variable in order to recognise and use user-interaction. For this, I made a simple HTML-page with a form (consisting of an input and a submit-button) to test whether it worked. The documentation of this part was a bit vague to me, but I understood that I needed to access the Socket npm package I'd installed and that I'd have to use a relative path to do so - but it's here that I bumped into my first issue.

The URL would differ based on whether I'd access the app via my localhost or a live site. That's why I made the Socket-url dynamic with the following client-side code:

```js

var socketUrl =
	window.location.hostname === "localhost"
		? "http://localhost:2800"
		: window.location.origin;

// Load the socket.io library by adding a script tag to the the documents with a reference to socket
var script = document.createElement("script");
script.src = socketUrl + "/socket.io/socket.io.js";

```

Now, I could start on my chat functionality. This took a surprisingly little amount of code. My server-side code for Socket looks like this:

```js

// When a new user connects to the server
io.on("connection", (socket) => {
	// Log a message to the server console indicating that a user has connected,
	// along with the unique ID of the socket (connection)
	console.log("a user connected", socket.id);

	// When the user disconnects from the server
	socket.on("disconnect", () => {
		// Log a message to the server console indicating that the user has disconnected
		console.log("user disconnected");
	});

	// When the server receives a "chat message" event from a connected user
	socket.on("chat message", (msg) => {
		// Log the received message to the server console
		console.log("message: " + msg);

		// Emit (send) the received message back to all connected clients,
		// along with information about the sender (in this case, the unique ID of the socket)
		io.emit("chat message", { msg: msg, sender: socket.id });
	});
});

```

and my client-side Socket code was a bit more extensive, since this is where I added the messages to the interface, where the users could see it:

```js

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

```

I was extremely surprised by how little amount of code the functionality actually took. It wasn't very detailed yet and not styled at all, but two endpoints could connect and exchange information / a chat. I tested this out by opening the chat in different browsers and sending messages, and it even worked when I asked a family member who lives an hour away from me to visit the link and say hello.

My next order of business was styling the chat. I had added a bunch of relevant classes to the different types of elements that I appended to my 'messages' in the client-side code, like the classes 'sent', 'received' and 'time' that all define a specific style to these elements. Using these classes, I was able to mimic a chat-style.


#### Week One Feedback

I had a feedback session with my lecturer Cyd on Friday where I explained my idea and showed her my process so far. She had a few notes and ideas for me.

1. *The styling was a bit dark*: especially the input, where users type their messages, should be dinstinctive to increase the clarity and emphasise what its function is. Before, I'd styled it as black (with white text) over a dark gray background, which made it difficult to notice.
2. *I could use cookies to store and save chats*: At this point, I had a Snapchat-style application where two users could chat freely, but once they refreshed the page all of their previous messages were gone. I kind of blended this into my app by adding a 'disclaimer' to the top of the chat that said "_This conversation disappears when you exit or refresh the chat._", but Cyd suggested I use cookies to save the chats so users could return to them later.
3. *Use Speech to Text as a second API*: Since the assignment states that we have to use multiple Web API's, I shared my idea of integrating a speech to text API so that users could record something and have that translate to a text message, like other applications also have. Cyd liked this idea but told me to prioritize saving the chats over this.
4. *Make use of Socket.io's Rooms functionality for a chat-overview page*: At this point I still had to create a rooms overview page. Cyd told me I could make this a static page to simulate what it _would_ look like, since my actual functionality was chatting and creating a dynamic overview page would also require me to make accounts, login systems and so on. I told her that I considered using Socket.io's rooms functionality, but again, this was not (supposed to be) a priority.

With this feedback, I felt properly equipped to enter week two and make more progress!

### Week Two

In week two, I made quite a lot of progress. My chat worked, and I had some extremely basic styling, buy there were still things for me to do. One of those things was to create an overview page, but I hadn't really defined a style yet, so I just tried some things out. The logical overviewpage for a chat application is, of course, an overview of chats. At this point I was still considering building a login-system to save chats per user (with MongoDB), but I was discouraged from doing so because it wasn't really part of the assignment.

Still, I spent the first part of the week establishing a connection with MongoDB which also required setting up environment variables. Once I succesfully connected, I had to look into ways to get my app online with a deployment service (which was one of the assignment's requirements). I have my own domain at [brianne.nl](https://brianne.nl), but this didn't work. Then, I tried with Vercel, but it turned out that this service didn't work with Websockets (something about time-out came up that concluded it wouldn't work with Socket.io at all). I heard in class that other students that made chat-applications used Render, which didn't work either, so I tried Heroku, which also didn't work. I was at the end so I asked for help from my lecturers, and here we discovered that for some reason, my app wasn't being build on deployment. Once we defined the run command to `npm start && npm run build`, it worked!

This issue with the deployment swallowed up the better half of my week, but I also got to create a simple homepage and a static overviewpage, as well as style my chat in detail, in time for my feedback session with my lecturer Declan on Friday.

#### Week Two Feedback

To my relief, Declan liked what I had so far. I discovered that my end assessment would be in four days, which seriously cut back on the time I had left to somehow save the chats and add a second web API, but his feedback calmed me down:

1. *I was already using multiple web API's*: Socket.io was one of them, but things like `toStringLocale()` was also considered a web API. This meant that I didn't have to worry myself or work myself to death in the weekend. He did note that the Speech to Text function wouldn't be much work and if I managed to create a functioning, styled chat app in two weeks, building this function would definitely be doable less than in four days.
2. *I didn't have to use MongoDB to save chats*: According to Declan, I had two options: I could use JavaScript to save chats in a variable and save it for the length of the session, which still meant that my app would be a sort of Snapchat-app _but_ users could navigate between pages and come back to the app later (since the chat would be stored for the length of the session), OR I could just market KozyKorner as a disappearing-message app, which it already was at this point. He assured me that it was okay, and it would be *super* secure. What I had with at this point was enough. This was great to hear!

### Last additions

## Reflection

### Prides

I'm most proud of:

1. The dark, sleek styling;
2. The chat-function working;
3. Being able to change the contact's name in the chat;
4. Timestamps, dates and sender-receiver information and their handling;
5. The intuitive interface and styling.

### The Let-Go's

There were some things I thought of adding throughout this process, but that I had to let go of. Those things are as follows:

1. A log-in/register/account-system;
2. Saved chats to MongoDB;
3. Sending stickers and GIFs;
4. Rooms for groupchats and singular (two users) chats.

But all in all, I'm really surprised that I managed to finish this app and make it into what it is today. I think it looks neat and sleek, and that I've adhered to enough UX patterns to make it intuitive while still keeping an original style. Of course there are things I wish I could've added or made work, but even without them, I think KozyKorner testifies of my willingness to create a lasting thing and make it work.

## Sources
1. Developer, J. A. R. (2023, 4 juni). Effective Logging for NodeJS + Socket IO Applications. Medium. https://medium.com/@khajurination/effective-logging-for-nodejs-socket-io-applications-89a1dc3cf492
2. Get started | Socket.IO. (z.d.). https://socket.io/get-started/
3. grid-column-end - CSS: Cascading Style Sheets | MDN. (2023, 18 juli). MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end
4. How do I point a domain name I bought from GoDaddy to my site that is hosted by render.com? (z.d.). Quora. https://www.quora.com/How-do-I-point-a-domain-name-I-bought-from-GoDaddy-to-my-site-that-is-hosted-by-render-com
5. Material Symbols and Icons - Google Fonts. (z.d.-a). Google Fonts. https://fonts.google.com/icons?selected=Material+Symbols+Outlined:close:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=close
6. npm: session.socket.io. (z.d.). Npm. https://www.npmjs.com/package/session.socket.io
7. Socket IO net::ERR_CONNECTION_REFUSED. (z.d.). Stack Overflow. https://stackoverflow.com/questions/42053499/socket-io-neterr-connection-refused
8. SOCKET.IO deploy. (2023a, maart 30). 
9. Socket.io session variable. (z.d.). Stack Overflow. https://stackoverflow.com/questions/19943818/socket-io-session-variable
10. Text slide in on hover CSS. (z.d.). Stack Overflow. https://stackoverflow.com/questions/62073617/text-slide-in-on-hover-css
11. Tutorial - Introduction | Socket.IO. (2024a, april 5). https://socket.io/docs/v4/tutorial/introduction
12. Using JavaScript & contenteditable | scottohara.me. (2018a, november 23). https://www.scottohara.me/blog/2014/05/08/contenteditable.html
13. Why position: absolute; and bottom: 0; not being at body’s bottom? (z.d.). Stack Overflow. https://stackoverflow.com/questions/53855904/why-position-absolute-and-bottom-0-not-being-at-bodys-bottom