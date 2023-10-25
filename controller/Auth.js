import Users from "../models/UserModels.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Login = async (req, res) =>{
  const user = await Users.findOne({
      where: {
          email: req.body.email
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

  if (queryToken) {
    // Anda dapat memverifikasi token ini seperti yang dilakukan dalam middleware
    // jwt.verify(queryToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //    if (err) {
    //        return res.sendStatus(403);
    //    }
    //    req.user = decoded;
    //    next();
    // });

    // Atau jika Anda ingin memanfaatkan token query string sebagai cara bypass, Anda dapat mengabaikan verifikasi
    // Ini hanya untuk pengujian dan pengembangan, tidak dianjurkan dalam produksi
  }

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
};

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
    res.clearCookie('token');
    res.status(200).json({ msg: "Anda telah logout", id, name, email, role });
  });
}