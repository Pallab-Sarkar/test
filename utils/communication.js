import { createTransport } from 'nodemailer';

// creating instance for smtp server
var smtpTransport = createTransport({

    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user : 'noreply@apoint.co.in',
        pass: 'welcome#44'
    },
    tls: {
        rejectUnauthorized: false
    }
});

//Sending email with otp and email template
export function sendMail (mailOptions) {
    mailOptions.from = '"Pallab"';
    smtpTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Mail sent: ', info);
            }
        });
}