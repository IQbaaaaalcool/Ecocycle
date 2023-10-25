import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('users',{
    id:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // Gunakan UUID versi 4
        primaryKey: true,
    },
    nik:{
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true,
    timestamps: true
});

export default Users;