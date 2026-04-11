"use client";

import { FormEvent } from "react";

export default function ContactForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    if (typeof form.reportValidity === "function" && !form.reportValidity()) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const subject = (data.get("subject") as string) || "Inquiry";
    const message = (data.get("message") as string) || "";
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    window.location.href = `mailto:astrokrupa16@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div>
        <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Your full name" required
          className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50" />
      </div>
      <div>
        <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@email.com" required
          className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50" />
      </div>
      <div>
        <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="contact-subject">Subject</label>
        <select id="contact-subject" name="subject"
          className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface">
          <option value="Product inquiry">Product inquiry</option>
          <option value="Astrology service">Astrology service</option>
          <option value="Bulk or wholesale order">Bulk or wholesale order</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" placeholder="Tell us what you're looking for…" rows={5} required
          className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all resize-y min-h-[8rem] text-on-surface placeholder:text-on-surface-variant/50" />
      </div>
      <button type="submit" className="w-full py-4 ak-btn-primary bg-primary text-on-primary rounded-xl font-bold tracking-wide hover:opacity-95 transition-opacity">
        Send via email
      </button>
    </form>
  );
}
