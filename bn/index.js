const express = require("express");
const userRoutes = require("./Routes/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Model } = require("./Model/RegisterModel"); // Assuming your model is named RegisterModel
require("./dbconfig");
//comment
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  service: "gmail",
  auth: {
    user: "jaygurjar3045@gmail.com",
    pass: "plwd zsee hrej otcp", // Use app-specific passwords for security
  },
});

// Function to generate a secure random password
function generateSecurePassword(length = 12) {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specialChars = "!@#$%^&*()_-+=<>?/{}[]|";
  const allCharacters = lowerCase + upperCase + digits + specialChars;

  // Ensure the password meets the criteria
  const password = [
    lowerCase[Math.floor(Math.random() * lowerCase.length)], // Ensure at least one lowercase letter
    upperCase[Math.floor(Math.random() * upperCase.length)], // Ensure at least one uppercase letter
    digits[Math.floor(Math.random() * digits.length)], // Ensure at least one digit
    specialChars[Math.floor(Math.random() * specialChars.length)], // Ensure at least one special character
  ];

  // Randomly fill the rest of the password
  for (let i = password.length; i < length; i++) {
    password.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
  }

  // Shuffle the password to randomize the positions
  return password.sort(() => Math.random() - 0.5).join("");
}

// Email template to send to the user
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

// API endpoint to send random password and update the database
app.post("/send-random-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the user exists in the database
    const user = await Model.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a secure random password
    const randomPassword = generateSecurePassword();

    // Hash the random password before saving it
    const hashedPassword = bcrypt.hashSync(randomPassword, 10);

    // Update the user's password in the database
    user.Password = hashedPassword;
    await user.save();

    // Generate the email content with the random password
    const emailContent = generateEmailTemplate(randomPassword);

    // Configure the email options
    const mailOptions = {
      from: "jaygurjar3045@gmail.com", // Use your email here
      to: email,
      subject: "Your Temporary Password",
      html: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(200).json({
      message: "Random password sent to your email, and password updated in the database",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
});

app.use("/User", userRoutes);

app.listen(5000, () => {
  console.log(`Port is running on 5000`);
});
