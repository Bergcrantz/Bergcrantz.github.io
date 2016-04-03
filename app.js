"use strict";

var Desktop = require("./Desktop");
var sections = require("./sections");
var Memory = require("./Memory");
var Chat = require("./Chat");
var Quiz2 = require("./Quiz2");
var Quiz3 = require("./Quiz3");
var Results = require("./Results");
var questions2 = require("./questions2");
var questions3 = require("./questions3");

// localStorage.clear();

// Appen är i huvudsak testad, fungerar bäst och ser bäst ut i Firefox. Det enda (?) som fungerar bättre i Chrome är memoryt som inte går att
// spela med enbart tangentbord i Firefox (däremot ser resultatlistan finare ut i Firefox).

// Genererar rätt fönster på klick:

document.querySelector("nav").addEventListener("click", function(event) {

    if (event.target.classList.contains("memory")) {

        var memory = new Memory(sections[0].icon, 4, 4, new Results());
        memory.generateWindow();

    } else if (event.target.classList.contains("quiz")) {

        var quiz = new Quiz(questions, new Results());
        quiz.generateWindow();

    } else if (event.target.classList.contains("chat")) {

        var chat1 = new Chat(sections[1].icon, document.querySelector("#windowContainer"));
        // chat1.connect();
        chat1.generateWindow();

    } else if (event.target.classList.contains("hangman")) {

        var hangman = new Hangman(words);
        hangman.playHangman();

    } else if (event.target.classList.contains("quiz2")) {

        var quiz2 = new Quiz2(sections[2].icon, questions2);
        quiz2.generateWindow();

    } else if (event.target.classList.contains("quiz3")) {

        var quiz3 = new Quiz3(sections[3].icon, questions3, new Results());
        quiz3.generateWindow();
    }
});

var desktop = new Desktop();
desktop.generateNav(sections);
desktop.addListeners();
desktop.addListenerOnExitButton();
desktop.rain();
desktop.bringToFront();
