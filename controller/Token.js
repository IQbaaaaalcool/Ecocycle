export const Acces = async (req, res, next) => {
    if (req.session.userId) {
        // Pengguna telah login, lanjutkan ke rute berikutnya
        next();
    } else {
        // Pengguna belum login, kirim respons dengan status 401 (Unauthorized)
        res.status(401).json({ message: 'Anda harus login untuk mengakses rute ini' });
    }  
}