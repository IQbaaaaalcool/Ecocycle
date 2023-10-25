import { Sequelize } from "sequelize";

const db = new Sequelize('ecocycle','root','',{
    host: "localhost",
    dialect: "mysql"
});

export default db