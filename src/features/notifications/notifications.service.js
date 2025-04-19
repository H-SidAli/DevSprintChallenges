const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const Users = require("../users/users.model");
const Notifications = require("./notifications.model");
const ParticipationRequests = require("../eventRequests/eventRequests.model");

async function approveParticipant(requestId) {
    // First get the request to find the participant ID
    const request = await ParticipationRequests.findById(requestId);
    if (!request) throw new Error("Request not found");

    const participant = await Users.findById(request.participantId);
    if (!participant) throw new Error("Participant not found");

    const existingNotification = await Notifications.findOne({
        eventRequestId: requestId,
    });
    if (existingNotification) {
        console.log("Notification already exists for this request.");
        return;
    }
    // Create new notification
    const notification = new Notifications({
        eventRequestId: requestId,
        content: `Your participation request has been approved. Please find your QR code below.`,
        isAccepted: true,
        isRead: false,
    });
    await notification.save();

    // Generate participant's full name
    const participantName = `${participant.firstName} ${participant.lastName}`;

    // Generate QR code data and convert to buffer
    const qrData = `Participant ID: ${participant._id}, Name: ${participantName}`;
    const qrCodeBuffer = await QRCode.toBuffer(qrData);
    
    // Save QR code to the eventRequest model
    request.qrCode = qrCodeBuffer.toString('base64');
    await request.save();

    console.log("QR Code generated successfully");
    console.log("yo5ts rana hna");
    console.log(`participant email: ${participant.email}`);

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error(
            "EMAIL_USER or EMAIL_PASS environment variables are not set"
        );
        throw new Error("Email configuration missing");
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // your Gmail address
            pass: process.env.EMAIL_PASS, // your Gmail password or app password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: participant.email,
        subject: "Your Participation is Approved",
        html: `
            <h1>Congratulations, ${participantName}!</h1>
            <p>Your participation has been approved. Please find your QR code below:</p>
            <img src="cid:qrcode" alt="QR Code" />
        `,
        attachments: [
            {
                filename: 'qrcode.png',
                content: qrCodeBuffer,
                cid: 'qrcode'
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email notification");
    }
}

module.exports = { approveParticipant };
