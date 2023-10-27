import express from "express";
import cors from "cors";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import dotenv from "dotenv";
import db from "./config/Database.js";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/userRoute.js";
import ArtikelRoute from "./routes/ArtikelRoute.js";
import PengajuanRoute from "./routes/PengajuanRoute.js";
dotenv.config();

const app = express();
const IP_BACKEND = '192.168.28.175';
const PORT = 5000;
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

// (async()=>{
// await db.sync();  
// })();

app.use(express.json());
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));
app.use(cors({
    credentials: true,
    origin: ['http://192.168.1.9:3000','http://192.168.1.9','http://192.168.231.147','http://192.168.231.151','http://192.168.231.151:3000'],
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));
app.use(UserRoute);
app.use(AuthRoute);
app.use(ArtikelRoute);
app.use(PengajuanRoute);

app.listen(PORT, () => {
    console.log(`Server berjalan pada IP ${IP_BACKEND}:${PORT}`);
});