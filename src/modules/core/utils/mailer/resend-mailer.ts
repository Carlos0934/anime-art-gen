import { Resend } from "resend";
import { Mailer, MailTemplate, templates } from "./interface";

export class ResendMailer implements Mailer {
  private readonly resend: Resend;
  private readonly from: string;
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = process.env.RESEND_FROM_EMAIL!;
  }
  async send(data: { to: string; template: MailTemplate }): Promise<void> {
    const { html, subject } = templates[data.template.name];

    const { error } = await this.resend.emails.send({
      to: data.to,
      subject: subject,
      html: html(data.template.data),
      from: this.from,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
