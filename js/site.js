/**
 * Mobile navigation drawer + contact form mailto fallback.
 */
(function () {
    function closeNav() {
        document.querySelectorAll("[data-nav-panel]").forEach(function (panel) {
            panel.classList.add("hidden");
            panel.setAttribute("aria-hidden", "true");
        });
        document.body.classList.remove("overflow-hidden");
    }

    function openNav() {
        document.querySelectorAll("[data-nav-panel]").forEach(function (panel) {
            panel.classList.remove("hidden");
            panel.setAttribute("aria-hidden", "false");
        });
        document.body.classList.add("overflow-hidden");
    }

    document.addEventListener("click", function (e) {
        if (e.target.closest("[data-nav-open]")) {
            e.preventDefault();
            openNav();
            return;
        }
        if (e.target.closest("[data-nav-close]")) {
            e.preventDefault();
            closeNav();
            return;
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeNav();
    });

    document.querySelectorAll("[data-nav-panel] a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeNav();
        });
    });

    var form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            if (typeof form.reportValidity === "function" && !form.reportValidity()) {
                e.preventDefault();
                return;
            }
            e.preventDefault();
            var name = (form.querySelector('[name="name"]') || {}).value || "";
            var email = (form.querySelector('[name="email"]') || {}).value || "";
            var subjectSel = form.querySelector('[name="subject"]');
            var subject = subjectSel ? subjectSel.value : "Inquiry";
            var message = (form.querySelector('[name="message"]') || {}).value || "";
            var body =
                "Name: " +
                name.trim() +
                "\nEmail: " +
                email.trim() +
                "\n\n" +
                message.trim();
            var mailAddr =
                (typeof window.AK_SITE !== "undefined" && window.AK_SITE.email) ||
                "astrokrupa16@gmail.com";
            var mail =
                "mailto:" +
                mailAddr +
                "?subject=" +
                encodeURIComponent(subject) +
                "&body=" +
                encodeURIComponent(body);
            window.location.href = mail;
        });
    }

    window.akCloseMobileNav = closeNav;
})();

/**
 * Header “scrolled” state: reliable elevation when user leaves the top of the page
 * (replaces direction-based compact mode — no scroll-direction bugs).
 */
(function () {
    var header = document.querySelector(".ak-site-header");
    if (!header) return;

    var THRESHOLD = 32;
    var ticking = false;

    function sync() {
        var y = window.scrollY || window.pageYOffset;
        if (y > THRESHOLD) {
            header.classList.add("ak-site-header--scrolled");
        } else {
            header.classList.remove("ak-site-header--scrolled");
        }
    }

    window.addEventListener(
        "scroll",
        function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                sync();
                ticking = false;
            });
        },
        { passive: true }
    );
    sync();
})();
