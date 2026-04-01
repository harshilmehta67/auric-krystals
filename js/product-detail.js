/**
 * Fills product.html from ?item= slug (catalog from site-data.js when present).
 */
(function () {
    var fallback = {
        "rose-quartz-heart": {
            title: "Rose Quartz Heart",
            subtitle: "Polished heart — heart chakra",
            price: "$24.99",
            img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
            desc: "Polished heart-shaped rose quartz, ideal for self-love rituals and gentle emotional support. Each piece is hand-selected for clarity and soft pink tone.",
        },
        "amethyst-cluster": {
            title: "Amethyst Cluster",
            subtitle: "Natural specimen — calm & intuition",
            price: "$34.99",
            img: "https://images.unsplash.com/photo-1599644732595-52ea526ce5f0?w=800&h=800&fit=crop",
            desc: "Natural amethyst crystal cluster for meditation and restful energy. Deep violet tones with balanced formation.",
        },
        "citrine-bracelet": {
            title: "Citrine Bracelet",
            subtitle: "Beaded — abundance & joy",
            price: "$29.99",
            img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
            desc: "Warm citrine beads strung for daily wear; associated with optimism, confidence, and bright creative flow.",
        },
        "black-tourmaline": {
            title: "Black Tourmaline",
            subtitle: "Raw specimens — grounding",
            price: "$19.99",
            img: "https://images.unsplash.com/photo-1512138010189-873d58c53143?w=800&h=800&fit=crop",
            desc: "Raw black tourmaline pieces chosen for protective, grounding energy. Perfect for entryways or workspace corners.",
        },
        "clear-quartz-point": {
            title: "Clear Quartz Point",
            subtitle: "Polished point — clarity",
            price: "$22.99",
            img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
            desc: "A polished clear quartz point to amplify intention and pair with other stones in your practice.",
        },
        "rose-quartz-bracelet": {
            title: "Rose Quartz Bracelet",
            subtitle: "Delicate beads — compassion",
            price: "$26.99",
            img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
            desc: "Delicate rose quartz beads for everyday wear; supports gentle heart-opening and emotional balance.",
        },
    };

    var catalog =
        typeof window.AK_SITE !== "undefined" && typeof window.AK_SITE.getProductCatalog === "function"
            ? window.AK_SITE.getProductCatalog()
            : fallback;

    var params = new URLSearchParams(window.location.search);
    var key = params.get("item") || "amethyst-cluster";
    var p = catalog[key] || catalog["amethyst-cluster"];

    var elTitle = document.getElementById("product-title");
    var elSub = document.getElementById("product-subtitle");
    var elPrice = document.getElementById("product-price");
    var elDesc = document.getElementById("product-desc");
    var elImg = document.getElementById("product-image");
    if (elTitle) elTitle.textContent = p.title;
    if (elSub) elSub.textContent = p.subtitle;
    if (elPrice) elPrice.textContent = p.price;
    if (elDesc) elDesc.textContent = p.desc;
    if (elImg) {
        elImg.src = p.img;
        elImg.alt = p.title;
    }
    document.title = p.title + " — Auric Krystals";
})();
