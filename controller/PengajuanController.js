import Pengajuan from '../models/ModelsPengajuan.js';
import Users from '../models/UserModels.js';
import Pengajuans from '../models/ModelsPengajuan.js';

export const getRiwayatSendiri = async(req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Anda harus login untuk melihat riwayat pengajuan' });
  }

  const userId = req.session.userId; // Mengambil ID pengguna dari sesi

  try {
    const riwayatPengajuan = await Pengajuan.findAll({
      where: { userId }, // Filter berdasarkan ID pengguna yang saat ini login
    });

    res.json(riwayatPengajuan);
  } catch (error) {
    console.error('Error retrieving pengajuan:', error);
    res.status(500).json({ message: 'Error retrieving pengajuan' });
  }
}

export const getRiwayatSampah = async (req, res) => {
  try {
    const data = await Pengajuan.findAll({
      include: [
        {
          model: Users,
          as: 'user',
        },
      ],
    });

    res.json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
}

export const createAlamat = async (req, res) => {
  try {
    const { name, email, nik } = req.session;

    if (!name || !email || !nik) {
      return res.status(400).json({ message: "Data Pengguna tidak ada " });
    }

    const { alamat, no_hp } = req.body;

    const newAddress = await Users.create({
      name,
      nik,
      email,
      alamat,
      no_hp
    });

    res.json(newAddress);
  } catch (error) {
    console.error('Error creating alamat:', error);
    res.status(500).json({ message: 'Error creating alamat' });
  }
}

export const createPengajuan = async (req, res) => {
  try {
    const { banyak_sampah_kg, metode_pembayaran } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Anda harus login untuk membuat pengajuan' });
    }

    // Menghitung total harga pengajuan
    const harga_sampah_per_kg = 2000;
    const harga_sampah = banyak_sampah_kg * harga_sampah_per_kg;

    // Menghitung biaya akomodasi berdasarkan metode pembayaran
    let biaya_akomodasi = 0;

    if (metode_pembayaran === 'cod') {
      biaya_akomodasi = 15000;
    } else if (metode_pembayaran === 'dana' || metode_pembayaran === 'gopay') {
      biaya_akomodasi = 13000;
    }

    const total_harga = harga_sampah + biaya_akomodasi;

    // Mencari pengguna yang sedang login
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Menambahkan saldo poin ke pengguna
    user.saldo_poin += total_harga;

    // Menyimpan perubahan saldo poin pengguna
    await user.save();

    // Membuat pengajuan baru dan menyimpannya ke basis data
    const newPengajuan = await Pengajuan.create({
      userId: userId,
      harga_sampah: harga_sampah.toString(),
      banyak_sampah_kg: banyak_sampah_kg.toString(),
      metode_pembayaran,
      biaya_akomodasi: biaya_akomodasi.toString(),
      total_harga: total_harga.toString(),
      status: 'pending'
    });

    res.json(newPengajuan);
  } catch (error) {
    console.error('Error creating pengajuan:', error);
    res.status(500).json({ message: 'Error creating pengajuan' });
  }
};

export const approvePengajuan = async (req, res) => {
    try {
      const { pengajuanId } = req.params;
      const { isApproved } = req.body;
      const pengajuan = await Pengajuan.findByPk(pengajuanId);

      if (!pengajuan) {
        return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
      }

      // Memproses persetujuan atau penolakan
      if (isApproved) {
        pengajuan.status = 'approved';
        // Lanjutkan dengan langkah-langkah untuk mengizinkan data ini
      } else {
        pengajuan.status = 'rejected';
        // Mungkin Anda ingin memberikan alasan penolakan
        pengajuan.reasonForRejection = req.body.reason;
      }

      await pengajuan.save();

      res.json({ message: 'Pengajuan berhasil diproses' });
    } catch (error) {
      console.error('Error dalam proses persetujuan:', error);
      res.status(500).json({ message: 'Terjadi kesalahan dalam proses persetujuan' });
    }
};