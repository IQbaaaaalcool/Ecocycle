import express from "express";
import cors from "cors";
import db from "./config/Database.js";
import session from "express-session";
import UserRoute from "./routes/userRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SequelizeStore from "connect-session-sequelize";
import dotenv from "dotenv";
import ArtikelRoute from "./routes/ArtikelRoute.js";
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
    origin: ['http://192.168.1.9:3000','http://localhost:3000','http://192.168.231.151:3000'],
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));
app.use(UserRoute);
app.use(AuthRoute);
app.use(ArtikelRoute);

app.listen(PORT, () => {
    console.log(`Server berjalan pada IP ${IP_BACKEND}:${PORT}`);
});