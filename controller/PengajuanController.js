import Pengajuan from '../models/ModelsPengajuan.js';
import Users from '../models/UserModels.js';
import jwt from 'jsonwebtoken';

export const createPengajuan = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { banyak_sampah_kg, metode_pembayaran } = req.body;
    const user = req.user; // Mengambil informasi pengguna dari token di header

    if (user && user.token) {
      const harga_sampah_per_kg = 2000;
      const harga_sampah = banyak_sampah_kg * harga_sampah_per_kg;

      // Menghitung biaya akomodasi berdasarkan metode pembayaran
      let biaya_akomodasi = 0;

      if (metode_pembayaran === 'cod') {
        biaya_akomodasi = 15000;
      } else if (metode_pembayaran === 'dana' || metode_pembayaran === 'gopay') {
        biaya_akomodasi = 13000;
      }

      // Menghitung total harga   
      const total_harga = harga_sampah + biaya_akomodasi;

      // Membuat pengajuan baru dalam model Pengajuan dan menyimpannya ke basis data
      const newPengajuan = await Pengajuan.create({
        userId: user.id, // Menggunakan ID pengguna yang sudah diidentifikasi
        harga_sampah: harga_sampah.toString(),
        banyak_sampah_kg: banyak_sampah_kg.toString(),
        metode_pembayaran,
        biaya_akomodasi: biaya_akomodasi.toString(),
        total_harga: total_harga.toString(),
      });

      res.json(newPengajuan);
    } else {
      if (!user) return res.status(403).json({ msg: 'Tidak ada token' });
    }
  } catch (error) {
    console.error('Error creating pengajuan:', error);
    res.status(500).json({ message: 'Error creating pengajuan' });
  }
};