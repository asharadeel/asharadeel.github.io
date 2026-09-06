/* =========================================================
   Portfolio hub + section page behaviour
   ========================================================= */

(function () {
    "use strict";

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----- hub: pointer glow + centre circle caption ----- */

    var core = document.querySelector(".core");
    var label = document.querySelector(".core__label");
    var eyebrow = document.querySelector(".core__eyebrow");
    var restLabel = label ? label.textContent : "";
    var restEyebrow = eyebrow ? eyebrow.textContent : "";
    var swapTimer = null;

    function setCaption(text, eyebrowText) {
        if (!label || label.textContent === text) { return; }

        window.clearTimeout(swapTimer);
        label.classList.add("is-swapping");

        swapTimer = window.setTimeout(function () {
            label.textContent = text;
            if (eyebrow) { eyebrow.textContent = eyebrowText; }
            label.classList.remove("is-swapping");
        }, reduced ? 0 : 180);
    }

    /* the four tiles and the circle itself all carry a caption */
    var sources = document.querySelectorAll("[data-label]");

    Array.prototype.forEach.call(sources, function (el) {
        var glow = el.querySelector(".tile__glow");
        var isTile = el.classList.contains("tile");

        if (glow) {
            el.addEventListener("pointermove", function (event) {
                if (reduced) { return; }
                var box = el.getBoundingClientRect();
                glow.style.setProperty("--mx", (event.clientX - box.left) + "px");
                glow.style.setProperty("--my", (event.clientY - box.top) + "px");
            });
        }

        function enter() {
            setCaption(el.dataset.label || restLabel, el.dataset.eyebrow || restEyebrow);
            /* the scrim stays up while a tile is hovered; the circle handles its own via CSS */
            if (core && isTile) { core.classList.add("is-active"); }
        }

        function leave() {
            setCaption(restLabel, restEyebrow);
            if (core && isTile) { core.classList.remove("is-active"); }
        }

        el.addEventListener("pointerenter", enter);
        el.addEventListener("focus", enter);
        el.addEventListener("pointerleave", leave);
        el.addEventListener("blur", leave);
    });

    /* ----- the icon asks before it leaves the portfolio ----- */

    var disc = document.querySelector(".core__disc");

    if (disc) {
        var popup = document.createElement("dialog");
        popup.id = "returnPopup";

        var popupInner = document.createElement("div");
        popupInner.className = "returnInner";

        var popupTitle = document.createElement("h2");
        popupTitle.className = "returnTitle";
        popupTitle.textContent = "Return to main site?";

        var popupText = document.createElement("p");
        popupText.className = "returnText";
        popupText.textContent = "You are leaving the portfolio and going back to the main site.";

        var popupButtons = document.createElement("div");
        popupButtons.className = "returnButtons";

        var popupStay = document.createElement("button");
        popupStay.className = "returnBtn";
        popupStay.type = "button";
        popupStay.textContent = "Stay Here";

        /* an a tag so a middle click still opens it in a new tab */
        var popupGo = document.createElement("a");
        popupGo.className = "returnBtn returnBtn--go";
        popupGo.href = disc.getAttribute("href");
        popupGo.textContent = "Return";

        popupButtons.appendChild(popupStay);
        popupButtons.appendChild(popupGo);
        popupInner.appendChild(popupTitle);
        popupInner.appendChild(popupText);
        popupInner.appendChild(popupButtons);
        popup.appendChild(popupInner);
        document.body.appendChild(popup);

        disc.addEventListener("click", function (event) {
            /* a ctrl or middle click still opens the main site in a new tab */
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) {
                return;
            }

            event.preventDefault();
            popup.showModal();
        });

        popupStay.addEventListener("click", function () {
            popup.close();
        });

        /* close when the dark area around the box is clicked */
        popup.addEventListener("click", function (event) {
            if (event.target === popup) {
                popup.close();
            }
        });
    }

    /* ----- section pages: reveal on scroll ----- */

    var reveals = document.querySelectorAll(".reveal");

    if (!reveals.length) { return; }

    if (reduced || !("IntersectionObserver" in window)) {
        Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-in"); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    Array.prototype.forEach.call(reveals, function (el) { observer.observe(el); });
}());
