export interface Mailer {
  send(data: { to: string; template: MailTemplate }): Promise<void>;
}

export type MailTemplate =
  | {
      name: "email-verification";
      data: {
        name: string;
        link: string;
      };
    }
  | {
      name: "password-reset";
      data: {
        name: string;
        link: string;
      };
    };

export const templates = {
  "email-verification": {
    subject: "Email Verification",
    html: (data: { name: string; link: string }) => `
          <h1>Hello ${data.name}</h1>
          <p>Please verify your email by clicking <a href="${data.link}">here</a></p>
        `,
  },
  "password-reset": {
    subject: "Password Reset",
    html: (data: { name: string; link: string }) => `
          <h1>Hello ${data.name}</h1>
          <p>Please reset your password by clicking <a href="${data.link}">here</a></p>
        `,
  },
};
