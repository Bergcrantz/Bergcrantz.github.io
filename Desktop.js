var Desktop = function() {

    this.z = 0;
};

/**
 * generateNav - genererar global navigering
 * @param sections
 */

Desktop.prototype.generateNav = function(sections) {

    for (var i = 0; i < sections.length; i += 1) {

        var windowTemplate = document.querySelector("#navWindowTemplate");
        var frame = document.importNode(windowTemplate.content, true);

        frame.querySelector(".icon").setAttribute("src", sections[i].icon);

        document.querySelectorAll("nav a")[i].appendChild(frame);
        document.querySelectorAll("nav .icon")[i].classList.add(sections[i].name);
        document.querySelectorAll("nav a")[i].firstElementChild.classList.add("navWindow");
    }
};

// move, mouseUp, mouseDown och addListeners är alla en del av drag & drop-funktionaliteten. Om användaren klickar och
// håller inne knappen på ett fönster (på den övre kanten av fönstret) tilldelas fönstret klassen "clicked" och om användaren
// släpper knappen igen försvinner klassen. Om användaren däremellan flyttar fönstret används "clicked" för att identifiera
// och uppdatera x- och y-koordinaterna på fönstret. Inspiration till drag & drop har hämtats från: http://jsfiddle.net/Lk2hLthp/1/

/**
 * move - triggas på mousemove efter mousedown på ett fönsters överkant
 * @param event
 */

Desktop.prototype.move = function(event) {

    document.querySelector(".clicked").classList.remove("zzzZzz");
    document.querySelector(".clicked").style.position = "absolute";
    document.querySelector(".clicked").style.top = (event.clientY - this.ypos) + "px";
    document.querySelector(".clicked").style.left = (event.clientX - this.xpos) + "px";
};

/**
 * mouseUp - triggas på mouseup efter mousedown och/eller move på ett fönsters överkant
 */

Desktop.prototype.mouseUp = function() {

    window.removeEventListener("mousemove", this.mousemove, false);
    document.querySelector(".clicked").classList.remove("clicked");
    document.querySelector("#windowContainer").classList.remove("noSelection");
};

/**
 * mouseDown - triggas på mousedown på ett fönsters överkant
 * @param event
 */

Desktop.prototype.mouseDown = function(event) {

    document.querySelector("#windowContainer").classList.add("noSelection");

    if (!document.querySelector(".clicked") && event.target.classList.contains("windowTop")) {

        event.target.parentNode.classList.add("clicked");
        this.xpos = event.clientX - event.target.parentNode.offsetLeft;
        this.ypos = event.clientY - event.target.parentNode.offsetTop;

        // detta kan jag nog slå ihop till en rad:

        this.mousemove = this.move.bind(this);
        window.addEventListener("mousemove", this.mousemove, false);
    }
};

/**
 * addListeners - lägger till lyssnare på mousedown och mouseup
 */

Desktop.prototype.addListeners = function() {

    document.querySelector("#windowContainer").addEventListener("mousedown", this.mouseDown.bind(this), false);
    window.addEventListener("mouseup", this.mouseUp.bind(this), false);
};

/**
 * addListenerOnExitButton - lägger till en lyssnare på klick och stänger aktuellt fönster om event.target har klassen "exit"
 */

Desktop.prototype.addListenerOnExitButton = function() {

    document.querySelector("#windowContainer").addEventListener("click", function(event) {

        if (event.target.classList.contains("exit")) {

            for (var i = 0; i < this.children.length; i += 1) {
                if (this.children[i].contains(event.target)) {
                    this.removeChild(this.children[i]);
                }
            }
        }
    });
};

/**
 * bringToFront - skickar fram fönster på mousedown
 */


Desktop.prototype.bringToFront = function() {

    var z = 0;

    var windowContainer = document.querySelector("#windowContainer");

    document.querySelector("#windowContainer").addEventListener("mousedown", function(event) {

        // Hittar det högsta z-indexet:

        for (var i = 0; i < windowContainer.children.length; i += 1) {

            if (windowContainer.children[i].style.zIndex && z < windowContainer.children[i].style.zIndex) {
                z = parseInt(windowContainer.children[i].style.zIndex);
            }
        }

        // Korrigerar z-index på det klickade fönstret (jag vet, jag har liknande funktionalitet i shared ... hinner inte rationalisera nu):

        for (var j = 0; j < windowContainer.children.length; j += 1) {

            if (windowContainer.children[j].contains(event.target)) {

                document.querySelector("#windowContainer").children[j].style.zIndex = z + 1;
            }
        }

    }.bind(this));
};

/**
 * rain - genererar slumpvisa regndroppar (de flesta geologistudenter har stått med blöta anteckningsblock ute i naturen)
 */

Desktop.prototype.rain = function() {

    var windowInsides = document.querySelectorAll(".windowInside");
    var waterdrops;
    var rand1 = Math.floor(Math.random() * 90) + 1;

    if (document.querySelector(".windowInside")) {

        for (var i = 0; i < windowInsides.length; i += 1) {

            var rand2 = Math.floor(Math.random() * 90) + 1;
            var rand3 = Math.floor(Math.random() * 90) + 1;

            var waterDrop = document.importNode(document.querySelector("#waterdropTemplate").content, true);

            windowInsides[i].appendChild(waterDrop);

            windowInsides[i].lastElementChild.style.left = rand2 + "%";
            windowInsides[i].lastElementChild.style.top = rand3 + "%";

            waterdrops = windowInsides[i].querySelectorAll(".waterdrop");

            if (waterdrops.length > 3) {
                windowInsides[i].removeChild(waterdrops[0]);
            }
        }
    }

    setTimeout((this.rain).bind(this), rand1 * 70);
};

module.exports = Desktop;
