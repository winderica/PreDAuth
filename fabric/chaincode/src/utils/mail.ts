import { createTestAccount, createTransport, getTestMessageUrl, SendMailOptions } from 'nodemailer';

export const mailto = async ({ text, to, from, subject }: SendMailOptions) => {
    const { user, pass } = await createTestAccount();
    const res = await createTransport({
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
    console.log(getTestMessageUrl(res));
};
