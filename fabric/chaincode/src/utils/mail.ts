import { createTestAccount, createTransport, SendMailOptions } from 'nodemailer';

export const mailto = async ({ text, to, from, subject }: SendMailOptions) => {
    const { user, pass } = await createTestAccount();
    await createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user,
            pass,
        },
    }).sendMail({
        from,
        to,
        subject,
        text,
        html: `<b>${text as string}</b>`,
    });
};
