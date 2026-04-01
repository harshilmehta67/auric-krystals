/**
 * Single source for contact links, social URLs, and product catalog (cards + product.html).
 */
(function () {
    window.AK_SITE = {
        brand: "Auric Krystals",
        email: "astrokrupa16@gmail.com",
        social: [
            {
                id: "whatsapp",
                label: "WhatsApp group",
                shortLabel: "WhatsApp",
                url: "https://chat.whatsapp.com/G7y78B5CoFh5a5W8ap8MsL",
                icon: "chat",
            },
            {
                id: "instagram",
                label: "Instagram — @astro_krupali_r",
                shortLabel: "Instagram",
                url: "https://www.instagram.com/astro_krupali_r?igsh=aGtvbHdhZmozdW16&utm_source=qr",
                icon: "photo_camera",
            },
            {
                id: "facebook",
                label: "Facebook",
                shortLabel: "Facebook",
                url: "https://www.facebook.com/share/1QLqPg68GN/?mibextid=wwXIfr",
                icon: "public",
            },
            {
                id: "youtube",
                label: "YouTube — @astrokrupalir",
                shortLabel: "YouTube",
                url: "https://youtube.com/@astrokrupalir?si=g7QpAQSPjFMP7C5w",
                icon: "play_circle",
            },
        ],
        products: [
            {
                slug: "rose-quartz-heart",
                title: "Rose Quartz Heart",
                subtitle: "Polished heart — heart chakra",
                price: "$24.99",
                blurb: "Polished heart-shaped rose quartz",
                img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
                desc: "Polished heart-shaped rose quartz, ideal for self-love rituals and gentle emotional support. Each piece is hand-selected for clarity and soft pink tone.",
            },
            {
                slug: "amethyst-cluster",
                title: "Amethyst Cluster",
                subtitle: "Natural specimen — calm & intuition",
                price: "$34.99",
                blurb: "Natural amethyst crystal cluster",
                img: "https://images.unsplash.com/photo-1599644732595-52ea526ce5f0?w=800&h=800&fit=crop",
                desc: "Natural amethyst crystal cluster for meditation and restful energy. Deep violet tones with balanced formation.",
            },
            {
                slug: "citrine-bracelet",
                title: "Citrine Bracelet",
                subtitle: "Beaded — abundance & joy",
                price: "$29.99",
                blurb: "Beaded citrine healing bracelet",
                img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
                desc: "Warm citrine beads strung for daily wear; associated with optimism, confidence, and bright creative flow.",
            },
            {
                slug: "black-tourmaline",
                title: "Black Tourmaline",
                subtitle: "Raw specimens — grounding",
                price: "$19.99",
                blurb: "Raw black tourmaline specimens",
                img: "https://images.unsplash.com/photo-1512138010189-873d58c53143?w=800&h=800&fit=crop",
                desc: "Raw black tourmaline pieces chosen for protective, grounding energy. Perfect for entryways or workspace corners.",
            },
            {
                slug: "clear-quartz-point",
                title: "Clear Quartz Point",
                subtitle: "Polished point — clarity",
                price: "$22.99",
                blurb: "Polished clear quartz point",
                img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
                desc: "A polished clear quartz point to amplify intention and pair with other stones in your practice.",
            },
            {
                slug: "rose-quartz-bracelet",
                title: "Rose Quartz Bracelet",
                subtitle: "Delicate beads — compassion",
                price: "$26.99",
                blurb: "Delicate rose quartz beaded bracelet",
                img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
                desc: "Delicate rose quartz beads for everyday wear; supports gentle heart-opening and emotional balance.",
            },
        ],
        offerings: [
            {
                title: "Kundali readings",
                blurb: "Vedic birth chart insight for life path, timing, and relationships.",
                href: "services.html",
                img: "https://images.unsplash.com/photo-1618644952181-db8e1bcb2c04?w=600&h=600&fit=crop",
            },
            {
                title: "Horoscope & transits",
                blurb: "Monthly and yearly forecasts aligned with planetary movement.",
                href: "services.html",
                img: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&h=600&fit=crop",
            },
            {
                title: "Crystal guidance",
                blurb: "Pair the right stones with your chart and intentions.",
                href: "contact.html",
                img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
            },
        ],
    };

    /** Map slug → product detail fields for product.html */
    window.AK_SITE.getProductCatalog = function () {
        var map = {};
        window.AK_SITE.products.forEach(function (p) {
            map[p.slug] = {
                title: p.title,
                subtitle: p.subtitle,
                price: p.price,
                img: p.img,
                desc: p.desc,
            };
        });
        return map;
    };
})();
