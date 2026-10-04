import pool from "../config/db.js";
import transporter from "../config/email.js";

export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message: "Name can contain only alphabets and spaces",
      });
    }

    const result = await pool.query(
      `INSERT INTO messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, message]
    );

    const newMessage = result.rows[0];

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Portfolio Contact Message",
      text: `
You received a new contact form message.

Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};