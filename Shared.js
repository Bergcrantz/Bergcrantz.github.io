// Memory, Chat, Quiz2 och Quiz3 ärver alla från Shared.

var Shared = function() {

    this.results = [];
};

/**
 * generateWindow - genererar nytt standardfönster och anropar addFunctionality som skiljer sig mellan de olika programmen
 * och lägger till specifikt innehåll
 */

Shared.prototype.generateWindow = function() {

    var windowTemplate = document.querySelector("#windowTemplate");
    this.basicWindow = document.importNode(windowTemplate.content.querySelector(".windowFrame"), true);

    // Genererar specifik ikon och rubrik:

    this.basicWindow.querySelector(".icon").setAttribute("src", this.icon);
    this.basicWindow.querySelector(".windowHeader").textContent = this.header;

    // Lägger till specifikt innehåll:

    this.addFunctionality();

    this.basicWindow.querySelector(".windowInside").appendChild(this.content);

    // Placerar det nya fönstret överst:

    this.basicWindow.style.zIndex = this.findZIndex();

    // Varje nytt fönster har en klass "zzzZzz" som innebär att användaren ännu inte har interagerat med det (eller åtminstone
    // inte flyttat på det). Om det redan finns ett sådant fönster skall det senast skapade fönstret hamna ett stycke
    // nedanför och till höger om detta.

    var restingWindows = document.querySelector("#windowContainer").querySelectorAll(".zzzZzz");

    var windowContainer = document.querySelector("#windowContainer");
    windowContainer.appendChild(this.basicWindow);

    windowContainer.lastElementChild.classList.add("testy");

    if (restingWindows.length === 0) {
        windowContainer.lastElementChild.style.left = "50%";
        windowContainer.lastElementChild.style.top = "50%";
    } else {
        windowContainer.lastElementChild.style.left = restingWindows[restingWindows.length - 1].offsetLeft + 20 + "px";
        windowContainer.lastElementChild.style.top = restingWindows[restingWindows.length - 1].offsetTop + 20 + "px";
    }

/*

 else {
 windowContainer.lastElementChild.style.left = "50%";
 windowContainer.lastElementChild.style.top = "50%";
 }

 if (windowContainer.lastElementChild.querySelector(".windowHeader").textContent === restingWindows[restingWindows.length - 1].querySelector(".windowHeader").textContent)
    windowContainer.lastElementChild.style.left = restingWindows.length > 0 ? restingWindows[restingWindows.length - 1].offsetLeft + 20 + "px" : "";
    windowContainer.lastElementChild.style.top = restingWindows.length > 0 ? restingWindows[restingWindows.length - 1].offsetTop + 20 + "px" : "";
*/
};

/**
 * checkLength - kontrollerar längd vid input av användarnamn
 */

Shared.prototype.checkLength = function() {

    var textField = this.basicWindow.querySelector(".textField");
    var submitButton = this.basicWindow.querySelector(".submitButton");

    submitButton.classList.add("hidden");

    document.addEventListener("keyup", function nameCheck() {

        if (textField.value.length > 2 && submitButton.classList.contains("hidden")) {

            submitButton.classList.remove("hidden");

        } else if (textField.value.length < 3 && !submitButton.classList.contains("hidden")) {

            submitButton.classList.add("hidden");
        }
    });
};

/**
 * getNick - hämtar användarnamn och kör en callback-funktion
 * @param callback
 */

Shared.prototype.getNick = function(callback) {

    var formTemplate = document.querySelector("#formTemplate");
    var form = document.importNode(formTemplate.content.querySelector(".formGeneral"), true);

    this.basicWindow.querySelector(".windowInside").appendChild(form);

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!this.basicWindow.querySelector(".submitButton").classList.contains("hidden")) {
            this.nick = form.querySelector(".textField").value;

            form.classList.add("removed");
            this.content.classList.remove("removed");

            callback();
        }

    }.bind(this));
};

/**
 * shuffleArray - shufflar en array, t ex frågor till en quiz - just nu använder jag faktiskt inte denna metod ...
 * @param arr
 * @returns {*}
 */

Shared.prototype.shuffleArray = function(arr) {

    for (var i = arr.length - 1; i > 0; i -= 1) {

        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
};

/**
 * findZIndex - returnerar det högsta z-indexet + 1
 * @returns {number}
 */

Shared.prototype.findZIndex = function() {

    var z = 0;

    var windowContainer = document.querySelector("#windowContainer");

    for (var i = 0; i < windowContainer.children.length; i += 1) {

        if (windowContainer.children[i].style.zIndex && z < windowContainer.children[i].style.zIndex) {
            z = parseInt(windowContainer.children[i].style.zIndex);
        }
    }

    return z + 1;
};

module.exports = Shared;
