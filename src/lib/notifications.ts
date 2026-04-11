import nodemailer from "nodemailer";
import { Order } from "@/types";

export async function sendOrderEmail(order: Order) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const itemsList = order.items
    .map((i) => `  • ${i.title} x${i.quantity} — ${i.price}`)
    .join("\n");

  const toEmail = process.env.ADMIN_EMAIL || "astrokrupa16@gmail.com";

  await transporter.sendMail({
    from: `"Auric Krystals" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `New Order #${order.order_number} — ${order.customer_name}`,
    text: [
      `New order received!`,
      ``,
      `Order #${order.order_number}`,
      `Customer: ${order.customer_name}`,
      `Email: ${order.customer_email}`,
      `Phone: ${order.customer_phone}`,
      `Address: ${order.customer_address}`,
      order.order_notes ? `Notes: ${order.order_notes}` : "",
      ``,
      `Items:`,
      itemsList,
      ``,
      `Total: $${order.total.toFixed(2)}`,
      ``,
      `Payment screenshot: ${order.screenshot_url || "Not uploaded"}`,
      ``,
      `Review this order in the admin dashboard.`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <h2>New Order #${order.order_number}</h2>
      <p><strong>Customer:</strong> ${order.customer_name}</p>
      <p><strong>Email:</strong> ${order.customer_email}</p>
      <p><strong>Phone:</strong> ${order.customer_phone}</p>
      <p><strong>Address:</strong> ${order.customer_address}</p>
      ${order.order_notes ? `<p><strong>Notes:</strong> ${order.order_notes}</p>` : ""}
      <h3>Items</h3>
      <ul>${order.items.map((i) => `<li>${i.title} x${i.quantity} — ${i.price}</li>`).join("")}</ul>
      <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
      ${order.screenshot_url ? `<p><a href="${order.screenshot_url}">View Payment Screenshot</a></p>` : ""}
    `,
  });
}

export async function sendTelegramNotification(order: Order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const message = [
    `🔔 *New Order #${order.order_number}*`,
    ``,
    `👤 ${order.customer_name}`,
    `📧 ${order.customer_email}`,
    `📱 ${order.customer_phone}`,
    `📍 ${order.customer_address}`,
    ``,
    `📦 Items:`,
    ...order.items.map((i) => `  • ${i.title} x${i.quantity} — ${i.price}`),
    ``,
    `💰 *Total: $${order.total.toFixed(2)}*`,
  ].join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}
