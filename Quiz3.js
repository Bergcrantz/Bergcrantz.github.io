var Shared = require("./Shared");

var Quiz = function(icon, categories, results) {

    this.icon = icon;
    this.header = "Instuderingsfrågor";
    this.categories = categories;
    this.results = results;
    this.points = 0;
    this.total = 0;
};

Quiz.prototype = Object.create(Shared.prototype);

/**
 * addFunctionality - lägger till funktionalitet som är specifik för "quizzen"
 */

Quiz.prototype.addFunctionality = function() {

    var quizTemplate = document.querySelector("#geoQuizTemplate");
    this.content = document.importNode(quizTemplate.content.querySelector(".geoDiv"), true);

    this.facit = document.importNode(quizTemplate.content.querySelector(".facit"), true);
    this.basicWindow.appendChild(this.facit);

    // I denna version finns även ett textfält:

    var noteToSelf = document.importNode(this.facit.querySelector("template").content.querySelector(".noteToSelfContainer"), true);
    this.facit.appendChild(noteToSelf);

    // Anpassar dimensioner av facit efter nya förhållanden. Så här ska det såklart inte funka när det är färdigt utan det
    // är en provisorisk lösning under tiden jag experimenterar:

    this.facit.querySelector(".correctAnswer").classList.add("correctAnswer2");
    this.facit.classList.add("facit2");

    this.basicWindow.querySelector(".windowInside").classList.add("notebook");

    this.generateCategories();
    this.addListeners();
};

/**
 * generateCategories - genererar lista över kategorier
 */

Quiz.prototype.generateCategories = function() {

    var categoriesTemplate = this.content.querySelector(".categories template");
    var category;

    for (var i = 0; i < this.categories.length; i += 1) {

        category = document.importNode(categoriesTemplate.content, true);
        category.firstElementChild.textContent = this.categories[i].name;
        this.content.querySelector(".categories ol").appendChild(category);
    }
};

/**
 * addListeners - lägger till lyssning på klick
 */

Quiz.prototype.addListeners = function() {

    this.content.addEventListener("click", function(event) {

        if (event.target.tagName === "LI") {

            for (var i = 0; i < this.categories.length; i += 1) {

                if (event.target.textContent === this.categories[i].name) {

                    // Det skulle gå att shuffla frågorna: this.category = this.shuffleArray(this.categories[i].questions);
                    this.category = this.categories[i].questions;
                    this.basicWindow.querySelector(".windowHeader").textContent = "Instuderingsfrågor / " + this.categories[i].name;
                    this.categoryName = this.categories[i].name;
                }
            }
            this.inAndOutOfQuiz();
            this.addLogic();
            this.generateQuestion();
        }
    }.bind(this));
};

/**
 * inAndOutOfQuiz - togglar mellan listan på kategorier och formulär/notes
 */

Quiz.prototype.inAndOutOfQuiz = function() {

    this.content.querySelector(".categories").classList.toggle("removed");
    this.content.querySelector(".geoForm").classList.toggle("removed");
    this.facit.classList.toggle("removed");
};

/**
 * addLogic - skapar quizzens logik med kontroll av svar, presentation av svar, mm.
 */

Quiz.prototype.addLogic = function() {

    this.index = 0;
    var submitButton = this.content.querySelector(".submitButton");

    this.content.querySelector(".geoForm").addEventListener("submit", function() {

        // Om svarsknapp behandlas svaret:

        if (submitButton.textContent === "Svara") {

            submitButton.textContent = "Nästa";
            this.checkAnswer(this.index);
            this.getComment();

            this.facit.querySelector(".correctAnswer").textContent = this.category[this.index].answer;
            this.dropDown("down");

            // Om nästa-knapp genereras ny fråga:

        } else if (submitButton.textContent === "Nästa") {

            submitButton.textContent = "Svara";
            this.storeComment();
            this.clearForm();
            this.dropDown();

            if (this.index + 1 < this.category.length) {

                this.index += 1;
                this.generateQuestion();

            } else {
                this.content.querySelector(".geoHeader").textContent = "Vad heter du?";
                submitButton.textContent = "Ok!";
                this.generateTextField();
            }
        } else if (submitButton.textContent === "Ok!") {

            this.generateResult();
        }
    }.bind(this));
};

/**
 * generateQuestion - genererar nästa fråga
 */

Quiz.prototype.generateQuestion = function() {

    this.content.querySelector(".geoHeader").textContent = (this.index + 1) + ". " + this.category[this.index].question;
    this.generateTextFields();
    this.content.querySelector(".geoForm").style.backgroundImage = "url(" + this.category[this.index].image + ")";
    this.content.querySelector(".geoForm").classList.add("expandedForm");
};

Quiz.prototype.generateTextField = function() {

    var formTemplate = document.querySelector("#formTemplate");
    var textField = document.importNode(formTemplate.content.querySelector(".textField"), true);
    this.content.querySelector(".geoForm").appendChild(textField);
};


/**
 * generateTextFields - genererar svarsmöjligheter i form av textfält
 * @param index
 */

Quiz.prototype.generateTextFields = function() {

    var form = this.content.querySelector(".geoForm");
    var textFieldTemplate = form.querySelector("template");
    var textField;

    // En fråga kan ha ett eller flera svarsmöjligheter (textfält). För varje textfält:

    for (var i = 0; i < this.category[this.index].answers.length; i += 1) {

        textField = document.importNode(textFieldTemplate.content.firstElementChild, true);
        form.appendChild(textField);

        // Textfälten positioneras utifrån specifika värden på left och top: (om detta sker alltid kan fälten alltid vara absoluta.

        form.lastElementChild.style.position = "absolute";
        form.lastElementChild.style.left = this.category[this.index].answers[i].left + "px";
        form.lastElementChild.style.top = this.category[this.index].answers[i].top + "px";
    }
};

/**
 * dropDown - genererar dropDown - eller pullUp
 * @param down
 */

Quiz.prototype.dropDown = function(down) {

    var height = this.facit.querySelector(".correctAnswer").clientHeight;
    this.facit.style.bottom = down ? (-height - 30 - 130) + "px" : -20 + "px";
};

/**
 * checkAnser - kontrollerar svar
 * @param index
 */

Quiz.prototype.checkAnswer = function(index) {

    var textFields = this.content.querySelectorAll(".geoTextField");

    for (var i = 0; i < textFields.length; i += 1) {

        this.total += 1;

        if (textFields[i].value === this.category[index].answers[i].answer) {
            this.points += 1;
        }
    }
};

/**
 * clearForm - rensar formulär
 */

Quiz.prototype.clearForm = function() {

    var form = this.content.querySelector(".geoForm");
    var textFields = form.querySelectorAll(".geoTextField");

    for (var i = 0; i < textFields.length; i += 1) {
        textFields[i].parentNode.removeChild(textFields[i]);
    }

    form.style.backgroundImage = "";
    form.classList.remove("expandedForm");
};

/**
 * storeComment - lagrar kommentar i localStorage
 */

Quiz.prototype.storeComment = function() {

    var id = "geoQuiz/hydrogeologi/" + this.index;
    var comment = this.facit.querySelector(".noteToSelf").value;
    localStorage.setItem(id, comment);
};

/**
 * getComment - hämtar kommentar
 */

Quiz.prototype.getComment = function() {

    var id = "geoQuiz/hydrogeologi/" + this.index;

    if (localStorage.getItem(id)) {
        this.facit.querySelector(".noteToSelf").value = localStorage.getItem(id);
    } else {
        this.facit.querySelector(".noteToSelf").value = "Anteckningar sparas till dess att du rensar historiken i webbläsaren.";
    }
};

/**
 * generateResult - genererar resultat
 */

Quiz.prototype.generateResult = function() {

    this.nick = this.content.querySelector(".textField").value;

    this.content.querySelector(".geoForm").classList.add("removed");
    this.content.querySelector(".geoHeader").textContent = "Resultat";

    this.results.type = "geoQuizResults";
    this.results.storeResult(this.nick, this.points, this.categoryName);
    this.results.getResults(this.categoryName);
    this.results.sortResults();
    this.results.generateList(this.content, this.total);
};

module.exports = Quiz;
