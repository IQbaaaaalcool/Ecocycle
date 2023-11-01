import Users from "../models/UserModels.js";
import Pengajuan from "../models/ModelsPengajuan.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import argon2 from "argon2";

export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['id','nik','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const getUserById = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['id','nik','name','email','role'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }
    
    const { nik, name, email, password, confPassword, role } = req.body;
    if (name.includes(' ')) {
        return res.status(400).json({ msg: 'Nama tidak boleh mengandung spasi' });
    }

    if (password.length < 8) {
        return res.status(400).json({ msg: "Password harus memiliki setidaknya 8 karakter" });
    }

    if (password !== confPassword) return res.status(400).json({ msg: "Password atau Confirm password salah" });
    const hashPassword = await argon2.hash(password);
    // const refreshToken = uuidv4(); // Membuat nilai acak untuk refresh_token
    try {
        const existingUser = await Users.findOne({
            where: { name }
        });
        
        if (existingUser) {
            return res.status(400).json({ msg: 'username sudah digunakan' });
        }
        
        await Users.create({
            nik: nik,
            name: name,
            email: email,
            password: hashPassword,
            confirmpasword : confPassword,
            role: 'user',
        });
        res.json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error);
    }
};

export const createAdmin = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password atau Confirm password salah" });
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            confirmpasword : confPassword,
            role: 'admin', // Menggunakan nilai acak untuk refresh_token
        });
        res.json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error);
    }
};

export const deleteUsers = async (req, res) => {
    try {
        // Hapus semua data pengajuan yang terkait dengan pengguna
        await Pengajuan.destroy({ where: { userId: userId } });

        // Hapus akun pengguna
        await Users.destroy();
        res.json({ message: 'Pengguna berhasil dihapus' });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
      }
}