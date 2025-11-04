import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { emailTemplate } from '../email/email-template';

export class EmailController {
    async sendEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "rumbocarpool@gmail.com",
                    pass: process.env.EMAIL_API_KEY,
                },
            });

            const sendResetEmail = async (to: string) => {
                await transporter.sendMail({
                    from: `"Rumbo" <rumbocarpool@gmail.com>`,
                    to,
                    subject: "Recuperación de contraseña",
                    html: emailTemplate,
                });
            };

            await sendResetEmail(email);
            return res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error({ error });
            return res.status(500).json({ message: 'Error sending email', error });
        }
    };
}

export const emailController = new EmailController();

