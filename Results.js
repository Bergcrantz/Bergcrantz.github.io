var Results = function() {

    this.results = []; // results som ska visas

    this.test = "egenskaperna kopierade";
};

/**
 * storeResult - lagrar aktuellt resultat i localStorage
 * @param nick
 * @param result
 * @param type
 */

Results.prototype.storeResult = function(nick, result, type) {

    // Om det redan finns ett resultat av samma typ i localStorage så läggs det nya resultatet till detta:

    if (localStorage.getItem(type)) {
        this.results = JSON.parse(localStorage.getItem(type));
    }

    this.results.push({nick: nick, result: result});

    localStorage.setItem(type, JSON.stringify(this.results));
};

/**
 * gerResults - hämtar resultatet från localStorage
 * @param type
 */

Results.prototype.getResults = function(type) {

    this.results = JSON.parse(localStorage.getItem(type));
};

/**
 * sortResults - sorterar resultatet på olika sätt beroende på vad det handlar om
 */

Results.prototype.sortResults = function() {

    this.results.sort(function(a, b) {
        if (this.type === "memoryResults") {
            return a.result - b.result;
        } else if (this.type === "geoQuizResults") {
            return b.result - a.result;
        }
    }.bind(this));
};

/**
 * generateList - skapar en lista med resultatet (eller en tabell, kan det vara nu också så namnet behöver ändras)
 * @param container
 * @param total
 */

Results.prototype.generateList = function(container, total) {

    // Genererar lista till memoryt:

    if (this.type === "memoryResults") {

        var ol = document.importNode(document.querySelector("#templateList").content.firstElementChild, false);
        var li;

        for (var i = 0; i < 10; i += 1) {

            if (this.results[i]) {
                li = document.importNode(document.querySelector("#templateList").content.querySelector("li"), true);
                li.textContent = this.results[i].nick + " (" + (this.results[i].result / 1000).toFixed(2) + " s)";
                ol.appendChild(li);
            }
        }

        container.appendChild(ol);
    }

    // Genererar tabell till geoquizzen:

    if (this.type === "geoQuizResults") {

        var table = document.importNode(container.querySelector(".geoResults template").content.querySelector("table"), false);
        var row;
        var percentage;

        for (var j = -1; j < this.results.length; j += 1) {

            row = document.importNode(container.querySelector(".geoResults template").content.querySelector("table tr"), true);
            table.appendChild(row);

            if (this.results[j]) {
                table.rows[j + 1].cells[0].textContent = this.results[j].nick;
                table.rows[j + 1].cells[1].textContent = this.results[j].result + "/" + total;
                table.rows[j + 1].cells[2].textContent = (this.results[j].result / total * 100).toFixed(0) + "%";

                percentage = (this.results[j].result / total * 100).toFixed(0);

                if (percentage < 50) {
                    table.rows[j + 1].cells[3].textContent = "IG";
                } else if (percentage < 80) {
                    table.rows[j + 1].cells[3].textContent = "G";
                } else {
                    table.rows[j + 1].cells[3].textContent = "VG";
                }
            }
        }

        container.appendChild(table);
    }
};

module.exports = Results;
