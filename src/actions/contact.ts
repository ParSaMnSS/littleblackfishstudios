'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return { error: 'All fields are required' };
    }

    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['hamedheydaricontact@gmail.com'],
      subject: `New Project Proposal from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>New Project Proposal</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Project Details:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
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
