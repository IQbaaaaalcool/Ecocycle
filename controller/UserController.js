import Users from "../models/UserModels.js";
import bcrypt from "bcrypt";
import argon2 from "argon2";
import { verifyToken } from "./Auth.js";

export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['id','nik','name','email','role']
        });
        res.status(200).json(response);
        verifyToken;
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
    const { nik, name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password atau Confirm password salah" });
    const hashPassword = await argon2.hash(password);
    // const refreshToken = uuidv4(); // Membuat nilai acak untuk refresh_token
    try {
        await Users.create({
            nik: nik,
            name: name,
            email: email,
            password: hashPassword,
            confirmpasword : confPassword,
            role: 'user', // Menggunakan nilai acak untuk refresh_token
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
    // const refreshToken = uuidv4(); // Membuat nilai acak untuk refresh_token
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