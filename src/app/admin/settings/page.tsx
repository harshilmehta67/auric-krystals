"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAdmin } from "../layout";

interface Settings {
  notification_email: string;
  notification_phone: string;
  upi_id: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
}

export default function AdminSettingsPage() {
  const { token } = useAdmin();
  const [settings, setSettings] = useState<Settings>({
    notification_email: "",
    notification_phone: "",
    upi_id: "",
    telegram_bot_token: "",
    telegram_chat_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSettings({
            notification_email: data.settings.notification_email || "",
            notification_phone: data.settings.notification_phone || "",
            upi_id: data.settings.upi_id || "",
            telegram_bot_token: data.settings.telegram_bot_token || "",
            telegram_chat_id: data.settings.telegram_chat_id || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-on-surface-variant">Loading settings...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-headline text-primary mb-6">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
        <div className="bg-white rounded-2xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Notifications</h2>
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2">
              Notification Email
            </label>
            <input
              type="email"
              value={settings.notification_email}
              onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2">
              Notification Phone
            </label>
            <input
              type="tel"
              value={settings.notification_phone}
              onChange={(e) => setSettings({ ...settings, notification_phone: e.target.value })}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
              placeholder="8758848867"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Payment</h2>
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={settings.upi_id}
              onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
              placeholder="yourname@upi"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Telegram Notifications (Optional)</h2>
          <p className="text-sm text-on-surface-variant">
            Create a bot via @BotFather on Telegram, get the token, then message the bot and find your chat ID.
          </p>
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2">
              Bot Token
            </label>
            <input
              type="text"
              value={settings.telegram_bot_token}
              onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
              placeholder="123456:ABC-DEF..."
            />
          </div>
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2">
              Chat ID
            </label>
            <input
              type="text"
              value={settings.telegram_chat_id}
              onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
              placeholder="12345678"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-50 transition-opacity"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-green-600 font-medium text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
