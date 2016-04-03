"use strict";

var Shared = require("./Shared");

var Memory = function(icon, rows, columns, results) {

    this.icon = icon;
    this.header = "Memory";
    this.rows = rows;
    this.columns = columns;
    this.order = [];
    this.pairs = 0;
    this.results = results;
};

// Ärver från Shared:

Memory.prototype = Object.create(Shared.prototype);

/**
 * addFunctionality - lägger till funktionalitet som är specifik för Memory
 */

Memory.prototype.addFunctionality = function() {

    var brick;
    var memoryTemplate = document.querySelector("#memoryTemplate");
    this.content = document.importNode(memoryTemplate.content.querySelector(".memoryContent"), true);

    // Genererar nick i getNick som ligger på Shared, därefter anropas den anonyma funktionen som en callback:

    this.getNick(function() {

        // Slumpar en ordning för brickorna:

        this.generateOrder();

        // Skapar brickor:

        for (var i = 0; i < (this.rows * this.columns); i += 1) {

            brick = document.importNode(this.content.querySelector("template").content.querySelector("img"), true);
            brick.setAttribute("data-id", this.order[i]);
            this.content.querySelector(".bricks").appendChild(brick);
        }

        this.content.querySelector(".bricks").classList.remove("removed");
        // this.turnBrick();
        this.addListeners();
    }.bind(this));

    this.checkLength();
};

/**
 * generateOrder - genererar en slumpvis ordning för brickorna
 */

Memory.prototype.generateOrder = function() {

    for (var i = 1; i <= (this.rows * this.columns / 2); i += 1) {
        this.order.push(i);
        this.order.push(i);
    }

    for (var j = this.order.length - 1; j > 0; j -= 1) {
        var k = Math.floor(Math.random() * (j + 1));
        var temp = this.order[j];
        this.order[j] = this.order[k];
        this.order[k] = temp;
    }
};

/**
 * addListeners - lägger till lyssnare på klick och knapptryck. Att spela med enbart tangentbordet går tyvärr bara i
 * Chrome än sålänge och då endast med tabb och enter
 */

Memory.prototype.addListeners = function() {

    this.content.addEventListener("click", function(event) {

        if (event.target.classList.contains("brick")) {

            this.turnBrick(event);
        }
    }.bind(this));

    this.content.addEventListener("keypress", function(event) {

        if (event.keyCode === 13) {

            if (event.target.classList.contains("brick")) {

                this.turnBrick(event);
            }
        }

    }.bind(this));
};

/**
 * turnBrick - detta är själva huvuddelen av programmet som hanterar spellogiken
 */

Memory.prototype.turnBrick = function(event) {

    event.preventDefault();

    // Hämtar den klickade brickans id:

    var id = parseInt(event.target.getAttribute("data-id"));

    // Startar tidtagning:

    if (!this.startTime) {
        this.startTime = performance.now();
    }

    // Spelaren klickar på två brickor i taget. this.brick2 är den andra brickan som bara existerar i en halv sekund
    // innan brickorna vänds tillbaka eller, om spelaren har hittat ett par, försvinner. Om this.brick2 inte har hunnit
    // försvinna innan spelaren klickar på en ny bricka avbryts exekveringen av funktionen:

    if (this.brick2) {
        return;
    }

    // Den klickade brickan "vänds rätt" genom att den ges den bild som motsvarar brickans id:

    event.target.src = "image/memory/" + id + ".png";

    // this.brick1 är den första brickan som spelaren klickar på. Om det inte redan finns en this.brick1 blir den klickade
    // brickan this.brick1:

    if (!this.brick1) {

        this.brick1 = event.target;
        this.id1 = id;

        // Om spelaren redan har klickat på den första brickan:

    } else {

        // Om spelaren klickar på samma bricka igen ska det inte hända något:

        if (event.target === this.brick1) {
            return;

            // Om spelaren klickar på en ny bricka blir denna this.brick2:

        } else {
            this.brick2 = event.target;
            this.id2 = id;
        }

        // Om id:n av de klickade brickorna överensstämmer har spelaren fått ett par:

        if (this.id1 === this.id2) {

            this.pairs += 1;

            // Brickorna försvinner efter en halv sekund:

            window.setTimeout(function() {

                this.brick1.classList.add("hidden");
                this.brick2.classList.add("hidden");
                this.brick1 = null;
                this.brick2 = null;

            }.bind(this), 500);

        } else {

            // Om brickorna inte har samma id vänds de tillbaka igen (bilden ändras tillbaka):

            window.setTimeout(function() {

                this.brick1.src = "image/memory/0.png";
                this.brick2.src = "image/memory/0.png";
                this.brick1 = null;
                this.brick2 = null;

            }.bind(this), 500);
        }

        // Om spelaren har hittat alla par:

        if (this.pairs === (this.rows * this.columns / 2)) {

            // totalTime = den totala speltiden:

            var totalTime = (performance.now() - this.startTime);

            // Om spelaren inte har valt ett nick:

            if (!this.nick) {
                this.nick = "namnlös";
            }

            // Resultat genereras efter en halv sekund:

            this.results.type = "memoryResults";
            this.results.storeResult(this.nick, totalTime, "memoryResults");
            this.results.getResults("memoryResults");
            this.results.sortResults();

            window.setTimeout(function() {

                this.content.querySelector(".bricks").classList.add("removed");
                this.results.generateList(this.content);

            }.bind(this), 500);
        }
    }
};

module.exports = Memory;
