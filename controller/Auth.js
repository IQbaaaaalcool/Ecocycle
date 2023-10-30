import Users from "../models/UserModels.js";
import { createTransport } from 'nodemailer';
import argon2 from "argon2";
import crypto from "crypto";

export const Login = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Mencari pengguna berdasarkan nama pengguna
    const user = await Users.findOne({
      where: {
        name: name,
      },
    });

    // Jika pengguna tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Memverifikasi kata sandi
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Wrong Password" });
    }

    // Jika autentikasi berhasil, simpan ID pengguna di sesi
    req.session.userId = user.id;

    // Kirim respons dengan informasi pengguna yang berhasil login
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  const transporter = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "104a70f2a14002",
      pass: "454e5c5c47e8e1"
    }
  });

  const { email } = req.body;
  const user = await Users.findOne({ where: { email: req.body.email } });

  // Buat token reset password
  const token = crypto.randomBytes(20).toString('hex');
  const resetLink = `http://yourapp.com/reset-password?token=${token}`;

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // Waktu kadaluwarsa token (contoh: 1 jam)
  user.save();
  // Konfigurasi email
  const mailOptions = {
    from: 'your_email@example.com',
    to: email,
    subject: 'Reset Password',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  // Kirim email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent for password reset' });
    }
  });
}

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await Users.findOne({ where: { resetPasswordToken: token } });
  if (user) {
    // Reset password
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null; // Invalidasi token
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } else {
    res.status(404).json({ message: 'Invalid or expired token' });
  }
}

export const logOut = async (req, res) => {
  const userId = req.session.userId;
  const user = await Users.findOne({ where: { id: userId } });
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ msg: "Tidak dapat logout" });
    }

    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    const { id, name, email, role } = user;
    const clear = process.env.ACCESS_TOKEN_SECRET;
    res.clearCookie(clear);
    res.status(200).json({ msg: "Anda telah logout", id, name, email, role });
  });
}