/**
 * Horizontal card carousels: prev/next + scroll-snap + optional dots.
 * Expects window.AK_SITE (site-data.js) when data-ak-carousel-kind is set.
 */
(function () {
    function escapeHtml(s) {
        var d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    function buildProductCards(products) {
        return products
            .map(function (p) {
                var href = "product.html?item=" + encodeURIComponent(p.slug);
                return (
                    '<a href="' +
                    href +
                    '" class="ak-carousel__card group flex flex-col flex-[0_0_min(100%,17.5rem)] sm:flex-[0_0_20rem] lg:flex-[0_0_21rem] bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30 snap-start shrink-0">' +
                    '<div class="overflow-hidden aspect-[4/3]">' +
                    '<img src="' +
                    escapeHtml(p.img) +
                    '" alt="' +
                    escapeHtml(p.title) +
                    '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="300"/>' +
                    "</div>" +
                    '<div class="p-5 flex flex-col flex-1">' +
                    '<h3 class="font-headline text-lg text-primary mb-1">' +
                    escapeHtml(p.title) +
                    "</h3>" +
                    '<p class="text-sm text-on-surface-variant mb-4 flex-1">' +
                    escapeHtml(p.blurb) +
                    "</p>" +
                    '<div class="flex justify-between items-center gap-3">' +
                    '<span class="text-secondary font-bold">' +
                    escapeHtml(p.price) +
                    "</span>" +
                    '<span class="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold">View</span>' +
                    "</div>" +
                    "</div>" +
                    "</a>"
                );
            })
            .join("");
    }

    function buildOfferingCards(items) {
        return items
            .map(function (o) {
                return (
                    '<a href="' +
                    escapeHtml(o.href) +
                    '" class="ak-carousel__card group flex flex-col flex-[0_0_min(100%,17.5rem)] sm:flex-[0_0_20rem] lg:flex-[0_0_21rem] bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30 snap-start shrink-0">' +
                    '<div class="overflow-hidden aspect-[4/3]">' +
                    '<img src="' +
                    escapeHtml(o.img) +
                    '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="300"/>' +
                    "</div>" +
                    '<div class="p-5 flex flex-col flex-1">' +
                    '<h3 class="font-headline text-lg text-primary mb-2">' +
                    escapeHtml(o.title) +
                    "</h3>" +
                    '<p class="text-sm text-on-surface-variant flex-1">' +
                    escapeHtml(o.blurb) +
                    "</p>" +
                    '<span class="mt-4 text-sm font-bold text-secondary group-hover:text-primary transition-colors">Learn more →</span>' +
                    "</div>" +
                    "</a>"
                );
            })
            .join("");
    }

    function scrollAmount(track) {
        var card = track.querySelector(".ak-carousel__card");
        if (!card) return Math.min(320, track.clientWidth * 0.85);
        var gap = 16;
        try {
            var cs = window.getComputedStyle(track);
            var g = cs.gap || cs.columnGap;
            if (g && g.endsWith("px")) gap = parseFloat(g) || 16;
        } catch (e) {}
        return card.getBoundingClientRect().width + gap;
    }

    function initCarousel(root) {
        var track = root.querySelector("[data-ak-carousel-track]");
        if (!track) return;

        var kind = root.getAttribute("data-ak-carousel-kind") || "products";
        if (window.AK_SITE) {
            if (kind === "products") {
                track.innerHTML = buildProductCards(window.AK_SITE.products);
            } else if (kind === "offerings") {
                track.innerHTML = buildOfferingCards(window.AK_SITE.offerings);
            }
        }

        var prev = root.querySelector("[data-ak-carousel-prev]");
        var next = root.querySelector("[data-ak-carousel-next]");
        var dots = root.querySelector("[data-ak-carousel-dots]");

        function updateDots() {
            if (!dots || !track.children.length) return;
            var cards = track.querySelectorAll(".ak-carousel__card");
            if (cards.length <= 1) {
                dots.innerHTML = "";
                dots.hidden = true;
                return;
            }
            dots.hidden = false;
            var idx = Math.round(track.scrollLeft / scrollAmount(track));
            idx = Math.max(0, Math.min(idx, cards.length - 1));
            var html = "";
            for (var i = 0; i < cards.length; i++) {
                html +=
                    '<button type="button" class="ak-carousel__dot' +
                    (i === idx ? " ak-carousel__dot--active" : "") +
                    '" data-index="' +
                    i +
                    '" aria-label="Go to slide ' +
                    (i + 1) +
                    '"></button>';
            }
            dots.innerHTML = html;
        }

        function go(delta) {
            track.scrollBy({ left: delta * scrollAmount(track), behavior: "smooth" });
        }

        if (prev)
            prev.addEventListener("click", function () {
                go(-1);
            });
        if (next) next.addEventListener("click", function () {
            go(1);
        });

        if (dots) {
            dots.addEventListener("click", function (e) {
                var btn = e.target.closest("[data-index]");
                if (!btn) return;
                var i = parseInt(btn.getAttribute("data-index"), 10);
                var cards = track.querySelectorAll(".ak-carousel__card");
                if (!cards[i]) return;
                cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
            });
            track.addEventListener("scroll", function () {
                window.requestAnimationFrame(updateDots);
            });
            updateDots();
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("[data-ak-carousel]").forEach(initCarousel);
    });
})();
