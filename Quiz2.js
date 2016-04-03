var Shared = require("./Shared");

var Quiz = function(icon, categories) {

    this.icon = icon;
    this.header = "Instuderingsfrågor";
    this.categories = categories;
};

// Ärver från Shared:

Quiz.prototype = Object.create(Shared.prototype);

/**
 * addFunctionality - lägger till funktionalitet som är specifik för "quizzen"
 */

Quiz.prototype.addFunctionality = function() {

    var quizTemplate = document.querySelector("#geoQuizTemplate");
    this.content = document.importNode(quizTemplate.content.querySelector(".geoDiv"), true);

    this.facit = document.importNode(quizTemplate.content.querySelector(".facit"), true);
    this.basicWindow.appendChild(this.facit);

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
 * addListeners - lägger till lyssning på klick .... väljer kategori och initierar quiz
 */

Quiz.prototype.addListeners = function() {

    this.content.addEventListener("click", function(event) {

        if (event.target.tagName === "LI") {

            for (var i = 0; i < this.categories.length; i += 1) {

                if (event.target.textContent === this.categories[i].name) {
                    // Det skulle gå att shuffla frågorna: this.category = this.shuffleArray(this.categories[i].questions);
                    this.category = this.categories[i].questions;
                    this.basicWindow.querySelector(".windowHeader").textContent = "Instuderingsfrågor / " + this.categories[i].name;
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
 * addLogic - skapar quizzens logik med kontroll av svar, presentation av svar, mm. Här blir det lite rörigt eftersom
 * jag experimenterar med två olika varianter på samma gång, en med svarsalternativ och en utan. Från början hade jag
 * inga planer på att göra två olika varianter.
 */

Quiz.prototype.addLogic = function() {

    this.index = 0;
    var submitButton = this.content.querySelector(".submitButton");

    this.content.querySelector(".geoForm").addEventListener("submit", function() {

        // Om svara-knapp kontrolleras eventuellt svar och facit visas:

        if (submitButton.textContent === "Svara") {

            submitButton.textContent = "Nästa";
            this.facit.querySelector(".correctAnswer").textContent = this.category[this.index].answer;
            this.dropDown("down");

        } else if (submitButton.textContent === "Nästa") {

            submitButton.textContent = "Svara";
            this.index += 1;
            this.generateQuestion();
            this.dropDown();
        }
    }.bind(this));
};

/**
 * generateQuestion - genererar nästa fråga
 */

Quiz.prototype.generateQuestion = function() {

    this.content.querySelector(".geoHeader").textContent = (this.index + 1) + ". " + this.category[this.index].question;
};

/**
 * dropDown - genererar dropDown - eller pullUp
 * @param down
 */

Quiz.prototype.dropDown = function(down) {

    var height = this.facit.querySelector(".correctAnswer").clientHeight;
    this.facit.style.bottom = down ? (-height - 30) + "px" : -20 + "px";
};

module.exports = Quiz;
