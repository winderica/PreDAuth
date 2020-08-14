import { createTestAccount, createTransport, getTestMessageUrl, SendMailOptions } from 'nodemailer';

export const mailto = async ({ text, to, from, subject }: SendMailOptions) => {
    const options: SendMailOptions = {
        from,
        to,
        subject,
        text,
        html: `[PreDAuth] 您的验证码为：<b>${text as string}</b> （10分钟之内有效）`,
    };
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
        await createTransport({
            service: 'DebugMail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        }).sendMail(options);
    }
    const { user, pass } = await createTestAccount();
    const res = await createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user,
            pass,
        },
    }).sendMail(options);
    console.log(getTestMessageUrl(res));
};
