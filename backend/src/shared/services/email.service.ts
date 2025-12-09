import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { UserRole } from '@/generated/enums';

import { renderEmail } from '@/infrastructure/emails';
import { EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM } from '@/config/env.config';

export class EmailService {
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        },
      });
    }

    return this.transporter;
  }

  static async sendWelcomeEmail(
    email: string,
    name: string,
    role: UserRole
  ): Promise<void> {
    try {
      const transporter = this.getTransporter();

      const html = await renderEmail.welcome(name, role);

      await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: '¡Bienvenido a DomiSys! 🎉',
        html,
      });
    } catch (error) {
      console.error('[EMAIL] ❌ Error enviando email de bienvenida:', error);
      if (error instanceof Error) {
        console.error('[EMAIL] 📝 Mensaje de error:', error.message);
        console.error('[EMAIL] 📚 Stack:', error.stack);
      }
    }
  }
}
