const express = require("express");
const userRoutes = require("./Routes/User");
const nodemailer=require("nodemailer")
require("./dbconfig");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});



// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'jaygurjar3045@gmail.com',
      pass: 'jay 12345',
  },
});

// Function to generate a random password
function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex');
}

// Email template
function generateEmailTemplate(password) {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 500px; margin: auto;">
          <h2 style="color: #2C3E50;">Your New Temporary Password</h2>
          <p style="font-size: 16px; color: #333;">Here is your randomly generated password:</p>
          <p style="font-size: 18px; font-weight: bold; color: #E74C3C;">${password}</p>
          <p style="font-size: 14px; color: #555;">Please change your password after logging in for security purposes.</p>
          <p style="font-size: 14px; color: #777;">Best Regards,<br>Your Company Team</p>
      </div>
  `;
}

// API endpoint to send random password
app.post('/send-random-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }

  const randomPassword = generateRandomPassword();
  const emailContent = generateEmailTemplate(randomPassword);

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Temporary Password',
      html: emailContent,
  };

  try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Random password sent to your email' });
  } catch (error) {
      res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});


app.use("/User", userRoutes);
app.listen(5000, () => {
  console.log(`port is run on 5000`);
});
