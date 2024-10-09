import path from "node:path";

import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import { configs } from "../config/configs";
import { emailConstants } from "../constants/email.constans";
import { EmailTypeEnum } from "../enums/emailType.enum";
import { EmailPayloadType } from "../types/email-payload.type";

class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      from: "no reply",
      service: "gmail",
      auth: {
        user: configs.SMTP_EMAIL,
        pass: configs.SMTP_PASSWORD,
      },
    });
    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "layouts",
        ),
        partialsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "partials",
        ),
      },
      viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
      extName: ".hbs",
    };
    this.transporter.use("compile", hbs(hbsOptions));
  }
  public async sendEmail<T extends EmailTypeEnum>(
    email: string,
    type: T,
    context: EmailPayloadType[T],
  ): Promise<void> {
    const { template, subject } = emailConstants[type];
    const emailOptions = {
      to: email,
      subject: subject,
      template: template,
      context: { ...context, frontUrl: configs.APP_FRONT_URL },
    };

    await this.transporter.sendMail(emailOptions);
  }
}
export const emailService = new EmailService();
