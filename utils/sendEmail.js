import nodemailer from 'nodemailer';

export default async function sendEmail({ recepient, subject, text }) {
    try{

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    }
    });

const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: recepient,
    subject: subject,
    text: text,
    };

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
    } 
    catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
  
}




