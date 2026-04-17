import { Offering, SocialLink } from "@/types";

export const brand = "Auric Krystals";
export const email = "astrokrupa16@gmail.com";

export const social: SocialLink[] = [
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
];

export const offerings: Offering[] = [
  {
    title: "Kundali readings",
    blurb: "Vedic birth chart insight for life path, timing, and relationships.",
    href: "/services",
    img: "https://images.unsplash.com/photo-1618644952181-db8e1bcb2c04?w=600&h=600&fit=crop",
  },
  {
    title: "Horoscope & transits",
    blurb: "Monthly and yearly forecasts aligned with planetary movement.",
    href: "/services",
    img: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&h=600&fit=crop",
  },
  {
    title: "Crystal guidance",
    blurb: "Pair the right stones with your chart and intentions.",
    href: "/contact",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
  },
];
