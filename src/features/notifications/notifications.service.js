const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const Users = require("../users/users.model");

async function approveParticipant(participantId) {
    const participant = await Users.findById(participantId);
    if (!participant) throw new Error("Participant not found");

    participant.isApproved = true;
    await participant.save();

    const qrData = `Participant ID: ${participant._id}, Name: ${participant.name}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: participant.email,
        subject: "Your Participation is Approved",
        html: `
            <h1>Congratulations, ${participant.name}!</h1>
            <p>Your participation has been approved. Please find your QR code below:</p>
            <img src="${qrCodeDataUrl}" alt="QR Code" />
        `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { approveParticipant };