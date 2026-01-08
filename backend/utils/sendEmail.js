const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: `EventPro <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

const sendBookingEmail = async (userEmail, bookingDetails) => {
    const mailOptions = {
        from: `EventPro <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Booking Confirmed: ${bookingDetails.eventTitle}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #1e3a8a;">Success! Your ticket is booked.</h2>
                <p>Hello,</p>
                <p>Your booking for <strong>${bookingDetails.eventTitle}</strong> has been confirmed.</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Seats:</strong> ${bookingDetails.ticketCount}</p>
                    <p style="margin: 5px 0;"><strong>Total Paid:</strong> ₹${bookingDetails.totalPrice}</p>
                </div>
                <p>You can download your PDF ticket from the "My Bookings" section in your dashboard.</p>
                <p>Thank you for using <strong>EventPro</strong>!</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email Error:", error);
    }
};

module.exports = { sendEmail, sendBookingEmail };