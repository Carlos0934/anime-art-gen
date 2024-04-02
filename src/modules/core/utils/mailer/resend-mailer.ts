import { Mailer } from "./interface";

export class ResendMailer implements Mailer {
  async send(data: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    console.log(`Sending email to ${data.to}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Text: ${data.text}`);
  }
}
