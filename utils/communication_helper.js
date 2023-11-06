//Returns a object with Email template
export function sendOTPEmail (toEmail, name, emailOTP) {
    return {
        to: toEmail, // list of receivers
        subject: 'Intimation of OTP ', // Subject line
        text: 'Dear ' + name + ',',
        html: 'Dear ' + name + ',<br/>' +
            'Kindly use the One Time Password (OTP); <br/>' +
            '<span>OTP: '+emailOTP+' </span><br/>' +
            '<p>Have a cheerful day! </p><br/>' +
            '<span>Regards,</span><br />' +
            '<span style="color: grey;">Pallab</span>'
    };
}

//Returns a object with Email template
export function sendResendOTPEmail (toEmail, name, otp) {
    return {
        to: toEmail, // list of receivers
        subject: 'Intimation of OTP ', // Subject line
        html: 'Hello ' + name + ',<br/><br/>' +
            'Kindly use the One Time Password (OTP); <br/>' +
            '<span>OTP: '+otp+' </span><br/>'+
            "If you have any concerns or queries, I'm happy to help. Please reach out to me at pallabsarkar31@gmail.com.</p>" +
            '<p><b>Regards,</b></p>' +
            '<p><b>Pallab</b></p>'// html body
    };
}

//Returns a object with Email template
export function sendForgotOTPEmail (toEmail, name, otp) {
    return {
        to: toEmail, // list of receivers
        subject: 'Forgot Password ', // Subject line
        html: 'Hello ' + name + ',<br/><br/>' +
            'The OTP for reset password is: <b>' + otp + '</b> <br/> <br/>' +
            'If you have any concerns or queries, I am happy to help. Please reach out to me at pallabsarkar31@gmail.com.</p>' +
            '<p><b>Regards,</b></p>' +
            '<p><b>Pallab</b></p>'// html body
    };
}
