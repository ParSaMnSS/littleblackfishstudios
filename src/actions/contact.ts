'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return { error: 'All fields are required' };
    }

    if (!EMAIL_RE.test(email)) {
      return { error: 'Please enter a valid email address' };
    }

    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    if (!adminEmail) throw new Error('ADMIN_CONTACT_EMAIL env var is not set');

    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `New Project Proposal from ${escapeHtml(name)}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>New Project Proposal</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Project Details:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Contact form submission error:', err);
    return { error: 'Failed to send message' };
  }
}
