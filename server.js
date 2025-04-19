require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { v4: uuidv4 } = require("uuid");
const PORT = 3000;

// middlewares dyal json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const appRoutes = require("./src/app.routes.js");
app.use("/", appRoutes);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(3000, () =>
            console.log("🚀 Server running on http://localhost:3000")
        );
    })
    .catch((err) => console.error("❌ DB Connection error:", err));

/*async function codeQR(req, res) {
    try {
        const uniqueString = uuidv4(); // Generate a unique identifier
        const qrCodeDataUrl = await QRCode.toDataURL(uniqueString);

        res.send(`
      <h1>Your Unique QR Code</h1>
      <p>Unique Text: ${uniqueString}</p>
      <img src="${qrCodeDataUrl}" alt="QR Code"/>
    `);
    } catch (err) {
        res.status(500).send("Error generating QR code.");
    }
}

app.listen(PORT, () => {
    console.log(`QR Code Generator running at http://localhost:${PORT}`);
});*/
