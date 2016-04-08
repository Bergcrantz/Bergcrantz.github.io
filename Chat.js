var Shared = require("./Shared");
var config = require("./config.json");

// Både chatten och memoryt har baserats mycket på Johans genomgångar.

var Chat = function(icon) {

    this.icon = icon;
    this.header = "Chatt";
    this.username = localStorage.getItem("chatUsername");
    this.socket = null;
};

// Ärver från Shared:

Chat.prototype = Object.create(Shared.prototype);

/**
 * addFunctionality - lägger till funktionalitet som är specifik för chatten
 */

Chat.prototype.addFunctionality = function() {

    var chatTemplate = document.querySelector("#chatTemplate");
    this.content = document.importNode(chatTemplate.content.querySelector(".chatContent"), true);

    this.generateForm();
    this.addListener();

    if (this.username) {
        this.displayUserInfo();
        this.content.classList.remove("removed");
    } else {
        this.showHideForm();
        this.checkLength();
    }
};

/**
 * generateForm - genererar formulär
 */

Chat.prototype.generateForm = function() {

    var formTemplate = document.querySelector("#formTemplate");
    var form = document.importNode(formTemplate.content.querySelector(".formGeneral"), true);
    this.basicWindow.querySelector(".windowInside").appendChild(form);

    this.basicWindow.querySelector(".formGeneral").classList.add("removed");
};

/**
 * showHideForm - togglar mellan formulär och chatt
 */

Chat.prototype.showHideForm = function() {

    this.basicWindow.querySelector(".formGeneral").classList.toggle("removed");
    this.content.classList.toggle("removed");
};

/**
 * updateUsername - uppdaterar användarnamn och lagrar i localStorage
 * @param value
 */

Chat.prototype.updateUsername = function(value) {

    if (this.username) {
        this.printMessage("Du har bytt namn till " + value + ".");
    }

    localStorage.setItem("chatUsername", value);
    this.username = value;
    this.displayUserInfo();
};

/**
 * displayUserInfo - visar information om användarnamn
 */

Chat.prototype.displayUserInfo = function() {

    this.content.querySelector(".userInfo").firstElementChild.textContent = "Du är inloggad som " + this.username + ".";
};

/**
 * addListeners - lägger till lyssning på submit, klick och knapptryck
 * (
 */

Chat.prototype.addListener = function() {

    var form = this.basicWindow.querySelector(".formGeneral");
    var username;

    // Lyssnar efter användarnamn på submit:

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        // submitButton är dold så länge inte användarnamnet överskrider ett visst antal bokstäver:

        if (!form.querySelector(".submitButton").classList.contains("hidden")) {

            // Användarnamn lagras och textfältet rensas:

            username = form.querySelector(".textField").value;
            this.updateUsername(username);
            form.querySelector(".textField").value = "";

            // Togglar mellan chatt och formulär:

            this.showHideForm();
        }

    }.bind(this));

    // Lyssnar efter klick och tar bort placeholder-text eller togglar mellan chatt och formulär:

    this.content.addEventListener("click", function(event) {

        if (event.target.getAttribute("placeholder")) {
            event.target.removeAttribute("placeholder");
        }

        if (event.target.tagName === "A") {
            this.showHideForm();
        }

    }.bind(this));

    this.content.addEventListener("keypress", function(event) {

        if (event.keyCode === 13) {
            event.preventDefault();

            // Om event.target.value börjar med "/namn " sker byte av användarnamn, annars skickas meddelandet:

            if (event.target.value.substring(0, 6) === "/namn " && event.target.value.length > 6) {
                this.updateUsername(event.target.value.substring(6));
                event.target.value = "";
            } else if (event.target.value.length > 0) {
                this.sendMessage(event.target.value);
                event.target.value = "";
            }
        }
    }.bind(this));
};

/**
 * connect - ?
 * @returns {Promise}
 */

Chat.prototype.connect = function() {

    return new Promise(function(resolve, reject) {

        if (this.socket && this.socket.readyState === 1) {
            resolve(this.socket);
            return;
        }

        this.socket = new WebSocket(config.address);

        this.socket.addEventListener("open", function() {
            resolve(this.socket);
        }.bind(this));

        this.socket.addEventListener("error", function(event) { // ta bort event?
            reject(new Error("Could not connect"));
        }.bind(this));

        this.socket.addEventListener("message", function(event) {

            var message = JSON.parse(event.data);

            if (message.type === "message") {
                this.printMessage(message);
            }
        }.bind(this));
    }.bind(this));
};

/**
 * sendMessage -
 * @param text
 */

Chat.prototype.sendMessage = function(text) {

    var data = {
        type: "message",
        data: text,
        username: this.username, //senare ska namnet dock hämtas ur localstorage
        channel: "my, not so secret, channel",
        key: config.key
    };

    this.msg = data.data;

    this.connect().then(function(socket) {
        socket.send(JSON.stringify(data));
    }).catch(function(error) {
        console.log("Something went wrong", error);
    });
};

// receive message display message

/*
Chat.prototype.printMessage = function(message) {

    var messageTemplate = this.content.querySelectorAll("#messageTemplate")[0]; // var template = this.chatDiv.querySelector("template");

    var messageDiv = document.importNode(messageTemplate.content.firstElementChild, true);

    if (message.data === this.msg) {
        console.log("mitt meddelande");
    }

    messageDiv.querySelectorAll(".text")[0].textContent = message.data; // messageDiv.querySelector(".text").textContent = message.data;
    messageDiv.querySelectorAll(".author")[0].textContent = message.username; // messageDiv.querySelector(".author").textContent = message.username;

    this.content.querySelectorAll(".messages")[0].appendChild(messageDiv); // this.chatDiv.querySelector(".messages").appendChild(messageDiv);
};
*/

/**
 * printMessage - ?
 * @param message
 */

Chat.prototype.printMessage = function(message) {

    var messageTemplate = this.content.querySelector("#messageTemplate");
    var messageDiv = document.importNode(messageTemplate.content.querySelector(".message"), true);

    if (message.data) {

        if (message.data === this.msg && message.username === this.username) {
            messageDiv.querySelector(".author").classList.add("myMessage");
        }

        messageDiv.querySelector(".text").textContent = message.data;
        messageDiv.querySelector(".author").textContent = message.username + ":";
    } else {
        messageDiv.querySelector(".text").textContent = message;
        messageDiv.querySelector(".text").classList.add("systemMessage");
    }

    this.content.querySelector(".messages").appendChild(messageDiv);
};

module.exports = Chat;
