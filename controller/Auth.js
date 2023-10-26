import Users from "../models/UserModels.js";
import { createTransport } from 'nodemailer';
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const Login = async (req, res) =>{
  const user = await Users.findOne({
      where: {
          name: req.body.name
      }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
  const match = await argon2.verify(user.password, req.body.password);
  if(!match) return res.status(400).json({msg: "Wrong Password"});
  const userId = req.session.userId = user.id;   
  const id = userId;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  const token = jwt.sign({ id, name, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  res.status(200).json({id, name, email, role, token});
}

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  const queryToken = req.query.token;

  // if (queryToken) {
  //   // Anda dapat memverifikasi token ini seperti yang dilakukan dalam middleware
  //   // jwt.verify(queryToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //   //    if (err) {
  //   //        return res.sendStatus(403);
  //   //    }
  //   //    req.user = decoded;
  //   //    next();
  //   // });

  //   // Atau jika Anda ingin memanfaatkan token query string sebagai cara bypass, Anda dapat mengabaikan verifikasi
  //   // Ini hanya untuk pengujian dan pengembangan, tidak dianjurkan dalam produksi
  // }

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
  // const token = req.headers.authorization; // Atau cara lain di mana Anda mengirim token

  // if (token == null) {
  //   return res.sendStatus(401); // Unauthorized
  // }

  // jwt.verify(token, 'process.env.ACCESS_TOKEN_SECRET', (err, user) => {
  //   if (err) {
  //     return res.sendStatus(403); // Forbidden
  //   }
  //   req.user = user; // Menyimpan informasi pengguna dalam objek req untuk digunakan di endpoint lain
  //   next();
  // });

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

// export const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     const user = await Users.findOne({ where: { resetPasswordToken: token } });

//     if (user) {
//       // Verifikasi apakah token masih berlaku (misalnya, token belum kadaluwarsa)
//       if (user.resetPasswordExpires > Date.now()) {
//         // Reset password
//         user.password = newPassword;
//         user.resetPasswordToken = null; // Invalidasi token
//         await user.save();

//         return res.status(200).json({ message: 'Password reset successful' });
//       } else {
//         return res.status(400).json({ message: 'Expired token. Please request a new one.' });
//       }
//     } else {
//       return res.status(404).json({ message: 'Invalid token. Password reset failed.' });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred while resetting the password.' });
//   }
// }

export const logOut = async (req, res) => {
  const userId = req.session.userId; // Mengambil ID pengguna dari sesi sebelum menghancurkan sesi
  // Mengambil informasi pengguna berdasarkan ID pengguna sebelum sesi dihancurkan
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