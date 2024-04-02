export interface Mailer {
  send(data: { to: string; subject: string; text: string }): Promise<void>;
}
