const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Ensure this matches .env
            pass: process.env.EMAIL_PASS  // Ensure this matches .env
        }
    });

    const mailOptions = {
        from: `EventPro <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;