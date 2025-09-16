import { MailtrapClient } from "mailtrap";
import { config } from "dotenv";

config();

const TOKEN = process.env.MAIL_TRAP_TOKEN;

const client = new MailtrapClient({
  token: TOKEN,
  
});

export default client
