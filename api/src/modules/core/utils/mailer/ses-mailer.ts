import { SES, SendEmailCommand } from "@aws-sdk/client-ses";
import { Mailer, MailTemplate, templates } from "./interface";

export class SesMailer implements Mailer {
  private ses: SES;

  constructor() {
    this.ses = new SES({
      apiVersion: "2010-12-01",
      region: process.env.AWS_REGION,
    });
  }

  async send(data: { to: string; template: MailTemplate }): Promise<void> {
    const template = templates[data.template.name];
    if (!template) throw new Error("Template not found");

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [data.to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: template.html(data.template.data),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: template.subject,
        },
      },
      Source: process.env.EMAIL_FROM!,
    });
    const result = await this.ses.send(command);
  }
}
