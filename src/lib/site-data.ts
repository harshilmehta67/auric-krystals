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
    blurb:
      "A personalized Vedic birth-chart analysis — decoding planetary placements across the twelve houses to reveal life purpose, timing, and karmic patterns.",
    href: "/services",
    img: "/assets/kundali-reading.jpg",
    img2: "/assets/kundali-zodiac.jpg",
  },
];
